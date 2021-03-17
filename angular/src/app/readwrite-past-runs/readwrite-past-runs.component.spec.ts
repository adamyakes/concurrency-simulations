import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadwritePastRunsComponent } from './readwrite-past-runs.component';

describe('ReadwritePastRunsComponent', () => {
  let component: ReadwritePastRunsComponent;
  let fixture: ComponentFixture<ReadwritePastRunsComponent>;

  beforeEach(async(() => {
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
