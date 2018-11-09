import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HlsReadmeComponent } from './hls-readme.component';

describe('HlsReadmeComponent', () => {
  let component: HlsReadmeComponent;
  let fixture: ComponentFixture<HlsReadmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HlsReadmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HlsReadmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
