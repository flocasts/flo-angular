import { TestBed } from '@angular/core/testing'
import { CookieServerModule } from './cookie.server.module'
import { COOKIE_SERVICE } from '../common/cookie.tokens'
import { ICookieService } from '../common/cookie.interfaces'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { EMPTY } from 'rxjs'

const setupTb = () => {
  TestBed.configureTestingModule({
    imports: [CookieServerModule],
    providers: [
      {
        provide: REQUEST,
        useValue: {
          cookies: {
            cookie1: 'test-value'
          }
        }
      }
    ]
  })
}

describe(CookieServerModule.name, () => {
  beforeEach(setupTb)
  afterEach(() => TestBed.resetTestingModule())

  it('should handle noop functions', () => {
    const sut = TestBed.get(COOKIE_SERVICE) as ICookieService

    expect(sut.remove('')).toEqual(undefined)
    expect(sut.set('', '')).toEqual(undefined)
    expect(sut.targetValueChange('')).toBe(EMPTY)
    expect(sut.valueChange).toBe(EMPTY)
    expect(sut.valueChanges).toBe(EMPTY)
  })

  it('should implement getAll() function', () => {
    const sut = TestBed.get(COOKIE_SERVICE) as ICookieService

    expect(sut.getAll() as any).toEqual({ cookie1: 'test-value' })
  })

  it('should implement get() function', () => {
    const sut = TestBed.get(COOKIE_SERVICE) as ICookieService

    expect(sut.get<string>('cookie1')).toEqual('test-value')
  })
})
