import { Component, Input } from '@angular/core';
import { RWRun } from '../css_pb';

@Component({
  selector: 'app-readwrite-past-runs',
  templateUrl: './readwrite-past-runs.component.html',
  styleUrls: ['./readwrite-past-runs.component.scss']
})
export class ReadwritePastRunsComponent {

  @Input() runs: RWRun.AsObject[];

  constructor() { }

  getSolutionDescription(solution: number) {
    return solution === 1 ? 'First (Starvation)'
      : solution === 2 ? 'No starvation with turnstile'
      : 'Writer Priority';
  }

  aggregate(run: RWRun.AsObject, param: string) {
    return run.statsList.reduce((prev, cur) => prev + cur[param], 0);
  }

}
