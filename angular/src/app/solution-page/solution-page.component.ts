import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProblemUpdate, ProblemState } from '../problem-update';
import { DPState, RWState, ModusState, BufferState, UnisexState, RWRun, BufferRun, DPRun, UnisexRun } from '../css_pb';
import { SVG } from '@svgdotjs/svg.js';
import { AnimationService } from '../services/animation.service';
import { PastRunsService } from '../services/past-runs.service';
import { Problems } from '../problems.enum';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-solution-page',
  templateUrl: './solution-page.component.html',
  styleUrls: ['./solution-page.component.scss']
})
export class SolutionPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('svgContainer', { read: ElementRef }) svgContainer: ElementRef;
  @ViewChild('drawer') drawer: MatDrawer;
  running = false;
  currentStatePos = 0;
  selectedProblem: Problems;
  problems = Problems;
  status = 'Ready';
  states = 0;
  currentStates: ProblemState[] = [];
  playing = false;
  interval: number;
  runs: RWRun.AsObject[] | BufferRun.AsObject[] | DPRun.AsObject[] | UnisexRun.AsObject[];

  private _speed = 250;
  // eslint-disable-next-line no-underscore-dangle
  get speed() { return this._speed; }
  set speed(value: number) {
    // eslint-disable-next-line no-underscore-dangle
    this._speed = value;
    this.playPause();
    this.playPause();
  }

  private subscriptions: Subscription[] = [];
  private dirty = true;

  constructor(private animationService: AnimationService, private pastRuns: PastRunsService, private authService: AuthService) {
    // this.pastRuns.selectedProblem.subscribe(problem => {
    //   if (problem !== null) {
    //     this.selectedProblem = problem;
    //     this.pastRuns.fetch();
    //   }
    // });
    this.authService.code.subscribe(() => this.pastRuns.fetch());
    this.subscriptions.push(animationService.status$.subscribe(status => {
      if (status !== 'Ready') {
        this.dirty = true;
      } else if (this.dirty) {
        this.dirty = false;
        this.pastRuns.fetch();
      }
    }));
    this.subscriptions.push(this.pastRuns.runs.subscribe(runs => {
      this.selectedProblem = this.pastRuns.selectedProblem.value;
      this.runs = runs;
    }));
  }

  ngOnInit(): void {
    this.animationService.status$.subscribe(status => {
      this.status = status;
      this.running = this.status === 'Running';
    });
    this.animationService.toggleSidebar.subscribe(() => this.drawer.toggle());
  }
  ngOnDestroy(): void {
    SVG('#svg-container')?.clear();
    this.animationService.setSvg(null);
    this.subscriptions.forEach(s => s?.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.animationService.setSvg(SVG().addTo(this.svgContainer.nativeElement));
    this.animationService.stateCount$.subscribe(states => {
      if (states < this.states) {
        this.currentStatePos = 0;
      }
      this.states = states;
    });
  }

  results(result: ProblemUpdate): void {
    if (typeof result === 'string') {
      if (result === 'reset') {
        this.states = 0;
        this.currentStates = [];
      }
      this.status = result[0].toUpperCase() + result.slice(1);
    } else if (result instanceof RWState) {
      this.states++;
    } else if (result instanceof DPState) {
      this.states++;
    } else if (result instanceof ModusState) {
      this.states++;
    } else if (result instanceof BufferState) {
      this.states++;
    } else if (result instanceof UnisexState) {
      this.states++;
    }
  }

  playPause(): void {
    this.playing = !this.playing;
    if (this.playing) {
      this.interval = window.setInterval(() => {
        if (this.currentStatePos >= this.states) {
          this.playing = false;
          window.clearInterval(this.interval);
        } else {
          this.currentStatePos++;
          this.animationService.move(this.currentStatePos);
        }
      }, this.speed);
    } else {
      window.clearInterval(this.interval);
    }
  }

  back(): void {
    this.animationService.move(--this.currentStatePos);
  }

  forward(): void {
    this.animationService.move(++this.currentStatePos);
  }

  moveToState(index: number): void {
    this.animationService.move(this.currentStatePos = index);
  }

  goOrCancel(): void {
    this.animationService.goOrCancel();
  }
}
