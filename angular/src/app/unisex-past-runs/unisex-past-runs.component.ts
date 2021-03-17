import { Component, Input, OnInit } from '@angular/core';
import { UnisexRun } from '../css_pb';

@Component({
  selector: 'app-unisex-past-runs',
  templateUrl: './unisex-past-runs.component.html',
  styleUrls: ['./unisex-past-runs.component.scss']
})
export class UnisexPastRunsComponent implements OnInit {

  @Input() runs: UnisexRun.AsObject[];
  constructor() { }

  ngOnInit(): void {
  }

  aggregate(run: UnisexRun.AsObject, param: string) {
    return run.statsList.reduce((prev, cur) => prev + cur[param], 0);
  }

}
