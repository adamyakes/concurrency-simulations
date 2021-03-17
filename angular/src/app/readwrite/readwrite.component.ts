import { AfterViewInit, Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CSSClient } from '../css_grpc_web_pb';
import { RWOptions, RWState } from '../css_pb';
import { appTitle, millisecond, second } from '../constants';
import { FormatService } from '../services/format.service';
import { ClientReadableStream } from 'grpc-web';
import { Svg, Rect, Line } from '@svgdotjs/svg.js';
import { BackendService } from '../services/backend.service';
import { Title } from '@angular/platform-browser';
import { AnimationService } from '../services/animation.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PastRunsService } from '../services/past-runs.service';
import { Problems } from '../problems.enum';

@Component({
  selector: 'app-readwrite',
  templateUrl: './readwrite.component.html',
  styleUrls: ['./readwrite.component.scss']
})
export class ReadwriteComponent implements OnInit, AfterViewInit, OnDestroy {

  client: CSSClient;
  index = 0;

  readers: PositionedRect[] = [];
  readerWaitSlot = 0;
  readerIdleSlot = 0;
  writers: PositionedRect[] = [];
  writerWaitSlot = 0;
  writerIdleSlot = 0;

  stream: ClientReadableStream<RWState>;
  states: RWState.AsObject[][] = [];

  public solution = 1;
  public duration = 5;
  public readTime = 10;
  public writeTime = 10;
  public readSleep = 10;
  public writeSleep = 10;
  public variation = 0;
  public numReaders = 5;
  public numWriters = 5;
  public units = millisecond;

  private svg: Svg;
  private subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    public formatter: FormatService,
    private titleService: Title,
    private animationService: AnimationService,
    private backend: BackendService,
    private pastRuns: PastRunsService,
  ) {
    pastRuns.setCurrentProblem(Problems.ReadWrite);
  }

  setNumReaders(num: number): void {
    this.numReaders = num;
    this.makeAnimation();
  }
  setNumWriters(num: number): void {
    this.numWriters = num;
    this.makeAnimation();
  }

  ngOnInit(): void {
    this.client = this.backend.client;
    this.titleService.setTitle(`Readers & Writers - ${appTitle}`);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscriptions.push(this.animationService.svg$.subscribe(svg => {
        if (svg) {
          this.svg = svg;
          this.makeAnimation();
        }
      }));
      this.subscriptions.push(this.animationService.command$.subscribe(() => {
        if (this.stream) {
          this.stream.cancel();
          this.stream = null;
          this.animationService.status$.next('Ready');
        } else {
          this.makeAnimation();
          console.log('received command');
          this.go();
        }
      }));

      this.subscriptions.push(this.animationService.goal$.subscribe(goal => { this.moveToState(goal); }));

    }, 0);
  }

  makeAnimation(): void {
    this.stream?.cancel();
    this.animationService.reset();
    this.svg.clear();
    this.index = 0;
    this.states = [];
    this.svg.text('Readers').move(80, 30);
    this.svg.text('Idle').move(30, 50);
    this.svg.text('Waiting').move(120, 50);

    this.svg.text('Writers').move(400, 30);
    this.svg.text('Idle').move(475, 50);
    this.svg.text('Waiting').move(350, 50);

    this.svg.rect(100, 125).move(200, 30).stroke('#000').fill('#fff');

    this.readers = [];
    for (let i = 0; i < this.numReaders; i++) {
      const rect = this.svg.rect(25, 25).fill('#fff').stroke('#000').move(30, 75 + 35 * i);
      this.readers.push(new PositionedRect(rect, true, this.svg, i));
    }

    this.writers = [];
    for (let i = 0; i < this.numWriters; i++) {
      const rect = this.svg.rect(25, 25).fill('#fff').stroke('#000').move(475, 75 + 35 * i);
      this.writers.push(new PositionedRect(rect, false, this.svg, i + this.numReaders));
    }
    const box = this.svg.bbox();
    this.svg.viewbox(0, 0, box.width + 50, box.height + 50);
  }

  copyData(state: RWState.AsObject): RWState.AsObject[] {
    const newArr = [...this.states[this.states.length - 1]];
    newArr[state.id] = state;
    return newArr;
  }

  go(): void {
    const options = new RWOptions();
    options.setSaveCode(this.authService.getSaveCode());
    options.setSolution(this.solution);
    options.setDuration(second * this.duration);
    options.setNumReaders(this.numReaders);
    options.setNumWriters(this.numWriters);
    options.setReadDuration(this.units * this.readTime);
    options.setWriteDuration(this.units * this.writeTime);
    options.setReadSleep(this.units * this.readSleep);
    options.setWriteSleep(this.units * this.writeSleep);
    options.setVariation(this.units * this.variation);

    const blankStates: RWState.AsObject[] = [];
    for (let i = 0; i < this.numReaders+this.numWriters; i++) {
      blankStates.push(null);
    }
    this.states = [blankStates];

    this.stream?.cancel();
    this.animationService.status$.next('Running');
    this.stream = this.client.readWrite(options);

    this.stream.on('data', data => {
      if (this.states.length > 100000) {
        return;
      }
      this.states.push(this.copyData(data.toObject()));
      this.animationService.stateReceived();
    });

    this.stream.on('error', () => {
      this.stream = null;
      this.animationService.status$.next('Error');
    });

    this.stream.on('end', () => {
      console.log('end');
      this.stream = null;
      this.animationService.status$.next('Ready');
    });
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
  }

  setState(animate: boolean): void {
    const stateSet = this.states[this.index];
    for (let i = 0; i < stateSet.length; i++) {
      const state = stateSet[i];
      if (i < this.numReaders) {
        this.readers[i].apply(state, animate);
      } else {
        this.writers[i - this.numReaders].apply(state, animate);
      }
    }
  }

  ngOnDestroy(): void {
    this.stream?.cancel();
    this.stream = null;
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

}

@Pipe({
  name: 'readWriteStateString'
})
export class ReadWriteStateStringPipe implements PipeTransform {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  transform(state: RWState.State, ...args: any[]): string {
    switch (state) {
    case RWState.State.UNDEFINED: return 'Undefined';
    case RWState.State.READING: return 'Reading';
    case RWState.State.WRITING: return 'Writing';
    case RWState.State.WAITING_FOR_MUTEX: return 'Waiting for mutex';
    case RWState.State.ACQUIRED_MUTEX: return 'Acquired mutex';
    case RWState.State.RELEASED_MUTEX: return 'Released mutex';
    case RWState.State.WAITING_FOR_ROOM_EMPTY: return 'Waiting for room empty';
    case RWState.State.RECEIVED_ROOM_EMPTY: return 'Received room empty';
    case RWState.State.SIGNAL_ROOM_EMPTY: return 'Signal room empty';
    case RWState.State.WAITING_FOR_TURNSTILE: return 'Waiting for turnstile';
    case RWState.State.THROUGH_TURNSTILE: return 'Through turnstile';
    case RWState.State.ENTER_READ_SWITCH: return 'Enter read switch';
    case RWState.State.LEAVE_READ_SWITCH: return 'Leave read switch';
    case RWState.State.ENTER_WRITE_SWITCH: return 'Enter write switch';
    case RWState.State.LEAVE_WRITE_SWITCH: return 'Leave write switch';
    case RWState.State.WAITING_FOR_NO_READERS: return 'Waiting for no readers';
    case RWState.State.WAITING_FOR_NO_WRITERS: return 'Waiting for no writers';
    case RWState.State.SIGNAL_NO_READERS: return 'Signal no readers';
    case RWState.State.SIGNAL_NO_WRITERS: return 'Signal no writers';
    case RWState.State.RECEIVED_NO_READERS: return 'Received no readers';
    case RWState.State.RECEIVED_NO_WRITERS: return 'Received no readers';
    case RWState.State.END_ACTION: return 'Ending task';
    case RWState.State.WAIT_ACTION: return 'Waiting to perform task';
    }
  }
}

export class PositionedRect {
  private line: Line | null;
  private startX: number;
  constructor(
    public rect: Rect,
    public reader: boolean,
    private svg: Svg,
    public id: number,
    public idle: boolean = true,
  ) {
    this.startX = this.rect.x();
  }

  apply(state: RWState.AsObject, animate = false): void {
    const duration = animate ? 50 : 0;
    if (!state) {
      this.rect.animate(duration, 0, 'after').attr({ fill: '#FFF' });
      this.destroyLine();
    } else if (state.state === RWState.State.WRITING || state.state === RWState.State.READING) {
      this.rect.animate(duration, 0, 'after').attr({ fill: '#F00' });
      this.queue(animate);
      this.makeLine();
    } else if (state.state === RWState.State.END_ACTION) {
      this.rect.animate(duration, 0, 'after').attr({ fill: '#FFF' });
      this.setIdle(animate);
      this.destroyLine();
    } else if (state.state === RWState.State.WAIT_ACTION) {
      this.queue(animate);
      this.rect.animate(duration, 0, 'after').attr({ fill: '#00F' });
      this.destroyLine();
    }
  }

  setIdle(animate: boolean): void {
    if (this.idle) {
      return;
    }
    this.idle = true;
    const dx = this.reader ? -90 : 90;
    if (animate) {
      this.rect.animate(50, 0, 'after').dmove(dx, 0);
    } else {
      this.rect.dmove(dx, 0);
    }
  }

  queue(animate: boolean): void {
    if (!this.idle) {
      return;
    }
    this.idle = false;
    const dx = this.reader ? 90 : -90;
    if (animate) {
      this.rect.animate(50, 0, 'after').dmove(dx, 0);
    } else {
      this.rect.dmove(dx, 0);
    }
  }

  makeLine() {
    if (this.line) {
      return;
    }
    const [endX, endY] = randRectPos();
    this.line = this.svg.line(
      this.startX + (this.reader ? 115 : -90),
      this.rect.y() + 12.5,
      endX,
      endY,
    ).stroke({ opacity: 100, color: '#000' });
    this.line.marker('end', 10, 10, add => {
      add.polygon('5,5 0,7.5 0,2.5');
    });
  }

  destroyLine(): void {
    this.line?.remove();
    this.line = null;
  }
}

export const randRectPos = (): [number, number] => [Math.floor(Math.random() * 100) + 200, Math.floor(Math.random() * 125) + 30];
