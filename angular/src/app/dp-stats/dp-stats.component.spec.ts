import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpStatsComponent } from './dp-stats.component';

describe('DpStatsComponent', () => {
  let component: DpStatsComponent;
  let fixture: ComponentFixture<DpStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
