package css

import (
	"log"
	"math/rand"
	"time"
)

var bufferSize = 16384

// BufferSize sets the buffer size for channels which hold
// states before being sent over the network.
func BufferSize(size int) {
	log.Printf("Using buffer size %v\n", size)
	bufferSize = size
}

type unitType struct{}

var unit unitType

// sleepRange sleeps for a time at least min nanoseconds plus
// between 0 and adjustRange nanoseconds.
func sleepRange(min, adjustRange int64) {
	if min == 0 && adjustRange == 0 {
		return
	}
	if adjustRange != 0 {
		adjustRange = rand.Int63n(adjustRange)
	}
	nanoseconds := min + adjustRange
	time.Sleep(time.Duration(nanoseconds))
}

type routine func(int32)
type routines []struct{
	howMany int32
	routine routine
}

type closer interface {
	close()
}

// launch sets up goroutines which repeat the given routine function until
// duration is done and returns a channel which sends after all routines
// have exited.
func launch(duration int64, c closer, routines routines) {
	var id int32
	var done = make(chan unitType)

	for _, r := range routines {
		for i := int32(0); i < r.howMany; i++ {
			go func(id int32, routine func(int32)) {
				timeout := time.After(time.Duration(duration))
				for {
					select {
					case <-timeout:
						done <- unit
						return
					default:
						routine(id)
					}
				}
			}(id, r.routine)
			id++
		}
	}

	go func() {
		for i := int32(0); i < id; i++ {
			<-done
		}
		c.close()
	}()
}
