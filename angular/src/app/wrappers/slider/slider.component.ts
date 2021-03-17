import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {

  @Input() disabled: boolean;
  @Input() value: number;
  @Input() tooltip: string;
  @Output() valueChange = new EventEmitter<number>();

  @Input() min: number;
  @Input() max: number;
  @Input() increment: number;

  inc(): void {
    this.updateValue(Math.floor(this.value / this.increment) + 1);
  }

  dec(): void {
    this.updateValue(Math.floor(this.value / this.increment) - 1);
  }

  updateValue(v: number): void {
    v = Math.round(v);
    this.value = v * this.increment;
    if (v < this.min) {
      this.value = this.min;
    } else if (v > this.max) {
      this.value = this.max;
    }
    this.valueChange.emit(this.value);
  }

}
