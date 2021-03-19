import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnisexPastRunsComponent } from './unisex-past-runs.component';

describe('UnisexPastRunsComponent', () => {
  let component: UnisexPastRunsComponent;
  let fixture: ComponentFixture<UnisexPastRunsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnisexPastRunsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnisexPastRunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
