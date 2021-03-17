import { Pipe, PipeTransform } from '@angular/core';
import { ModusState } from '../css_pb';

@Pipe({
  name: 'modusStateString'
})
export class ModusStateStringPipe implements PipeTransform {

  transform(state: ModusState.State, ...args: unknown[]): string {
    switch (state) {
      case ModusState.State.UNDEFINED: return 'Undefined'
      case ModusState.State.NEUTRAL: return 'Neutral'
      case ModusState.State.HEATHENS_RULE: return 'Heathens rule'
      case ModusState.State.PRUDES_RULE: return 'Prudes rule'
      case ModusState.State.TRANSITION_TO_HEATHENS: return 'Transition to heathens'
      case ModusState.State.TRANSITION_TO_PRUDES: return 'Transition to prudes'
      case ModusState.State.WAITING_TO_CROSS: return 'Waiting to cross'
      case ModusState.State.CROSSING: return 'Crossing'
    }
  }

}
