package main

import (
	"context"
	"database/sql"
	"errors"
	"flag"
	"log"
	"math/rand"
	"net"
	"os"
	"os/signal"
	"time"

	"gitlab.com/adamyakes/capstone/css"

	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

var db *sql.DB

func main() {
	rand.Seed(time.Now().UnixNano())
	flagset := flag.NewFlagSet("GRPC Server", flag.ExitOnError)
	connection := flagset.String("c", "", "postgres connection string")
	flagset.Parse(os.Args[1:])
	if *connection == "" {
		flagset.Usage()
		os.Exit(1)
	}
	var err error
	db, err = sql.Open("postgres", *connection)
	if err != nil {
		log.Fatal(err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	lis, err := net.Listen("tcp", ":9090")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	css.RegisterCSSServer(grpcServer, &cssServer{})
	log.Println("Serving")

	finished := make(chan struct{})
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, os.Kill)
		<-c
		grpcServer.GracefulStop()
		log.Println("Gracefully shutdown server.")
		if err := db.Close(); err != nil {
			log.Printf("error closing database: %v\n", err)
		}
		log.Println("Closed database connection.")
		close(finished)
	}()
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatal(err)
	}
	<-finished
}

type cssServer struct{}

func (*cssServer) NewSaveCode(context.Context, *css.Empty) (*css.SaveCode, error) {
	log.Println("Getting new save code")
	var saveCode css.SaveCode

	const query = `insert into session default values returning id`
	row := db.QueryRow(query)
	err := row.Scan(&saveCode.SaveCode)

	if err != nil {
		return nil, err
	}
	return &saveCode, nil
}

func (*cssServer) ValidateSaveCode(_ context.Context, code *css.SaveCode) (*css.SaveCodeValidationResponse, error) {
	log.Printf("Validating save code: %v\n", code.SaveCode)
	row := db.QueryRow(`select count(*) from session where id = $1`, code.SaveCode)
	var count int
	err := row.Scan(&count)

	if err != nil {
		return nil, err
	}
	return &css.SaveCodeValidationResponse{Valid: count > 0}, nil
}

func (*cssServer) BoundedBuffer(o *css.BufferOptions, s css.CSS_BoundedBufferServer) error {
	log.Println("Entered BoundedBuffer")
	stats := make([]*BufferStat, o.NumConsumers+o.NumProducers, o.NumProducers+o.NumConsumers)
	for i := range stats {
		stat := &BufferStat{Last: time.Now().UnixNano()}
		if i < int(o.NumProducers) {
			stat.ActorType = "producer"
		} else {
			stat.ActorType = "consumer"
		}
		stats[i] = stat
	}
	c := css.BoundedBuffer(*o)
	for state := range c {
		stats[state.Id].update(state)
		if err := s.Send(state); err != nil {
			return err
		}
	}
	log.Println("Exiting BoundedBuffer")
	return saveBufferToDB(*o, stats)
}

func saveBufferToDB(o css.BufferOptions, stats []*BufferStat) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	row := tx.QueryRow(
		`insert into buffer_run (session_id, timestamp, duration, buffer_size, num_producers, num_consumers, produce_time, consume_time, variation, sleep_time) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id`,
		o.SaveCode.SaveCode,
		time.Now(),
		o.Duration,
		o.BufferSize,
		o.NumProducers,
		o.NumConsumers,
		o.ProduceTime,
		o.ConsumeTime,
		o.Variation,
		o.SleepTime,
	)

	var id int64
	if err = row.Scan(&id); err != nil {
		_ = tx.Rollback()
		return err
	}

	for num, v := range stats {
		_, err = tx.Exec(
			`insert into buffer_stat (buffer_run_id, buffer_number, actor_type, cycles, max_action_time, max_wait_time, min_action_time, min_wait_time, total_action_time, total_wait_time) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			id,
			num,
			v.ActorType,
			v.Cycles,
			v.ActionTime.Max,
			v.WaitTime.Max,
			v.ActionTime.Min,
			v.WaitTime.Min,
			v.ActionTime.Total,
			v.WaitTime.Total,
		)
		if err != nil {
			_ = tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

func (*cssServer) GetBufferStats(_ context.Context, code *css.SaveCode) (*css.BufferStats, error) {
	res, err := db.Query(`select * from buffer_run br where br.session_id = $1 order by br.id desc`, code.SaveCode)
	if err != nil {
		return nil, err
	}

	// Grab runs
	var runs = make(map[int64]*css.BufferRun)
	for res.Next() {
		var id int64
		var run = new(css.BufferRun)
		run.Options = new(css.BufferOptions)
		run.Options.SaveCode = new(css.SaveCode)
		var timeValue time.Time
		if err := res.Scan(
			&id,
			&(run.Options.SaveCode.SaveCode),
			&timeValue,
			&(run.Options.Duration),
			&(run.Options.BufferSize),
			&run.Options.NumProducers,
			&(run.Options.NumConsumers),
			&(run.Options.ProduceTime),
			&(run.Options.ConsumeTime),
			&(run.Options.Variation),
			&(run.Options.SleepTime),
		); err != nil {
			log.Fatal(err)
		}
		run.Timestamp = timeValue.UnixNano()
		runs[id] = run
	}

	// Grab the individual stats.
	res, err = db.Query(`select bs.* from buffer_run br join buffer_stat bs on br.id = bs.buffer_run_id where br.session_id = $1 order by bs.buffer_run_id, bs.buffer_number;`, code.SaveCode)
	if err != nil {
		return nil, err
	}
	for res.Next() {
		var id int64 = -1
		var throwaway string
		var stat = new(css.BufferRunStat)
		if err := res.Scan(
			&id,
			&stat.BufferStatNum,
			&throwaway,
			&stat.Actions,
			&stat.ActionTimeMax,
			&stat.WaitTimeMax,
			&stat.ActionTimeMin,
			&stat.WaitTimeMin,
			&stat.ActionTimeTotal,
			&stat.WaitTimeTotal,
		); err != nil {
			panic(err)
		}
		runs[id].Stats = append(runs[id].Stats, stat)
	}

	result := new(css.BufferStats)
	for _, v := range runs {
		result.BufferRuns = append(result.BufferRuns, v)
	}
	return result, nil
}

func (*cssServer) Unisex(o *css.UnisexOptions, s css.CSS_UnisexServer) error {
	log.Println("Hit Unisex endpoint")
	stats := make([]*UnisexStat, o.NumMales+o.NumFemales, o.NumMales+o.NumFemales)
	for i := range stats {
		stat := &UnisexStat{Last: time.Now().UnixNano()}
		if i < int(o.NumMales) {
			stat.ActorType = "male"
		} else {
			stat.ActorType = "female"
		}
		stats[i] = stat
	}
	var c <-chan *css.UnisexState
	if o.Solution == css.UnisexOptions_FIRST {
		c = css.FirstUnisex(*o)
	} else {
		c = css.NoStarveUnisex(*o)
	}
	for value := range c {
		if value.Id >= 0 {
			stats[value.Id].update(value)
		}
		if err := s.Send(value); err != nil {
			log.Println("Error in unisex:", err)
			return err
		}
	}
	return storeUnisex(*o, stats)
}

func (*cssServer) GetUnisexStats(_ context.Context, code *css.SaveCode) (*css.UnisexStats, error) {
	res, err := db.Query(`select * from unisex_run ur where ur.session_id = $1 order by ur.id desc`, code.SaveCode)
	if err != nil {
		return nil, err
	}

	// Grab runs
	var runs = make(map[int64]*css.UnisexRun)
	for res.Next() {
		var id int64
		var run = new(css.UnisexRun)
		run.Options = new(css.UnisexOptions)
		run.Options.SaveCode = new(css.SaveCode)
		var timeValue time.Time
		if err := res.Scan(
			&id,
			&(run.Options.SaveCode.SaveCode),
			&timeValue,
			&(run.Options.Duration),
			&(run.Options.Solution),
			&run.Options.NumMales,
			&(run.Options.NumFemales),
			&(run.Options.FemaleTime),
			&(run.Options.MaleTime),
			&(run.Options.Variation),
			&(run.Options.RestartTime),
		); err != nil {
			log.Fatal(err)
		}
		run.Timestamp = timeValue.UnixNano()
		runs[id] = run
	}

	// Grab the individual stats.
	res, err = db.Query(`select us.* from unisex_run ur join unisex_stat us on ur.id = us.unisex_run_id where ur.session_id = $1 order by us.unisex_run_id, us.unisex_number;`, code.SaveCode)
	if err != nil {
		return nil, err
	}
	for res.Next() {
		var id int64 = -1
		var throwaway string
		var stat = new(css.UnisexRunStat)
		if err := res.Scan(
			&id,
			&stat.Id,
			&throwaway,
			&stat.TimesUsed,
			&stat.TimeUsingMax,
			&stat.WaitTimeMax,
			&stat.TimeUsingMin,
			&stat.WaitTimeMin,
			&stat.TimeUsingTotal,
			&stat.WaitTimeTotal,
		); err != nil {
			panic(err)
		}
		runs[id].Stats = append(runs[id].Stats, stat)
	}

	result := new(css.UnisexStats)
	for _, v := range runs {
		result.UnisexRuns = append(result.UnisexRuns, v)
	}
	return result, nil
}

func (p *cssServer) ReadWrite(o *css.RWOptions, s css.CSS_ReadWriteServer) error {
	log.Println("Entering ReadWrite")

	stats := make([]*ReadWriteStat, o.NumReaders+o.NumWriters, o.NumReaders+o.NumWriters)
	for i := range stats {
		stat := new(ReadWriteStat)
		stat.Last = time.Now().UnixNano()
		if i < int(o.NumReaders) {
			stat.ActorType = "reader"
		} else {
			stat.ActorType = "writer"
		}
		stats[i] = stat
	}

	c := css.ReadWrite(o)

	for state := range c {
		temp := state
		stats[temp.Id].update(temp)
		if err := s.Send(&temp); err != nil {
			log.Println("Canceled, finishing out channel")
			go func() {
				for range c {
				}
				log.Println("Channel exhausted")
			}()
			return err
		}
	}
	err := saveRWToDB(*o, stats)
	log.Println("Returning from ReadWrite")
	return err
}

func (stat *ReadWriteStat) update(state css.RWState) {
	delta := state.Time - stat.Last

	var statistic *Statistic
	if state.State == css.RWState_END_ACTION {
		statistic = &stat.ActionTime
		stat.Cycles++
	} else if state.State == css.RWState_READING || state.State == css.RWState_WRITING {
		statistic = &stat.WaitTime
	}

	stat.Last = state.Time
	if statistic == nil {
		return
	}
	statistic.Total += delta
	if statistic.Min == 0 || delta < statistic.Min {
		statistic.Min = delta
	}
	if delta > statistic.Max {
		statistic.Max = delta
	}
}

func saveRWToDB(o css.RWOptions, stats []*ReadWriteStat) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	row := tx.QueryRow(
		`insert into rw_run (session_id, timestamp, duration, solution, num_readers, num_writers, read_time, write_time, variation, read_sleep, write_sleep) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning id`,
		o.SaveCode.SaveCode,
		time.Now(),
		o.Duration,
		o.Solution,
		o.NumReaders,
		o.NumWriters,
		o.ReadDuration,
		o.WriteDuration,
		o.Variation,
		o.ReadSleep,
		o.WriteSleep,
	)

	var id int32

	if err := row.Scan(&id); err != nil {
		return err
	}

	for i, v := range stats {
		_, err := tx.Exec(
			`insert into rw_stat (rw_run_id, rw_number, actor_type, cycles, max_action_time, max_wait_time, min_action_time, min_wait_time, total_action_time, total_wait_time) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			id,
			i,
			v.ActorType,
			v.Cycles,
			v.ActionTime.Max,
			v.WaitTime.Max,
			v.ActionTime.Min,
			v.WaitTime.Min,
			v.ActionTime.Total,
			v.WaitTime.Total,
		)
		if err != nil {
			panic(err)
		}
	}

	return tx.Commit()
}

func (*cssServer) GetRWStats(ctx context.Context, code *css.SaveCode) (*css.RWStats, error) {
	res, err := db.Query(`select * from rw_run rwr where rwr.session_id = $1 order by rwr.id desc`, code.SaveCode)
	if err != nil {
		return nil, err
	}

	// Grab runs
	var runs = make(map[int64]*css.RWRun)
	for res.Next() {
		var id int64
		var run = new(css.RWRun)
		run.Options = new(css.RWOptions)
		run.Options.SaveCode = new(css.SaveCode)
		var timeValue time.Time
		if err := res.Scan(
			&id,
			&(run.Options.SaveCode.SaveCode),
			&timeValue,
			&(run.Options.Duration),
			&(run.Options.Solution),
			&run.Options.NumReaders,
			&(run.Options.NumWriters),
			&(run.Options.ReadDuration),
			&(run.Options.WriteDuration),
			&(run.Options.Variation),
			&(run.Options.ReadSleep),
			&(run.Options.WriteSleep),
		); err != nil {
			log.Fatal(err)
		}
		run.Timestamp = timeValue.UnixNano()
		runs[id] = run
	}

	// Grab the individual stats.
	res, err = db.Query(`select rws.* from rw_run rwr join rw_stat rws on rwr.id = rws.rw_run_id where rwr.session_id = $1 order by rws.rw_run_id, rws.rw_number;`, code.SaveCode)
	if err != nil {
		return nil, err
	}
	for res.Next() {
		var id int64 = -1
		var stat = new(css.RWRunStat)
		if err := res.Scan(
			&id,
			&stat.ReadWriteNumber,
			&stat.ActorType,
			&stat.Actions,
			&stat.ActionTimeMax,
			&stat.WaitTimeMax,
			&stat.ActionTimeMin,
			&stat.WaitTimeMin,
			&stat.ActionTimeTotal,
			&stat.WaitTimeTotal,
		); err != nil {
			panic(err)
		}
		runs[id].Stats = append(runs[id].Stats, stat)
	}

	result := new(css.RWStats)
	for _, v := range runs {
		result.RwRuns = append(result.RwRuns, v)
	}
	return result, nil
}

func (p *cssServer) Philosophize(o *css.DPOptions, s css.CSS_PhilosophizeServer) error {
	log.Println("Entering Dining Philosophers")
	var c <-chan *css.DPState
	switch o.Choice {
	case 0:
		c = css.NonSolution(*o)
	case 1:
		c = css.Solution1(*o)
	case 2:
		c = css.Solution2(*o)
	default:
		return errors.New("bad solution choice")
	}
	stats := make([]*PhilosopherStat, o.Size, o.Size)
	for i := range stats {
		stats[i] = &PhilosopherStat{Last: time.Now().UnixNano()}
	}
	for v := range c {
		stats[v.Id].update(v)
		if err := s.Send(v); err != nil {
			return err
		}
	}
	err := storeDp(*o, stats)
	if err != nil {
		log.Println("error in saving dp:", err)
	}
	log.Println("Exiting Dining Philosophers")
	return err
}

func (*cssServer) GetDPStats(_ context.Context, code *css.SaveCode) (*css.DPStats, error) {
	log.Println("Retrieving DP stats")
	res, err := db.Query(`select * from dp_run dp where dp.session_id = $1 order by dp.id desc`, code.SaveCode)
	if err != nil {
		return nil, err
	}

	// Grab runs
	var runs = make(map[int64]*css.DPRun)
	for res.Next() {
		var id int64
		var run = new(css.DPRun)
		run.Options = new(css.DPOptions)
		run.Options.SaveCode = new(css.SaveCode)
		var timeValue time.Time
		if err := res.Scan(
			&id,
			&(run.Options.SaveCode.SaveCode),
			&timeValue,
			&(run.Options.Duration),
			&(run.Options.Size),
			&run.Options.TimeThinking,
			&(run.Options.TimeEating),
			&(run.Options.Variation),
			&(run.Deadlocked),
			&(run.Options.Choice),
		); err != nil {
			log.Fatal(err)
		}
		run.Timestamp = timeValue.UnixNano()
		runs[id] = run
	}

	// Grab the individual stats.
	res, err = db.Query(`select dps.* from dp_run dpr join dp_stat dps on dpr.id = dps.dp_run_id where dpr.session_id = $1 order by dps.dp_run_id, dps.philosopher_number;`, code.SaveCode)
	if err != nil {
		return nil, err
	}
	for res.Next() {
		var id int64 = -1
		var stat = new(css.DPStat)
		if err := res.Scan(
			&id,
			&stat.PhilosopherNumber,
			&stat.Cycles,
			&stat.MaxHungry,
			&stat.MaxEating,
			&stat.MaxThinking,
			&stat.MinHungry,
			&stat.MinEating,
			&stat.MinThinking,
			&stat.TotalHungry,
			&stat.TotalEating,
			&stat.TotalThinking,
		); err != nil {
			panic(err)
		}
		runs[id].Stats = append(runs[id].Stats, stat)
	}

	result := new(css.DPStats)
	for _, v := range runs {
		result.DpRuns = append(result.DpRuns, v)
	}
	return result, nil
}

type Statistic struct {
	Min, Max, Total int64
}

type BufferStat struct {
	ActorType            string
	Cycles               int
	ActionTime, WaitTime Statistic
	Last                 int64
}

type UnisexStat struct {
	ActorType            string
	Cycles               int
	ActionTime, WaitTime Statistic
	Last                 int64
}

type ReadWriteStat struct {
	ActorType            string
	Cycles               int
	ActionTime, WaitTime Statistic
	Last                 int64
}

// PhilosopherStat is a set of statistics for how an individual philosopher
// performed during a run.
type PhilosopherStat struct {
	Eating, Thinking, Hungry Statistic
	Cycles                   int
	Last                     int64
	Deadlocked               bool
}

func (stat *PhilosopherStat) update(s *css.DPState) {
	var statistic *Statistic
	delta := s.Time - stat.Last
	if s.State == css.DPState_HUNGRY {
		statistic = &stat.Thinking
	} else if s.State == css.DPState_EATING {
		statistic = &stat.Hungry
	} else if s.State == css.DPState_THINKING {
		stat.Cycles++
		statistic = &stat.Eating
	} else if s.State == css.DPState_DEADLOCKED {
		stat.Deadlocked = true
		return
	}
	stat.Last = s.Time
	if statistic == nil {
		return
	}
	if statistic.Min == 0 || delta < statistic.Min {
		statistic.Min = delta
	}
	if delta > statistic.Max {
		statistic.Max = delta
	}
	statistic.Total += delta
}

func (stat *BufferStat) update(s *css.BufferState) {
	delta := s.Time - stat.Last
	var statistic *Statistic
	if s.State == css.BufferState_PRODUCED_ITEM || s.State == css.BufferState_CONSUMED_ITEM {
		statistic = &stat.ActionTime
		stat.Cycles++
	} else {
		statistic = &stat.WaitTime
	}

	stat.Last = s.Time
	statistic.Total += delta
	if statistic.Min == 0 || delta < statistic.Min {
		statistic.Min = delta
	}
	if delta > statistic.Max {
		statistic.Max = delta
	}
}

func (stat *UnisexStat) update(state *css.UnisexState) {
	delta := state.Time - stat.Last
	stat.Last = state.Time

	var statistic *Statistic
	if state.State == css.UnisexState_ENTERING {
		statistic = &stat.WaitTime
		stat.Cycles++
	} else if state.State == css.UnisexState_LEAVING {
		statistic = &stat.ActionTime
	}

	if statistic == nil {
		return
	}
	statistic.Total += delta
	if statistic.Min == 0 || delta < statistic.Min {
		statistic.Min = delta
	}
	if delta > statistic.Max {
		statistic.Max = delta
	}
}

func storeUnisex(o css.UnisexOptions, stats []*UnisexStat) (err error) {
	log.Println("Storing unisex stats")
	tx, err := db.Begin()
	defer func() {
		if err == nil {
			log.Println("Committing changes")
			err = tx.Commit()
		} else {
			log.Println("Error saving unisex, rolling back:", err)
			_ = tx.Rollback()
		}
	}()
	if err != nil {
		return
	}
	res := db.QueryRow(
		"insert into unisex_run (session_id, timestamp, duration, solution, num_males, num_females, female_time, male_time, variation, sleep_time) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning id",
		o.SaveCode.SaveCode,
		time.Now(),
		o.Duration,
		o.Solution,
		o.NumMales,
		o.NumFemales,
		o.FemaleTime,
		o.MaleTime,
		o.Variation,
		o.RestartTime,
	)
	var id int
	err = res.Scan(&id)
	if err != nil {
		return
	}
	for i, stat := range stats {
		_, err := db.Exec("insert into unisex_stat (unisex_run_id, unisex_number, actor_type, cycles, max_action_time, max_wait_time, min_action_time, min_wait_time, total_action_time, total_wait_time) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
			id,
			i,
			stat.ActorType,
			stat.Cycles,
			stat.ActionTime.Max,
			stat.WaitTime.Max,
			stat.ActionTime.Min,
			stat.WaitTime.Min,
			stat.ActionTime.Total,
			stat.WaitTime.Total,
		)
		if err != nil {
			return err
		}
	}
	return
}

func storeDp(o css.DPOptions, stats []*PhilosopherStat) (err error) {
	tx, err := db.Begin()
	defer func() {
		if err == nil {
			err = tx.Commit()
		} else {
			_ = tx.Rollback() // TODO maybe handle this idk
		}
	}()
	if err != nil {
		return
	}
	res := db.QueryRow(
		"insert into dp_run (session_id, timestamp, duration, num_philosophers, think_time, eat_time, variation, deadlocked, solution) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id",
		o.SaveCode.SaveCode,
		time.Now(),
		o.Duration,
		o.Size,
		o.TimeThinking,
		o.TimeEating,
		o.Variation,
		stats[0].Deadlocked,
		o.Choice,
	)
	var id int
	err = res.Scan(&id)
	if err != nil {
		return
	}
	for i, stat := range stats {
		_, err := db.Exec("insert into dp_stat (dp_run_id, philosopher_number, cycles, max_hungry, max_eating, max_thinking, min_hungry, min_eating, min_thinking, total_hungry, total_eating, total_thinking) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
			id,
			i,
			stat.Cycles,
			stat.Hungry.Max,
			stat.Eating.Max,
			stat.Thinking.Max,
			stat.Hungry.Min,
			stat.Eating.Min,
			stat.Thinking.Min,
			stat.Hungry.Total,
			stat.Eating.Total,
			stat.Thinking.Total,
		)
		if err != nil {
			return err
		}
	}
	return
}
