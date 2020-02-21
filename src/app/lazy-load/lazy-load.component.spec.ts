import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LazyLoadComponent } from './lazy-load.component'
import {FloLazyLoadModule} from '@flosportsinc/ng-lazy-load'
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core'
import {SharedTestingModule} from '../shared.testing.module'

describe('LazyLoadComponent', () => {
  // tslint:disable-next-line:no-let
  let component: LazyLoadComponent
  // tslint:disable-next-line:no-let
  let fixture: ComponentFixture<LazyLoadComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FloLazyLoadModule,
        SharedTestingModule
      ],
      declarations: [ LazyLoadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyLoadComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
