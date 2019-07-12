import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromecastComponent } from './chromecast.component';

describe('ChromecastComponent', () => {
  let component: ChromecastComponent;
  let fixture: ComponentFixture<ChromecastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChromecastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChromecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
