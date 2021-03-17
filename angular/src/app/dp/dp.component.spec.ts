import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpComponent } from './dp.component';

describe('DpComponent', () => {
  let component: DpComponent;
  let fixture: ComponentFixture<DpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
