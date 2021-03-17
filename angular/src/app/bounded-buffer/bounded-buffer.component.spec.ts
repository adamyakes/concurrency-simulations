import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoundedBufferComponent } from './bounded-buffer.component';

describe('BoundedBufferComponent', () => {
  let component: BoundedBufferComponent;
  let fixture: ComponentFixture<BoundedBufferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoundedBufferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoundedBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
