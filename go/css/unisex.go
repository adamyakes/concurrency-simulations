package css

import (
	"context"
	"log"
	"sync"
	"time"

	"golang.org/x/sync/semaphore"
)

type unisexSender chan *UnisexState

func (s unisexSender) send(id int32, state UnisexState_State) {
	s <- &UnisexState{Id: int32(id), State: state, Time: time.Now().UnixNano()}
}

type lightSwitchSender interface {
	sendLightSwitch(onOff, id bool)
}

func (s unisexSender) sendLightSwitch(onOff, male bool) {
	var state UnisexState_State
	if onOff && male {
		state = UnisexState_MALE_SWITCH_ON
	} else if male {
		state = UnisexState_MALE_SWITCH_OFF
	} else if onOff {
		state = UnisexState_FEMALE_SWITCH_ON
	} else {
		state = UnisexState_FEMALE_SWITCH_OFF
	}
	s <- &UnisexState{Id: -1, State: state, Time: time.Now().UnixNano()}
}

func (s unisexSender) close() { close(s) }

func FirstUnisex(o UnisexOptions) <-chan *UnisexState {
	log.Println("First unisex problem")
	c := make(unisexSender, 4096)
	var empty = &sync.Mutex{}
	var maleSwitch, femaleSwitch lightswitch
	var femaleMultiplex = semaphore.NewWeighted(int64(o.MaxAllowed))
	var maleMultiplex = semaphore.NewWeighted(int64(o.MaxAllowed))

	var femaleCode = func(id int32) {
		c.send(id, UnisexState_QUEUING)
		femaleSwitch.lockSender(empty, c, false)
		_ = femaleMultiplex.Acquire(context.Background(), 1)

		c.send(id, UnisexState_ENTERING)
		sleepRange(o.FemaleTime, o.Variation)
		c.send(id, UnisexState_LEAVING)

		femaleMultiplex.Release(1)
		femaleSwitch.unlockSender(empty, c, false)
		sleepRange(o.RestartTime, o.Variation)
	}
	var maleCode = func(id int32) {
		c.send(id, UnisexState_QUEUING)
		maleSwitch.lockSender(empty, c, true)
		_ = maleMultiplex.Acquire(context.Background(), 1)

		c.send(id, UnisexState_ENTERING)
		sleepRange(o.MaleTime, o.Variation)
		c.send(id, UnisexState_LEAVING)

		maleMultiplex.Release(1)
		maleSwitch.unlockSender(empty, c, true)
		sleepRange(o.RestartTime, o.Variation)
	}

	launch(o.Duration, c, routines{
		{ o.NumMales,    maleCode} ,
		{ o.NumFemales, femaleCode},
	})

	return c
}

func NoStarveUnisex(o UnisexOptions) <-chan *UnisexState {
	c := make(unisexSender, 4096)
	var empty = &sync.Mutex{}
	var turnstile sync.Mutex
	var maleSwitch, femaleSwitch lightswitch
	var femaleMultiplex = semaphore.NewWeighted(int64(o.MaxAllowed))
	var maleMultiplex = semaphore.NewWeighted(int64(o.MaxAllowed))

	var maleCode = func(id int32) {
		c.send(id, UnisexState_QUEUING)
		turnstile.Lock()
		maleSwitch.lockSender(empty, c, true)
		turnstile.Unlock()
		_ = maleMultiplex.Acquire(context.Background(), 1)

		c.send(id, UnisexState_ENTERING)
		sleepRange(o.MaleTime, o.Variation)
		c.send(id, UnisexState_LEAVING)

		maleMultiplex.Release(1)
		maleSwitch.unlockSender(empty, c, true)
		sleepRange(o.RestartTime, o.Variation)
	}

	var femaleCode = func(id int32) {
		c.send(id, UnisexState_QUEUING)
		turnstile.Lock()
		femaleSwitch.lockSender(empty, c, false)
		turnstile.Unlock()
		_ = femaleMultiplex.Acquire(context.Background(), 1)

		c.send(id, UnisexState_ENTERING)
		sleepRange(o.FemaleTime, o.Variation)
		c.send(id, UnisexState_LEAVING)

		femaleMultiplex.Release(1)
		femaleSwitch.unlock(empty)
		sleepRange(o.RestartTime, o.Variation)
	}

	launch(o.Duration, c, routines{
		{ o.NumMales,   maleCode },
		{ o.NumFemales, femaleCode} ,
	})

	return c
}