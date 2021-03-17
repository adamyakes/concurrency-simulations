import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnisexPastRunsComponent } from './unisex-past-runs.component';

describe('UnisexPastRunsComponent', () => {
  let component: UnisexPastRunsComponent;
  let fixture: ComponentFixture<UnisexPastRunsComponent>;

  beforeEach(async(() => {
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
