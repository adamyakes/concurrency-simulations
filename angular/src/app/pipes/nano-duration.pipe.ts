import { Pipe, PipeTransform } from '@angular/core';
import { second, microsecond, millisecond, nanosecond } from '../constants';

@Pipe({
  name: 'nanoDuration'
})
export class NanoDurationPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (value > second) {
      return (value / second).toFixed(2) + 's';
    } else if (value > millisecond) {
      return (value / millisecond).toFixed(2) + 'ms';
    } else if (value > microsecond) {
      return (value / microsecond).toFixed(2) + 'µs';
    } else {
      return value.toString() + 'ns';
    }
  }

}
