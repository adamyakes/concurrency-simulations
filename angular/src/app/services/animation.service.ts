import { EventEmitter, Injectable } from '@angular/core';
import { Svg } from '@svgdotjs/svg.js';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  public stateCount$: BehaviorSubject<number>;
  public status$ = new BehaviorSubject<'Ready' | 'Running' | 'Error'>('Ready');
  public command$ = new Subject<void>();
  public svg$: BehaviorSubject<Svg>;
  public goal$ = new Subject<number>();
  public toggleSidebar = new EventEmitter<void>();
  public complete = new EventEmitter<void>();

  private svg: Svg = undefined;
  private stateCount = 0;

  constructor() {
    this.stateCount$ = new BehaviorSubject<number>(this.stateCount);
    this.svg$ = new BehaviorSubject<Svg>(this.svg);
  }

  setSvg(svg: Svg): void {
    this.svg = svg;
    this.svg$.next(this.svg);
  }
  reset(): void {
    this.stateCount = 0;
    this.status$.next('Ready');
    this.stateCount$.next(this.stateCount);
    this.svg.clear();
    this.complete.next();
  }
  stateReceived(): void {
    this.stateCount$.next(++this.stateCount);
  }
  goOrCancel(): void {
    this.command$.next();
  }
  move(to: number): void {
    this.goal$.next(to);
  }
}
