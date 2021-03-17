package main

import (
	"fmt"
	"time"

	"gitlab.com/adamyakes/capstone/css"
)

func main() {
	// fmt.Println("First reader writer:")
	// runRwWith(css.FirstReaderWriter)
	// fmt.Println("\nNo Starve Turnstile:")
	// runRwWith(css.NoStarveTurnstile)
	// fmt.Println("\nWriter Priority:")
	// runRwWith(css.WriterPriority)

	o := css.BufferOptions{
		BufferSize:     10,
		NumProducers:   5,
		NumConsumers:   1,
		Duration:       int64(100 * time.Millisecond),
		//ProduceTimeMin: int64(0 * time.Nanosecond),
		//ProduceTimeMax: int64(1 * time.Nanosecond),
		//ConsumeTimeMin: int64(400 * time.Nanosecond),
		//ConsumeTimeMax: int64(500 * time.Nanosecond),
	}

	c := css.BoundedBuffer(o)

	for v := range c {
		fmt.Println(v)
	}

}

func runRwWith(solution func(options css.RWOptions) <-chan css.RWState) {
	const numReaders = 5
	const numWriters = 5
	c := solution(css.RWOptions{
		NumReaders:       numReaders,
		NumWriters:       numWriters,
		Duration:         int64(500 * time.Millisecond),
		//ReadDurationMin:  int64(20 * time.Nanosecond),
		//ReadDurationMax:  int64(100 * time.Nanosecond),
		//WriteDurationMin: int64(20 * time.Nanosecond),
		//WriteDurationMax: int64(100 * time.Nanosecond),
	})
	var count, readStates, writeStates int
	for v := range c {
		switch v.State {
		case
			css.RWState_WRITING,
			css.RWState_READING,
			css.RWState_WAITING_FOR_NO_WRITERS,
			css.RWState_WAITING_FOR_NO_READERS,
			css.RWState_WAITING_FOR_ROOM_EMPTY:
			count++
			var s string
			if v.Id < numReaders {
				s = "Reader"
				readStates++
			} else {
				s = "Writer"
				writeStates++
			}
			_ = s
			//fmt.Printf("%v #%v is in state %v\n", s, v.Id, v.State)
		}
	}
	fmt.Printf("Count: %v\nRead states: %v\nWrite States: %v\n", count, readStates, writeStates)
}
