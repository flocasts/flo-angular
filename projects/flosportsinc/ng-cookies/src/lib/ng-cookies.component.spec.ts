import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCookiesComponent } from './ng-cookies.component';

describe('NgCookiesComponent', () => {
  let component: NgCookiesComponent;
  let fixture: ComponentFixture<NgCookiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCookiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
