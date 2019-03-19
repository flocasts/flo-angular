import { FloViewportManagerService } from './panel.service'
import { TestBed } from '@angular/core/testing'

interface TestType {
  readonly name: string
}

const getSut = () => TestBed.get(FloViewportManagerService) as FloViewportManagerService<TestType>

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

  it('should show count', () => {
    const sut = getSut()
    sut.add({ name: 'John' })
    sut.add({ name: 'Adam' })

    sut.showCount(1)
    sut.items$.subscribe(res => expect(res.length).toEqual(2))
    sut.viewItems$.subscribe(res => expect(res.length).toEqual(1))
  })

  it('should add defined', () => {
    const sut = getSut()
    sut.add({ name: 'John' })

    sut.items$.subscribe(res => {
      expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
    })
  })

  it('should add undefined', () => {
    const sut = getSut()
    sut.add()

    sut.items$.subscribe(res => {
      expect(res[0].valueOrUndefined()).toEqual(undefined)
    })
  })

  it('should set with index', () => {
    const sut = getSut()

    sut.add({ name: 'John' })
    sut.add({ name: 'Adam' })
    sut.set({ name: 'Brody' }, 0)

    sut.items$.subscribe(res => {
      expect(res.length).toEqual(2)
      expect(res[0].valueOrUndefined()).toEqual({ name: 'Brody' })
      expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
    })
  })

  it('should set without index', () => {
    const sut = getSut()

    sut.add({ name: 'John' })
    sut.add({ name: 'Adam' })
    sut.set({ name: 'Brody' })

    sut.items$.subscribe(res => {
      expect(res.length).toEqual(3)
      expect(res[0].valueOrUndefined()).toEqual({ name: 'John' })
      expect(res[1].valueOrUndefined()).toEqual({ name: 'Adam' })
      expect(res[2].valueOrUndefined()).toEqual({ name: 'Brody' })
    })
  })

  it('should swap', () => {
    expect(() => getSut().swap()).toThrow()
  })
})
