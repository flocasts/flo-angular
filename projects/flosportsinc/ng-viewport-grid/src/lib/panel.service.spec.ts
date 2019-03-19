import { FloViewportManagerService } from './panel.service'
import { TestBed } from '@angular/core/testing'

interface TestType {
  readonly name: string
}

const getSut = () => TestBed.get(FloViewportManagerService) as FloViewportManagerService<TestType>
const setupSample = () => {
  const sut = getSut()
  sut.add({ name: 'John' })
  sut.add({ name: 'Adam' })
  sut.set({ name: 'Brody' })
  return sut
}

describe(FloViewportManagerService.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FloViewportManagerService]
    })
  })

  afterEach(() => TestBed.resetTestingModule())

  it('should construct', () => {
    expect(getSut()).toBeDefined()
  })

  it('should start with empty subjects', () => {
    const sut = getSut()
    sut.items$.subscribe(res => expect(res.length).toEqual(0))
    sut.viewItems$.subscribe(res => expect(res.length).toEqual(0))
  })

  describe('should show panel count', () => {
    it('when...', () => {
      const sut = setupSample()

      sut.showCount(1)
      sut.items$.subscribe(res => expect(res.length).toEqual(3))
      sut.viewItems$.subscribe(res => expect(res.length).toEqual(1))
    })

    it('when...', () => {
      const sut = setupSample()

      sut.showCount(4)
      sut.items$.subscribe(res => expect(res.length).toEqual(3))
      sut.viewItems$.subscribe(res => expect(res.length).toEqual(4))
    })
  })

  it('should set with index', () => {
    const sut = setupSample()
    sut.set({ name: 'Devon' }, 0)

    sut.items$.subscribe(res => {
      expect(res.length).toEqual(3)
      expect(res[0].valueOrUndefined()).toEqual({ name: 'Devon' })
      expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
      expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
    })
  })

  // it('should set without index', () => {
  //   const sut = getSut()

  //   sut.set({ name: 'Rainbow' })

  //   sut.items$.subscribe(res => {
  //     expect(res.length).toEqual(3)
  //     expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
  //     expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
  //     expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
  //   })
  // })

  describe('should add', () => {
    it('a defined value', () => {
      const sut = setupSample()

      sut.items$.subscribe(res => {
        expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
      })
    })

    it('an undefined value', () => {
      const sut = getSut()
      sut.add()

      sut.items$.subscribe(res => {
        expect(res[0].valueOrUndefined()).toEqual(undefined)
      })
    })
  })

  describe('should remove values by index', () => {
    it('when index is a negative number (-1)', () => {
      const sut = setupSample()

      sut.removeValueByIndex(-10)

      sut.items$.subscribe(res => {
        expect(res.length).toEqual(3)
        expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
        expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
        expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
      })
    })

    it('when index is 0', () => {
      const sut = setupSample()

      sut.removeValueByIndex(0)

      sut.items$.subscribe(res => {
        expect(res.length).toEqual(3)
        expect(res[0].valueOrUndefined()).toEqual(undefined)
        expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
        expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
      })
    })

    it('when index is nominal', () => {
      const sut = setupSample()

      sut.removeValueByIndex(1)

      sut.items$.subscribe(res => {
        expect(res.length).toEqual(3)
        expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
        expect(res[1].valueOrUndefined()).toEqual(undefined)
        expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
      })
    })

    it('when index is terminal length', () => {
      const sut = setupSample()

      sut.removeValueByIndex(2)

      sut.items$.subscribe(res => {
        expect(res.length).toEqual(3)
        expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
        expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
        expect(res[2].valueOrUndefined()).toEqual(undefined)
      })
    })

    it('when index is out of bounds', () => {
      const sut = setupSample()

      sut.removeValueByIndex(3)

      sut.items$.subscribe(res => {
        expect(res.length).toEqual(3)
        expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
        expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
        expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
      })
    })

    it('when index is NaN', () => {
      const sut = setupSample()

      sut.removeValueByIndex('dfasdfasdf' as any)

      sut.items$.subscribe(res => {
        expect(res.length).toEqual(3)
        expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
        expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
        expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
      })
    })
  })

  it('should remove values by predicate', () => {
    const sut = setupSample()

    sut.removeValueByPredicate(a => a && a.name === 'Brody' || false)

    sut.items$.subscribe(res => {
      expect(res.length).toEqual(3)
      expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
      expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
      expect(res[2].valueOrUndefined()).toEqual(undefined)
    })
  })

  it('should swap panels', () => {
    expect(() => getSut().swap()).toThrow()
  })
})
