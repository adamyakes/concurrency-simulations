import { Pipe, PipeTransform } from '@angular/core';
import { BufferState } from '../css_pb'

@Pipe({
  name: 'boundedStateString'
})
export class BoundedStateStringPipe implements PipeTransform {

  transform(state: BufferState.State, ...args: unknown[]): string {
    switch (state) {
      case BufferState.State.UNDEFINED: return 'Undefined'
      case BufferState.State.PRODUCED_ITEM: return 'Produced item'
      case BufferState.State.CONSUMED_ITEM: return 'Consumed item'
      case BufferState.State.PRODUCING_ITEM: return 'Producing item'
      case BufferState.State.CONSUMING_ITEM: return 'Consuming item'
    }
  }

}
