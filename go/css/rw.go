package css

import (
	"sync"
	"time"
)

type sender chan RWState

func (s sender) send(id int32, state RWState_State, actor string) {
	s <- RWState{Id: int32(id), Time: time.Now().UnixNano(), State: state, Actor: actor}
}

func (s sender) close() { close(s) }

const reader = "reader"
const writer = "writer"

func ReadWrite(o *RWOptions) chan RWState {
	switch o.Solution {
	case RWOptions_FIRST_STARVATION:
		return FirstReaderWriter(o)
	case RWOptions_NO_STARVE_TURNSTILE:
		return NoStarveTurnstile(o)
	case RWOptions_WRITER_PRIORITY:
		return WriterPriority(o)
	default:
		return nil
	}
}

// FirstReaderWriter is the first solution for readers and writers
// as described in The Little Book of Semaphores.
func FirstReaderWriter(o *RWOptions) chan RWState {
	var roomEmpty, mutex sync.Mutex
	var readers int
	c := make(sender)
	launch(o.Duration, c, routines{
		{ o.NumReaders, func(id int32) {
			c.send(id, RWState_WAIT_ACTION, reader)
			mutex.Lock()
			readers++
			if readers == 1 {
				roomEmpty.Lock()
			}
			mutex.Unlock()

			/* Read */
			c.send(id, RWState_READING, reader)
			sleepRange(o.ReadDuration, o.Variation)
			c.send(id, RWState_END_ACTION, reader)

			mutex.Lock()
			readers--
			if readers == 0 {
				roomEmpty.Unlock()
			}
			mutex.Unlock()
			sleepRange(o.ReadSleep, o.Variation)
		}},
		{ o.NumWriters, func(id int32) {
			c.send(id, RWState_WAIT_ACTION, writer)
			roomEmpty.Lock()

			/* Write */
			c.send(id, RWState_WRITING, writer)
			sleepRange(o.WriteDuration, o.Variation)
			c.send(id, RWState_END_ACTION, writer)

			roomEmpty.Unlock()
			sleepRange(o.WriteSleep, o.Variation)
		}},
	})
	return c
}

type lightswitch struct {
	m       sync.Mutex
	counter int
}

func (t *lightswitch) lock(m *sync.Mutex) {
	t.m.Lock()
	t.counter++
	if t.counter == 1 {
		m.Lock()
	}
	t.m.Unlock()
}

func (t *lightswitch) lockSender(m *sync.Mutex, s lightSwitchSender, which bool) {
	t.m.Lock()
	t.counter++
	if t.counter == 1 {
		m.Lock()
		s.sendLightSwitch(true, which)
	}
	t.m.Unlock()
}

func (t *lightswitch) unlock(m *sync.Mutex) {
	t.m.Lock()
	t.counter--
	if t.counter == 0 {
		m.Unlock()
	}
	t.m.Unlock()
}

func (t *lightswitch) unlockSender(m *sync.Mutex, s lightSwitchSender, which bool) {
	t.m.Lock()
	t.counter--
	if t.counter == 0 {
		m.Unlock()
		s.sendLightSwitch(false, which)
	}
	t.m.Unlock()
}

// NoStarveTurnstile is the implementation which avoids starvation
// by using a turnstile as defined in The Little Book of Semaphores.
func NoStarveTurnstile(o *RWOptions) chan RWState {
	var turnstile, roomEmpty = new(sync.Mutex), new(sync.Mutex)
	var readSwitch lightswitch
	var c = make(sender)
	launch(o.Duration, c, routines{
		{ o.NumReaders, func(id int32) {
			c.send(id, RWState_WAIT_ACTION, reader)
			turnstile.Lock()
			turnstile.Unlock()
			readSwitch.lock(roomEmpty)

			/* Read */
			c.send(id, RWState_READING, reader)
			sleepRange(o.ReadDuration, o.Variation)
			c.send(id, RWState_END_ACTION, reader)

			readSwitch.unlock(roomEmpty)
			sleepRange(o.ReadSleep, o.Variation)
		}},
		{ o.NumWriters, func(id int32) {
			c.send(id, RWState_WAIT_ACTION, writer)
			turnstile.Lock()
			roomEmpty.Lock()

			/* Write */
			c.send(id, RWState_WRITING, writer)
			sleepRange(o.WriteDuration, o.Variation)
			c.send(id, RWState_END_ACTION, writer)

			turnstile.Unlock()
			roomEmpty.Unlock()
			sleepRange(o.WriteSleep, o.Variation)
		}},
	})
	return c
}

// WriterPriority runs the solution which provides priority to writers
// as defined in The Little Book of Semaphores.
func WriterPriority(o *RWOptions) chan RWState {
	var readSwitch, writeSwitch lightswitch
	var noReaders, noWriters = new(sync.Mutex), new(sync.Mutex)
	var c = make(sender)
	launch(o.Duration, c, routines{
		{ o.NumReaders, func(id int32) {
			c.send(id, RWState_WAIT_ACTION, reader)
			noReaders.Lock()
			readSwitch.lock(noWriters)
			noReaders.Unlock()

			/* Read */
			c.send(id, RWState_READING, reader)
			sleepRange(o.ReadDuration, o.Variation)
			c.send(id, RWState_END_ACTION, reader)

			readSwitch.unlock(noWriters)
			sleepRange(o.ReadSleep, o.Variation)
		}},
		{ o.NumWriters, func(id int32) {
			c.send(id, RWState_WAIT_ACTION, writer)
			writeSwitch.lock(noReaders)
			noWriters.Lock()

			/* Write */
			c.send(id, RWState_WRITING, writer)
			sleepRange(o.WriteDuration, o.Variation)
			c.send(id, RWState_END_ACTION, writer)

			noWriters.Unlock()
			writeSwitch.unlock(noReaders)
			sleepRange(o.WriteSleep, o.Variation)
		}},
	})

	return c
}
