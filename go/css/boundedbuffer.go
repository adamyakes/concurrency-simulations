package css

import (
	"context"
	"golang.org/x/sync/semaphore"
	"log"
	"sync"
	"time"
)

type bufferStateSender chan *BufferState

func (b bufferStateSender) send(id int32, actor string, state BufferState_State) {
	b <- &BufferState{Id: id, Time: time.Now().UnixNano(), State: state, Actor: actor}
}

func (b bufferStateSender) close() { close(b) }

// BoundedBuffer runs the bounded buffer simulation.
func BoundedBuffer(o BufferOptions) <-chan *BufferState {
	items := semaphore.NewWeighted(int64(o.BufferSize))
	spaces := semaphore.NewWeighted(int64(o.BufferSize))
	var mutex sync.Mutex

	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(time.Duration(o.Duration)))

	items.Acquire(ctx, int64(o.BufferSize))

	c := make(bufferStateSender, bufferSize)

	const producer = "producer"
	var produceFunc = func(id int32) {
		c.send(id, producer, BufferState_PRODUCING_ITEM)
		sleepRange(o.ProduceTime, o.Variation)
		c.send(id, producer, BufferState_WAIT_FOR_BUFFER)
		if err := spaces.Acquire(ctx, 1); err != nil {
			log.Println("Exiting early, canceled", err)
			return
		}
		mutex.Lock()
		c.send(id, producer, BufferState_PRODUCED_ITEM)
		c.send(id, producer, BufferState_IDLE)
		mutex.Unlock()
		items.Release(1)
		sleepRange(o.SleepTime, o.Variation)
	}

	const consumer = "consumer"
	var consumeFunc = func(id int32) {
		c.send(id, consumer, BufferState_CONSUMING_ITEM)
		sleepRange(o.ConsumeTime, o.Variation)
		c.send(id, consumer, BufferState_WAIT_FOR_BUFFER)
		if err := items.Acquire(context.Background(), 1); err != nil {
			log.Println("Exiting early, canceled:", err)
			return
		}
		mutex.Lock()
		c.send(id, consumer, BufferState_CONSUMED_ITEM)
		c.send(id, consumer, BufferState_IDLE)
		mutex.Unlock()
		spaces.Release(1)
		sleepRange(o.SleepTime, o.Variation)
	}

	launch(o.Duration, c, routines{
		{ o.NumProducers, produceFunc },
		{ o.NumConsumers, consumeFunc },
	})

	go func() {
		<-time.After(time.Duration(o.Duration) + 5 * time.Second)
		cancel()
	}()

	return c
}
