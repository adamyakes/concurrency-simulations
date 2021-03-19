import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadwritePastRunsComponent } from './readwrite-past-runs.component';

describe('ReadwritePastRunsComponent', () => {
  let component: ReadwritePastRunsComponent;
  let fixture: ComponentFixture<ReadwritePastRunsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadwritePastRunsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadwritePastRunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
