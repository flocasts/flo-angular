import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyLoadReadmeComponent } from './lazy-load-readme.component';

describe('LazyLoadReadmeComponent', () => {
  let component: LazyLoadReadmeComponent;
  let fixture: ComponentFixture<LazyLoadReadmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LazyLoadReadmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyLoadReadmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
