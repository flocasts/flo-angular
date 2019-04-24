import { TestBed, async } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { SwUpdate } from '@angular/service-worker'
import { EMPTY, scheduled, asapScheduler } from 'rxjs'
import { WINDOW } from '@flosportsinc/ng-window'
import { SharedTestingModule } from './shared.testing.module'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: WINDOW,
          useValue: {
            location: {
              reload: () => undefined
            }
          }
        },
        {
          provide: SwUpdate,
          useValue: {
            available: EMPTY
          }
        }
      ]
    }).compileComponents()
  }))
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))

  it('should trigger app reload when PWA files update', async(() => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [
        SharedTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: WINDOW,
          useValue: {
            location: {
              reload: () => undefined
            }
          }
        },
        {
          provide: SwUpdate,
          useValue: {
            available: scheduled([1], asapScheduler)
          }
        }
      ]
    }).compileComponents()
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
  }))
})
