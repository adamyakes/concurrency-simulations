import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BufferState, BufferOptions } from '../css_pb';
import { CSSClient } from '../css_grpc_web_pb';
import { bufferWidth, bufferHeight, appTitle, millisecond, second } from '../constants';
import { Rect, Line, Svg } from '@svgdotjs/svg.js';
import { BackendService } from '../services/backend.service';
import { Title } from '@angular/platform-browser';
import { AnimationService } from '../services/animation.service';
import { ClientReadableStream } from 'grpc-web';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PastRunsService } from '../services/past-runs.service';
import { Problems } from '../problems.enum';

@Component({
  selector: 'app-bounded-buffer',
  templateUrl: './bounded-buffer.component.html',
  styleUrls: ['./bounded-buffer.component.scss']
})
export class BoundedBufferComponent implements OnInit, OnDestroy, AfterContentInit {
  public stream: ClientReadableStream<BufferState>;
  public produceTime = 10;
  public consumeTime = 10;
  public sleepTime = 10;
  public variation = 0;

  states: AnimationState[] = [];
  client: CSSClient;
  index = 0;
  units = millisecond;
  bufferSize = 5;
  duration = 5;
  numProducers = 5;
  numConsumers = 5;

  private subscriptions: Subscription[] = [];

  // SVG Variables
  private bufferX = 50;
  private bufferY = 75;
  private spacingProducers = bufferWidth / this.numProducers;
  private spacingConsumers = bufferWidth / this.numConsumers;
  private slotWidth = bufferWidth / this.bufferSize;
  private producers: BufferPositionedRect[] = [];
  private consumers: BufferPositionedRect[] = [];
  private bufferSlots: Rect[] = [];


  private svg: Svg;

  constructor(
    private authService: AuthService,
    private animationService: AnimationService,
    private titleService: Title,
    private backend: BackendService,
    private pastRuns: PastRunsService,
  ) {
    pastRuns.setCurrentProblem(Problems.BoundedBuffer);
  }

  setBufferSize(num: number): void {
    this.bufferSize = num;
    this.makeAnimation();
  }
  setNumProducers(num: number): void {
    this.numProducers = num;
    this.makeAnimation();
  }

  setNumConsumers(num: number): void {
    this.numConsumers = num;
    this.makeAnimation();
  }

  ngOnInit(): void {
    this.client = this.backend.client;
    this.titleService.setTitle(`Bounded Buffer - ${appTitle}`);
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.animationService.svg$.subscribe(svg => {
        if (svg) {
          this.svg = svg;
          this.makeAnimation();
        }
      });
      this.subscriptions.push(this.animationService.command$.subscribe(() => {
        if (this.stream) {
          this.stream.cancel();
          this.stream = null;
          this.animationService.status$.next('Ready');
        } else {
          this.makeAnimation();
          this.go();
        }
      }));
      this.subscriptions.push(this.animationService.goal$.subscribe(goal => { this.moveToState(goal); }));
    }, 0);
  }

  ngOnDestroy(): void {
    this.stream?.cancel();
    this.stream = null;
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  moveToState(to: number): void {
    if (Math.abs(this.index - to) > 10) {
      this.index = to;
      this.setState(false);
      return;
    }
    while (this.index !== to) {
      if (this.index < to) {
        this.index++;
      } else {
        this.index--;
      }
      this.setState(true);
    }
    this.index = to;
  }

  setState(animate: boolean): void {
    const stateSet = this.states[this.index];
    for (let i = 0; i < stateSet.states.length; i++) {
      const state = stateSet.states[i];
      if (i < this.numProducers) {
        this.producers[i].apply(state, stateSet.buffer, stateSet.produceIndex);
      } else {
        this.consumers[i - this.numProducers].apply(state, stateSet.buffer, stateSet.consumeIndex);
      }
    }
  }

  makeAnimation(): void {
    this.stream?.cancel();
    this.stream = null;
    this.animationService.reset();
    this.index = 0;
    this.svg.clear();

    this.states = [];

    // Corner positions
    this.bufferX = 50;
    this.bufferY = 75;

    this.spacingProducers = bufferWidth / this.numProducers;
    this.spacingConsumers = bufferWidth / this.numConsumers;
    this.slotWidth = bufferWidth / this.bufferSize;

    this.producers = [];
    this.consumers = [];
    this.bufferSlots = [];

    this.svg.text('Producers').move(0, 25);
    this.svg.text('Consumers').move(0, 175);

    this.svg.text('Legend:').font({size: 10 }).move(0, 225);
    this.svg.text('Busy Producing / Consuming').font({size: 10 }).fill('#888').move(50, 225);
    this.svg.text('Waiting for buffer').font({size: 10 }).fill('#00F').move(190, 225);
    this.svg.text('Used Buffer').font({size: 10 }).fill('#F00').move(275, 225);

    // Buffer slots
    this.bufferSlots = [];
    for (let i = 0; i < this.bufferSize; i++) {
      const slot = this.svg
        .rect(this.slotWidth, bufferHeight)
        .stroke('#000')
        .fill('#fff')
        .move(this.bufferX + i * this.slotWidth, this.bufferY);
      this.bufferSlots.push(slot);
    }

    // Producers
    this.producers = [];
    for (let i = 0; i < this.numProducers; i++) {
      const rect = this.svg.rect(25, 25).stroke('#000').fill('#fff').move(100 + this.spacingProducers * i, 15);
      this.producers.push(new BufferPositionedRect(this.svg, rect, this.bufferSlots));
    }
    // Consumers
    this.consumers = [];
    for (let i = 0; i < this.numConsumers; i++) {
      const rect = this.svg.rect(25, 25).stroke('#000').fill('#fff').move(100 + this.spacingConsumers * i, 160);
      this.consumers.push(new BufferPositionedRect(this.svg, rect, this.bufferSlots));
    }
    const box = this.svg.bbox();
    this.svg.viewbox(0, 0, box.width + 50, box.height + 50);
  }

  copyData(state: BufferState.AsObject): {states: BufferState.AsObject[]; buffer: boolean[]} {
    const newArr = [...this.states[this.states.length - 1].states];
    newArr[state.id] = state;
    const newBuffer = this.states[this.states.length - 1].buffer.map(id => id);
    return {states: newArr, buffer: newBuffer};
  }

  go(): void {
    this.states = [];

    const options = new BufferOptions();
    options.setSaveCode(this.authService.getSaveCode());
    options.setBufferSize(this.bufferSize);
    options.setDuration(second * this.duration);
    options.setNumProducers(this.numProducers);
    options.setNumConsumers(this.numConsumers);
    options.setProduceTime(this.units * this.produceTime);
    options.setConsumeTime(this.units * this.consumeTime);
    options.setVariation(this.units * this.variation);
    options.setSleepTime(this.units * this.sleepTime);

    let produceIndex = 0;
    let consumeIndex = 0;

    const blankStates: BufferState.AsObject[] = [];
    for (let i = 0; i < this.numProducers+this.numConsumers; i++) {
      blankStates.push(null);
    }
    const blankBuffer: boolean[] = [];
    for (let i = 0; i < this.bufferSize; i++) {
      blankBuffer.push(false);
    }
    this.states = [{
      states: blankStates,
      buffer: blankBuffer,
      produceIndex,
      consumeIndex,
    }];

    this.stream = this.client.boundedBuffer(options);
    this.animationService.status$.next('Running');

    this.stream.on('data', data => {
      if (this.states.length > 100000) {
        return;
      }
      const o = data.toObject();
      const {states,buffer} = this.copyData(o);
      this.states.push({
        states,
        buffer,
        produceIndex,
        consumeIndex,
      });
      if (o.state === BufferState.State.PRODUCED_ITEM) {
        buffer[produceIndex] = true;
        produceIndex = (produceIndex + 1) % this.bufferSize;
      }
      if (o.state === BufferState.State.CONSUMED_ITEM) {
        buffer[consumeIndex] = false;
        consumeIndex = (consumeIndex + 1) % this.bufferSize;
      }
      this.animationService.stateReceived();
    });

    this.stream.on('end', () => {
      this.animationService.status$.next('Ready');
      this.stream = null;
      console.log('Done.');
    });

    this.stream.on('error', error => {
      this.animationService.status$.next('Error');
      console.error(error);
    });
  }

}

class BufferPositionedRect {
  private line: Line;
  constructor(
    private svg: Svg,
    private rect: Rect,
    private slots: Rect[],
  ) { }

  apply(state: BufferState.AsObject, buffer: boolean[], index: number) {
    const slot = this.slots[index];
    const actor = this.rect;

    if (this.line) {
      this.line.remove();
      this.line = undefined;
    }

    if (!state) {
      actor.animate(50, 0, 'after').attr({fill: '#FFF'});
    } else if (state.state === BufferState.State.WAIT_FOR_BUFFER) {
      actor.animate(50, 0, 'after').attr({fill: '#00F'});
    } else if (state.state === BufferState.State.PRODUCING_ITEM || state.state === BufferState.State.CONSUMING_ITEM) {
      actor.animate(50, 0, 'after').attr({ fill: '#888' });
    } else if (state.state === BufferState.State.PRODUCED_ITEM) {
      this.line = this.svg
        .line(actor.x() + 12.5, actor.y() + 25, slot.x() + (bufferWidth / this.slots.length / 2), slot.y())
        .stroke({ opacity: 100, color: '#000' });
      this.line.marker('end', 10, 10, (add) => {
          add.polygon('5,5 0,7.5 0,2.5');
        });
      actor.animate(50, 0, 'after').attr({ fill: '#F00' });
      // slot.animate(50, 0, 'after').attr({ fill: '#000' });
    } else if (state.state === BufferState.State.CONSUMED_ITEM) {
      this.line = this.svg
        .line(actor.x() + 12.5, actor.y(), slot.x() +(bufferWidth / this.slots.length / 2), slot.y() + bufferHeight)
        .stroke({ opacity: 100, color: '#000' });
      this.line.marker('end', 10, 10, (add) => {
          add.polygon('5,5 0,7.5 0,2.5');
        });
      actor.animate(50, 0, 'after').attr({ fill: '#F00' });
      // slot.animate(50, 0, 'after').attr({ fill: '#FFF' });
    } else {
      actor.animate(50, 0, 'after').attr({fill: '#FFF'});
    }

    for (let i = 0; i < buffer.length; i++) {
      this.slots[i].attr({fill: buffer[i] ? '#000' : '#FFF'});
    }
  }
}

interface AnimationState {
  states: BufferState.AsObject[];
  buffer: boolean[];
  produceIndex: number;
  consumeIndex: number;
}
