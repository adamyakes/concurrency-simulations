import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CSSClient } from '../css_grpc_web_pb';
import { BufferRun, DPRun, RWRun, UnisexRun } from '../css_pb';
import { Problems } from '../problems.enum';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class PastRunsService {
  public selectedProblem = new BehaviorSubject<Problems>(null);
  public runs = new Subject<RWRun.AsObject[] | BufferRun.AsObject[] | DPRun.AsObject[] | UnisexRun.AsObject[]>();
  private client: CSSClient;
  constructor(private backend: BackendService, private authService: AuthService) {
    this.client = backend.client;
  }

  setCurrentProblem(problem: Problems) {
    this.selectedProblem.next(problem);
    this.fetch();
  }

  fetch() {
    console.log('Fetching. Given:', this.selectedProblem.value);
    switch (this.selectedProblem.value) {
    case Problems.DiningPhilosophers:
      this.getDPRuns();
      return;
    case Problems.ReadWrite:
      this.getRWRuns();
      return;
    case Problems.UnisexBathroom:
      this.getUnisexRuns();
      return;
    case Problems.BoundedBuffer:
      this.getBufferRuns();
      return;
    }
  }

  getDPRuns() {
    console.log('Getting DP runs');
    this.client.getDPStats(this.authService.getSaveCode(), {}, (err, response) => {
      if (err) {
        console.error('Failed to retrieve philosopher stats:', err);
        return;
      }
      this.runs.next(response
        .getDpRunsList()
        .map(run => run.toObject())
        .sort((a, b) => b.timestamp - a.timestamp)
      ); // Reverse chronological
    });
  }
  getRWRuns() {
    console.log('Getting RW runs');
    this.client.getRWStats(this.authService.getSaveCode(), {}, (err, response) => {
      if (err) {
        console.error('Failed to retrieve readwrite stats:', err);
        return;
      }
      this.runs.next(response
        .getRwRunsList()
        .map(run => run.toObject())
        .sort((a, b) => b.timestamp - a.timestamp)
      ); // Reverse chronological
    });
  }
  getBufferRuns() {
    console.log('Getting Buffer runs');
    this.client.getBufferStats(this.authService.getSaveCode(), {}, (err, response) => {
      if (err) {
        console.error('Failed to retrieve readwrite stats:', err);
        return;
      }
      this.runs.next(response
        .getBufferRunsList()
        .map(run => run.toObject())
        .sort((a, b) => b.timestamp - a.timestamp)
      ); // Reverse chronological
    });
  }
  getUnisexRuns() {
    console.log('Getting Unisex runs');
    this.client.getUnisexStats(this.authService.getSaveCode(), {}, (err, response) => {
      if (err) {
        console.error('Failed to retrieve unisex stats:', err);
        return;
      }
      this.runs.next(response
        .getUnisexRunsList()
        .map(run => run.toObject())
        .sort((a, b) => b.timestamp - a.timestamp)
      ); // Reverse chronological
    });
  }
}
