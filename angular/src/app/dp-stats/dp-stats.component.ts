import { Component, Input, OnInit } from '@angular/core';
import { DPRun } from '../css_pb';
import { CSSClient } from '../css_grpc_web_pb';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dp-stats',
  templateUrl: './dp-stats.component.html',
  styleUrls: ['./dp-stats.component.scss']
})
export class DpStatsComponent {
  @Input() runs: DPRun.AsObject[];
  philosopherService = new CSSClient(environment.hostname);

  constructor(private authService: AuthService) { }

  getSolutionDescription(solution: number) {
    return solution === 0 ? 'First (Non-Solution)'
      : solution === 1 ? 'Footman'
      : 'Lefty';
  }

  aggregate(run: DPRun.AsObject, param: string) {
    return run.statsList.reduce((prev, cur) => prev + cur[param], 0);
  }
}
