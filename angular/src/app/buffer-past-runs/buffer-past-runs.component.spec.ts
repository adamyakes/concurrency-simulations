import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferPastRunsComponent } from './buffer-past-runs.component';

describe('BufferPastRunsComponent', () => {
  let component: BufferPastRunsComponent;
  let fixture: ComponentFixture<BufferPastRunsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferPastRunsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferPastRunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
