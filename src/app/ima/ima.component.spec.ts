import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImaComponent } from './ima.component';

describe('ImaComponent', () => {
  let component: ImaComponent;
  let fixture: ComponentFixture<ImaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
