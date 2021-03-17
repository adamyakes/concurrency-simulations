import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { DPOptions, DPState } from '../css_pb';
import { CSSClient } from '../css_grpc_web_pb';
import { FormatService } from '../services/format.service';
import { Circle, Rect, Text, Line, Timeline, Svg } from '@svgdotjs/svg.js';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { appTitle, millisecond, second } from '../constants';
import { BackendService } from '../services/backend.service';
import { AnimationService } from '../services/animation.service';
import { ClientReadableStream } from 'grpc-web';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PastRunsService } from '../services/past-runs.service';
import { Problems } from '../problems.enum';

@Component({
  selector: 'app-dp',
  templateUrl: './dp.component.html',
  styleUrls: ['./dp.component.scss']
})
export class DpComponent implements OnInit, OnDestroy, AfterViewInit {
  public units = millisecond;
  public numPhilosophers = 5;

  public duration = 5;
  public timeThinking = 10;
  public timeEating = 10;
  public variation = 0;
  public animationDuration = 5;
  public playing = false;
  public stream: ClientReadableStream<DPState> = null;

  public solution = 0;
  private sleep = 0;

  private subscriptions: Subscription[] = [];
  private client: CSSClient;
  private svg: Svg;

  private states: PictureState[];
  private p: Picture;

  private index = 0;

  constructor(
    private authService: AuthService,
    public formatter: FormatService,
    private titleService: Title,
    formBuilder: FormBuilder,
    backend: BackendService,
    private animationService: AnimationService,
    private pastRuns: PastRunsService,
  ) {
    this.client = backend.client;
    formBuilder.group({
      solution: this.solution,
      duration: this.duration,
      sleep: this.sleep,
    });
    pastRuns.setCurrentProblem(Problems.DiningPhilosophers);
  }

  ngAfterViewInit(): void {
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

  setNumPhilosophers(num: number): void {
    this.numPhilosophers = num;
    this.makeAnimation();
  }


  ngOnDestroy(): void {
    this.stream?.cancel();
    this.stream = null;
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }

  ngOnInit(): void {
    this.titleService.setTitle(`Dining Philosophers - ${appTitle}`);
    this.animationService.svg$.subscribe(svg => {
      if (svg) {
        this.svg = svg;
        this.makeAnimation();
      }
    });
  }

  go(): void {
    const request = new DPOptions();
    request.setSaveCode(this.authService.getSaveCode());
    request.setChoice(this.solution);
    request.setDuration(second * this.duration);
    request.setSize(this.numPhilosophers);
    request.setTimeThinking(this.units * this.timeThinking);
    request.setTimeEating(this.units * this.timeEating);

    this.makeAnimation();
    this.stream = this.client.philosophize(request);

    this.animationService.status$.next('Running');

    this.stream.on('data', response => {
      if (this.states.length > 100000) {
        return;
      }
      this.animationService.stateReceived();
      this.states.push(this.transform(response));
    });

    this.stream.on('end', () => {
      this.stream = null;
      this.animationService.status$.next('Ready');
    });
  }

  makeAnimation(): void {
    this.index = 0;
    this.stream?.cancel();
    this.stream = null;
    this.animationService.reset();
    const draw = this.svg;
    draw.clear();
    this.svg.viewbox(0, 0, 350, 350);

    // Dining table
    draw.circle().radius(100).move(75, 75).attr({ fill: '#fff'}).stroke({ color: '#000', width: 3 });
    const philosophers: Circle[] = [];
    const philosopherCoords: Coordinate[] = [];
    const resources: Rect[] = [];
    const resourceCoords: Coordinate[] = [];
    const philosopherTexts: Text[] = [];
    const lines: Line[][] = [];
    const timeline = new Timeline();
    this.p = {
      philosophers,
      philosopherCoords,
      resources,
      resourceCoords,
      philosopherTexts,
      lines,
      timeline,
    };
    for (let i = 0; i < this.numPhilosophers; i++) {
      const resCoord = this.alongCircle(175, 175, 75, 2 * Math.PI * (2 * i + 1) / (2 * this.numPhilosophers));
      resourceCoords.push(resCoord);
      resources.push(draw.rect(12.5, 12.5).move(resCoord.x - 6.25, resCoord.y - 6.25).attr({ fill: '#fff', stroke: '#000' }));

      const philCoord = this.alongCircle(175, 175, 125, 2 * Math.PI * (i + 1) / this.numPhilosophers);
      philosophers.push(draw.circle(25).move(philCoord.x - 12.5, philCoord.y - 12.5).attr({ fill: '#ff0', stroke: '#000' }));
      philosopherCoords.push(philCoord);
      const textCoord = this.alongCircle(175, 175, 150, 2 * Math.PI * (i + 1) / this.numPhilosophers);
      philosopherTexts.push(draw.text('').move(textCoord.x - 10, textCoord.y - 15));
    }
    // Draw the lines
    for (let i = 0; i < this.numPhilosophers; i++) {
      const phil = philosopherCoords[i];
      let res = resourceCoords[i];
      let baseX = Math.min(phil.x, res.x);
      let baseY = Math.min(phil.y, res.y);
      const left = draw.line(
        phil.x - baseX,
        phil.y - baseY,
        res.x - baseX,
        res.y - baseY,
      ).move(baseX, baseY).stroke({ color: '#000', width: 2, linecap: 'round' });
      res = resourceCoords[(i + 1) % this.numPhilosophers];
      baseX = Math.min(phil.x, res.x);
      baseY = Math.min(phil.y, res.y);
      const right = draw.line(
        phil.x - baseX,
        phil.y - baseY,
        res.x - baseX,
        res.y - baseY,
      ).move(baseX, baseY).stroke({ color: '#000', width: 2, linecap: 'round' });

      left.stroke({ opacity: 0 });
      right.stroke({ opacity: 0 });
      lines.push([left, right]);
    }

    philosophers.forEach(p => p.timeline(timeline));
    philosopherTexts.forEach(t => t.timeline(timeline));
    this.states = [this.initialState(this.p)];
  }

  moveToState(to: number): void {
    if (Math.abs(this.index - to) > 10) {
      this.setState(this.index = to);
      return;
    }
    while (this.index !== to) {
      if (this.index < to) {
        this.setState(++this.index);
      } else {
        this.setState(--this.index);
      }
    }
  }

  initialState(p: Picture): PictureState {
    return ({
      philosophers: p.philosophers.map(() => DPState.State.UNDEFINED),
      lines: p.lines.map(() => [LineState.nothing, LineState.nothing]),
      resources: p.resources.map(() => ResourceState.unused),
    });
  }

  transform(incoming: DPState): PictureState {
    const oldState: PictureState = this.states[this.states.length - 1];
    const newState: PictureState = {
      philosophers: oldState.philosophers.map(s => s),
      lines: oldState.lines.map(arr => arr.map(s => s)),
      resources: oldState.resources.map(s => s),
    };
    const incomingState: DPState.State = incoming.getState();
    const id: number = incoming.getId();
    if (incomingState === DPState.State.HUNGRY) {
      newState.philosophers[id] = DPState.State.HUNGRY;
    } else if (incomingState === DPState.State.EATING) {
      newState.philosophers[id] = DPState.State.EATING;
    } else if (incomingState === DPState.State.THINKING) {
      newState.philosophers[id] = DPState.State.THINKING;
    } else if (incomingState === DPState.State.DEADLOCKED) {
      newState.philosophers[id] = DPState.State.DEADLOCKED;
    } else if (incomingState === DPState.State.GRACEFULLY_EXITED) {
      newState.philosophers[id] = DPState.State.GRACEFULLY_EXITED;
    } else if (incomingState === DPState.State.HOLDING_FORK) {
      const resourceNumber = incoming.getForkId();
      newState.resources[resourceNumber] = ResourceState.used;
      if (resourceNumber === id) { // left
        newState.lines[id][0] = LineState.consume;
      } else {
        newState.lines[id][1] = LineState.consume;
      }
    } else if (incomingState === DPState.State.RELEASING_FORK) {
      const resourceNumber = incoming.getForkId();
      newState.resources[resourceNumber] = ResourceState.unused;
      if (resourceNumber === id) { // left
        newState.lines[id][0] = LineState.nothing;
      } else {
        newState.lines[id][1] = LineState.nothing;
      }
    } else if (incomingState === DPState.State.REQUESTING_FORK) {
      const resourceNumber = incoming.getForkId();
      if (resourceNumber === id) { // left
        newState.lines[id][0] = LineState.request;
      } else {
        newState.lines[id][1] = LineState.request;
      }
    }
    return newState;
  }

  alongCircle(centerX: number, centerY: number, radius: number, angle: number): { x: number; y: number } {
    return {
      x: centerX + (Math.cos(angle) * radius),
      y: centerY + (Math.sin(angle) * radius),
    };
  }

  setLineState(line: Line, state: LineState): void {
    if (state === LineState.consume) {
      line.stroke({ opacity: 100 });
      const endreference = line.reference('marker-end');
      if (endreference) {endreference.remove();}
      line.marker('start', 10, 10, (add) => {
          add.polygon('5,5 10,7.5 10,2.5');
        });
    } else if (state === LineState.request) {
      line.stroke({ opacity: 100 });
      const startreference = line.reference('marker-start');
      if (startreference) {startreference.remove();}
      line.marker('end', 10, 10, (add) => {
          add.polygon('5,5 0,7.5 0,2.5');
        });
    } else if (state === LineState.nothing) {
      const endreference = line.reference('marker-end');
      if (endreference) {endreference.remove();}
      const startreference = line.reference('marker-start');
      if (startreference) {startreference.remove();}
      line.stroke({ opacity: 0 });
    }
  }

  setPhilosopherState(p: Circle, t: Text, state: DPState.State, animDur: number): void {
    let color: string; let text: string;
    if (state === DPState.State.UNDEFINED) {
      color = '#fff';
      text = '';
    } else if (state === DPState.State.THINKING) {
      color = '#00ff00';
      text = 'T';
    } else if (state === DPState.State.HUNGRY) {
      color = '#0000ff';
      text = 'H';
    } else if (state === DPState.State.EATING) {
      color = '#ff0000';
      text = 'E';
    } else if (state === DPState.State.GRACEFULLY_EXITED) {
      color = '#ffffff';
      text = 'G';
    } else if (state === DPState.State.DEADLOCKED) {
      text = '💀';
      color = '#737373';
    }
    p.animate({ duration: animDur, delay: 0 }).attr({ fill: color });
    t.text(text);
  }

  setResourceState(r: Rect, state: ResourceState, animDur: number): void {
    if (state === ResourceState.used) {
      r.animate({ duration: animDur, delay: 0, }).attr({ fill: '#f00' });
    } else if (state === ResourceState.unused) {
      r.animate({ duration: animDur, delay: 0, }).attr({ fill: '#fff' });
    }
  }

  setState(at: number): void {
    const cur = this.states[at];
    cur.lines.forEach((arr, i) => {
      this.setLineState(this.p.lines[i][0], arr[0]);
      this.setLineState(this.p.lines[i][1], arr[1]);
    });
    cur.philosophers.forEach((philState, i) => this.setPhilosopherState(
      this.p.philosophers[i],
      this.p.philosopherTexts[i],
      philState,
      this.animationDuration,
    ));
    cur.resources.forEach((resState, i) => this.setResourceState(this.p.resources[i], resState, this.animationDuration));
  }

}

enum ResourceState {
  used,
  unused,
}

enum LineState {
  request,
  consume,
  nothing,
}

interface Coordinate {
  x: number;
  y: number;
}

interface PictureState {
  philosophers: DPState.State[];
  lines: LineState[][];
  resources: ResourceState[];
}

interface Picture {
  philosophers: Circle[];
  philosopherCoords: Coordinate[];
  resources: Rect[];
  resourceCoords: Coordinate[];
  philosopherTexts: Text[];
  lines: Line[][];
  timeline: Timeline;
}
