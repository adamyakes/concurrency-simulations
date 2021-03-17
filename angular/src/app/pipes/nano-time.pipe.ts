import { Pipe, PipeTransform } from '@angular/core';
import { microsecond, millisecond, second } from '../constants';

@Pipe({
  name: 'nanoTime',
})
export class NanoTimePipe implements PipeTransform {

  transform(timeNanoSeconds: number, ...args: unknown[]): string {
    if (timeNanoSeconds > second) {
      return timeNanoSeconds / second + 's';
    } else if (timeNanoSeconds > millisecond) {
      return timeNanoSeconds / millisecond + 'ms';
    } else if (timeNanoSeconds > microsecond) {
      return timeNanoSeconds / microsecond + 'µs';
    } else {
      return timeNanoSeconds + 'ns';
    }
  }

}
