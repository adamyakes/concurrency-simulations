import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionPageComponent } from './solution-page.component';

describe('SolutionPageComponent', () => {
  let component: SolutionPageComponent;
  let fixture: ComponentFixture<SolutionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
