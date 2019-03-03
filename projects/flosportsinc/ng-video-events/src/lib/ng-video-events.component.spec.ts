import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgVideoEventsComponent } from './ng-video-events.component';

describe('NgVideoEventsComponent', () => {
  let component: NgVideoEventsComponent;
  let fixture: ComponentFixture<NgVideoEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgVideoEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgVideoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
