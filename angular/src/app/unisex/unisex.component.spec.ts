import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnisexComponent } from './unisex.component';

describe('UnisexComponent', () => {
  let component: UnisexComponent;
  let fixture: ComponentFixture<UnisexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnisexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnisexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
