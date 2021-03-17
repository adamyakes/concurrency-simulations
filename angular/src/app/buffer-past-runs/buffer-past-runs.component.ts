import { Component, Input } from '@angular/core';
import { BufferRun } from '../css_pb';
import { AnimationService } from '../services/animation.service';
import { AuthService } from '../services/auth.service';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-buffer-past-runs',
  templateUrl: './buffer-past-runs.component.html',
  styleUrls: ['./buffer-past-runs.component.scss']
})
export class BufferPastRunsComponent {

  @Input() runs: BufferRun.AsObject[];

  constructor() {
  }

  aggregate(run: BufferRun.AsObject, param: string) {
    return run.statsList.reduce((prev, cur) => prev + cur[param], 0);
  }

}
