import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { appTitle, millisecond, second } from '../constants';
import { CSSClient } from '../css_grpc_web_pb';
import { UnisexOptions, UnisexState } from '../css_pb';
import { ProblemUpdate } from '../problem-update';
import { AnimationService } from '../services/animation.service';
import { BackendService } from '../services/backend.service';
import { ClientReadableStream } from 'grpc-web';
import { Rect, Svg } from '@svgdotjs/svg.js';
import { AuthService } from '../services/auth.service';
import { PastRunsService } from '../services/past-runs.service';
import { Problems } from '../problems.enum';

@Component({
  selector: 'app-unisex',
  templateUrl: './unisex.component.html',
  styleUrls: ['./unisex.component.scss']
})
export class UnisexComponent implements AfterViewInit, OnDestroy {
  @Input() moveStateNotifier: Subject<number>;
  @Output() results = new EventEmitter<ProblemUpdate>();

  public states: UnisexAnimationState[] = [];
  public stream: ClientReadableStream<UnisexState>;
  index = 0;
  solutions = UnisexOptions.Solution;
  solution: UnisexOptions.Solution = UnisexOptions.Solution.FIRST;
  numMales = 5;
  males: UnisexPositionedRect[] = [];
  maleTime = 10;

  femaleSwitch: Rect;
  maleSwitch: Rect;

  capacity = 5;

  numFemales = 5;
  females: UnisexPositionedRect[] = [];
  femaleTime = 10;

  resetTime = 5;
  variation = 0;

  duration = 5;
  units: number = millisecond;

  client: CSSClient;

  private subscriptions: Subscription[] = [];
  private svg: Svg;

  constructor(
    private authService: AuthService,
    private animationService: AnimationService,
    private titleService: Title,
    private backend: BackendService,
    private pastRuns: PastRunsService,
  ) {
    pastRuns.setCurrentProblem(Problems.UnisexBathroom);
  }

  setNumFemales(value: number): void {
    this.numFemales = value;
    this.makeUnisexAnimation();
  }
  setNumMales(value: number): void {
    this.numMales = value;
    this.makeUnisexAnimation();
  }
  setCapacity(value: number): void {
    this.capacity = value;
    this.makeUnisexAnimation();
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
    for (let i = 0; i < stateSet.states.length; i++) {
      const state = stateSet.states[i];
      if (i < this.numMales) {
        this.males[i].apply(state, stateSet.room, animate);
      } else {
        this.females[i - this.numMales].apply(state, stateSet.room, animate);
      }
    }

    const duration = animate ? 50 : 0;

    const switchColorOn = '#0F0';
    const switchColorOff = '#F00';
    const maleSwitchColor = stateSet.maleSwitch ? switchColorOn : switchColorOff;
    const femaleSwitchColor = stateSet.femaleSwitch ? switchColorOn : switchColorOff;

    this.femaleSwitch.animate(duration, 0, 'after').attr({fill: femaleSwitchColor});
    this.maleSwitch.animate(duration, 0, 'after').attr({fill: maleSwitchColor});
  }
  copyData(state: UnisexState.AsObject): UnisexAnimationState {
    const lastState = this.states[this.states.length - 1];
    const newArr = [...lastState.states];
    if (state.id >= 0) {
      newArr[state.id] = state;
    }
    return {
      states: newArr,
      room: [...lastState.room],
      femaleSwitch: lastState.femaleSwitch,
      maleSwitch: lastState.maleSwitch
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.client = this.backend.client;
      this.titleService.setTitle(`Unisex Bathroom - ${appTitle}`);
      this.animationService.svg$.subscribe(svg => {
        if (svg) {
          this.svg = svg;
          this.makeUnisexAnimation();
        }
      });
      this.subscriptions.push(this.animationService.command$.subscribe(() => {
        if (this.stream) {
          this.stream.cancel();
          this.stream = null;
          this.animationService.status$.next('Ready');
        } else {
          this.makeUnisexAnimation();
          this.go();
        }
      }));
    }, 0);

      this.subscriptions.push(this.animationService.goal$.subscribe(goal => { this.moveToState(goal); }));
  }

  ngOnDestroy(): void {
    this.stream?.cancel();
    this.stream = null;
    this.subscriptions.forEach(s => s?.unsubscribe());
  }

  makeUnisexAnimation(): void {
    this.stream?.cancel();
    this.stream = null;
    this.animationService.reset();
    this.svg.clear();
    this.index = 0;
    this.states = [];
    this.svg.text('Males').move(80, 30);
    this.svg.text('Idle').move(30, 50);
    this.svg.text('Waiting').move(120, 50);

    this.svg.text('Females').move(400, 30);
    this.svg.text('Idle').move(475, 50);
    this.svg.text('Waiting').move(350, 50);

    this.maleSwitch = this.svg.rect(15, 15).move(190, 50).fill('#fff').stroke('#000');
    this.femaleSwitch = this.svg.rect(15, 15).move(300, 50).fill('#fff').stroke('#000');
    this.svg.rect(125, 200).move(190, 75).stroke('#000').fill('#fff');

    this.males = [];
    for (let i = 0; i < this.numMales; i++) {
      const rect = this.svg.rect(25, 25).fill('#ffbb00').stroke('#000').move(30, 75 + 35 * i);
      this.males.push(new UnisexPositionedRect(rect, true, this.svg, i));
    }

    this.females = [];
    for (let i = 0; i < this.numFemales; i++) {
      const rect = this.svg.rect(25, 25).fill('#00a82d').stroke('#000').move(475, 75 + 35 * i);
      this.females.push(new UnisexPositionedRect(rect, false, this.svg, i + this.numMales));
    }

    const box = this.svg.bbox();
    this.svg.viewbox(0, 0, box.width + 50, box.height + 50);
  }

  go(): void {
    const options = new UnisexOptions();
    options.setSolution(this.solution);
    options.setSaveCode(this.authService.getSaveCode());
    options.setDuration(this.duration * second);

    options.setNumFemales(this.numFemales);
    options.setNumMales(this.numMales);
    options.setMaxAllowed(this.capacity);

    options.setFemaleTime(this.femaleTime * this.units);
    options.setMaleTime(this.maleTime * this.units);
    options.setRestartTime(this.resetTime * this.units);
    options.setVariation(this.variation * this.units);

    const blankStates: UnisexState.AsObject[] = [];
    for (let i = 0; i < this.numMales+this.numFemales; i++) {
      blankStates.push(null);
    }
    const blankRoom: number[] = [];
    for (let i = 0; i < this.capacity; i++) {
      blankRoom.push(-1);
    }
    this.states = [{
      states: blankStates,
      room: blankRoom,
      femaleSwitch: false,
      maleSwitch: false,
    }];

    this.animationService.status$.next('Running');
    this.stream = this.client.unisex(options);

    this.stream.on('data', data => {
      if (this.states.length > 100000) {
        return;
      }
      const o = data.toObject();
      const newState = this.copyData(o);
      const room = newState.room;
      if (o.state === UnisexState.State.ENTERING) {
        for (let i = 0; i < room.length; i++) {
          if (room[i] === -1) {
            room[i] = o.id;
            break;
          }
        }
      } else if (o.state === UnisexState.State.LEAVING) {
        for (let i = 0; i < room.length; i++) {
          if (room[i] === o.id) {
            room[i] = -1;
            break;
          }
        }
      } else if (o.state === UnisexState.State.FEMALE_SWITCH_OFF) {
        newState.femaleSwitch = false;
      } else if (o.state === UnisexState.State.FEMALE_SWITCH_ON) {
        newState.femaleSwitch = true;
      } else if (o.state === UnisexState.State.MALE_SWITCH_OFF) {
        newState.maleSwitch = false;
      } else if (o.state === UnisexState.State.MALE_SWITCH_ON) {
        newState.maleSwitch = true;
      }
      this.states.push(newState);
      this.animationService.stateReceived();
    });
    this.stream.on('error', () => {
      this.stream = null;
      this.animationService.status$.next('Error');
    });
    this.stream.on('end', () => {

      this.stream = null;
      this.animationService.status$.next('Ready');
    });
  }
}

export class UnisexPositionedRect {
  private startX: number;
  private startY: number;
  private waitX: number;

  constructor(
    public rect: Rect,
    public male: boolean,
    private svg: Svg,
    public id: number,
    public idle: boolean = true,
  ) {
    this.startX = rect.x();
    this.startY = rect.y();
    this.waitX = this.startX + (male ? 1 : -1) * 90;
  }

  apply(state: UnisexState.AsObject, room: number[], animate = false): void {
    const duration = animate ? 50 : 0;
    if (!state) {
      this.setIdle(duration);
    } else if (state.state === UnisexState.State.QUEUING) {
      this.queue(duration);
    } else if (state.state === UnisexState.State.LEAVING) {
      this.setIdle(duration);
    } else if (state.state === UnisexState.State.ENTERING) {
      // this.svg.rect(125, 150).move(190, 75).stroke('#000').fill('#fff');
      let slot: number;
      for (let i = 0; i < room.length; i++) {
        if (room[i] === this.id) {
          slot = i;
          break;
        }
      }
      this.rect.animate(duration, 0, 'after').move(slot % 2 === 0 ? 210 : 275, 100 + 30 * Math.floor(slot / 2));
    }
  }

  setIdle(duration: number): void {
    this.rect.animate(duration, 0, 'after').move(this.startX, this.startY);
  }

  queue(duration: number): void {
    this.rect.animate(duration, 0, 'after').move(this.waitX, this.startY);
  }
}

interface UnisexAnimationState {
  states: UnisexState.AsObject[];
  room: number[];
  femaleSwitch: boolean;
  maleSwitch: boolean;
}
