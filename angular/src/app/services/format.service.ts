import { Injectable } from '@angular/core';
import { microsecond, millisecond, second } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  duration(n: number): string {
    if (n >= second) {
      return Math.round(n / second) + 's'
    } else if (n >= millisecond) {
      return Math.round(n / millisecond) + 'ms'
    } else if (n >= microsecond) { 
      return Math.round(n / microsecond) + 'µs'
    } else {
      return n + 'ns'
    }
  }
}
