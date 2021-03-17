import { TestBed } from '@angular/core/testing';

import { PastRunsService } from './past-runs.service';

describe('PastRunsService', () => {
  let service: PastRunsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PastRunsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
