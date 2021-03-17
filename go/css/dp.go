package css

import (
	"log"
	"sync"
	"time"
)

type dpSender chan *DPState

func (s dpSender) send(id int32, state DPState_State) {
	s.sendFork(id, state, 0)
}

func (s dpSender) sendFork(id int32, state DPState_State, forkID int32) {
	s <- &DPState{Id: id, State: state, Time: time.Now().UnixNano(), ForkId: forkID}
}

func left(id int32, size int32) int32              { return (id + 1) % size }
func right(id int32) int32 { return id}

// NonSolution is the deadlocking solution for Dining Philosophers
// as presented in The Little Book of Semaphores.
func NonSolution(o DPOptions) <-chan *DPState {
	log.Println("NonSolution")
	forks := make([]sync.Mutex, o.Size)
	locked := make([]bool, o.Size)
	deadlocked := new(bool)
	// This may deadlock, so we have to free resources
	go func() {
		<-time.After(time.Duration(o.Duration) + 3 * time.Second)
		*deadlocked = true
		for i := int32(0); i < o.Size; i++ {
			if locked[i] {
				forks[i].Unlock()
			}
		}
	}()

	return runSolution(
		o,
		func(id int32, c dpSender) {
			right := right(id)
			left := left(id, o.Size)

			c.sendFork(id, DPState_REQUESTING_FORK, right)
			forks[right].Lock()
			if *deadlocked {
				return
			}
			locked[right] = true
			c.sendFork(id, DPState_HOLDING_FORK, right)

			c.sendFork(id, DPState_REQUESTING_FORK, left)
			forks[left].Lock()
			if *deadlocked {
				return
			}
			c.sendFork(id, DPState_HOLDING_FORK, left)
			locked[left] = true
		},
		func(id int32, c dpSender) {
			right := right(id)
			left := left(id, o.Size)

			locked[right] = false
			c.sendFork(id, DPState_RELEASING_FORK, right)
			forks[right].Unlock()

			locked[left] = false
			c.sendFork(id, DPState_RELEASING_FORK, left)
			forks[left].Unlock()
		},
		deadlocked,
	)
}

// Solution1 is the first solution from The Little Book of Semaphores
// which is not deadlocking.
func Solution1(o DPOptions) <-chan *DPState {
	forks := make([]sync.Mutex, o.Size)
	footman := make(chan unitType, o.Size-1)
	for i := int32(0); i < o.Size-1; i++ {
		footman<-unit
	}
	return runSolution(
		o,
		func(id int32, c dpSender) {
			right := right(id)
			left := left(id, o.Size)
			<-footman
			c.sendFork(id, DPState_REQUESTING_FORK, right)
			forks[right].Lock()
			c.sendFork(id, DPState_HOLDING_FORK, right)

			c.sendFork(id, DPState_REQUESTING_FORK, left)
			forks[left].Lock()
			c.sendFork(id, DPState_HOLDING_FORK, left)
		},
		func(id int32, c dpSender) {
			right := right(id)
			left := left(id, o.Size)
			c.sendFork(id, DPState_RELEASING_FORK, right)
			forks[right].Unlock()
			c.sendFork(id, DPState_RELEASING_FORK, left)
			forks[left].Unlock()
			footman <- unit
		},
		new(bool),
	)
}

// Solution2 is the second non-deadlocking solution as presented
// in The Little Book of Semaphores where some of the philosophers
// are lefties.
func Solution2(o DPOptions) <-chan *DPState {
	forks := make([]sync.Mutex, o.Size)
	return runSolution(
		o,
		func(id int32, c dpSender) {
			right := right(id)
			left := left(id, o.Size)
			var first, second int32
			if id == 0 {
				first = left
				second = right
			} else {
				first = right
				second = left
			}
			c.sendFork(id, DPState_REQUESTING_FORK, first)
			forks[first].Lock()
			c.sendFork(id, DPState_HOLDING_FORK, first)

			c.sendFork(id, DPState_REQUESTING_FORK, second)
			forks[second].Lock()
			c.sendFork(id, DPState_HOLDING_FORK, second)
		},
		func(id int32, c dpSender) {
			right := right(id)
			left := left(id, o.Size)
			var first, second int32
			if id == 0 {
				first = left
				second = right
			} else {
				first = right
				second = left
			}
			c.sendFork(id, DPState_RELEASING_FORK, first)
			forks[first].Unlock()
			c.sendFork(id, DPState_RELEASING_FORK, second)
			forks[second].Unlock()
		},
		new(bool),
	)
}

func runSolution(o DPOptions, getForks, putForks func(int32, dpSender), deadlocked *bool) <-chan *DPState {
	c, done := make(dpSender, 16384), make(chan bool)
	for i := int32(0); i < o.Size; i++ {
		go func(id int32) {
			timeout := time.After(time.Duration(o.Duration))
			for {
				select {
				case <-timeout:
					c.send(id, DPState_GRACEFULLY_EXITED)
					done <- true
					return
				default:
					sleepRange(o.TimeThinking, o.Variation)
					c.send(id, DPState_HUNGRY)
					getForks(id, c)
					if *deadlocked {
						c.send(id, DPState_DEADLOCKED)
						done <- true
						return
					}
					c.send(id, DPState_EATING)
					sleepRange(o.TimeEating, o.Variation)
					c.send(id, DPState_THINKING)
					putForks(id, c)
				}
			}
		}(i)
	}
	go func() {
		for i := int32(0); i < o.Size; i++ {
			<-done
		}
		close(c)
	}()
	return c
}
