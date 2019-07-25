import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchFillComponent } from './fetch-fill.component';

describe('FetchFillComponent', () => {
  let component: FetchFillComponent;
  let fixture: ComponentFixture<FetchFillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchFillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchFillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
