import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadwriteComponent } from './readwrite.component';

describe('ReadwriteComponent', () => {
  let component: ReadwriteComponent;
  let fixture: ComponentFixture<ReadwriteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadwriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadwriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
