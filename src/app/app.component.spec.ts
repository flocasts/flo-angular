import { TestBed, async } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { SwUpdate } from '@angular/service-worker'
import { of, EMPTY } from 'rxjs'
import { WINDOW } from '@flosportsinc/ng-services'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
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
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('FloSports Angular')
  }))
  it('should trigger app reload when PWA files update', async(() => {
    TestBed.resetTestingModule()
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
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
            available: of(1)
          }
        }
      ]
    }).compileComponents()
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    // fixture.componentInstance
    // fixture.componentInstance.
    // expect(compiled.querySelector('h1').textContent).toContain('FloSports Angular')
  }))
})
