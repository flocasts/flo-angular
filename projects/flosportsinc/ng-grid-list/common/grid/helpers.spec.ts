import { swapAtIndex, chunk } from './helpers'

const COLLECTION_1: ReadonlyArray<any> = [{ prop: 1 }, { prop: 2 }, { prop: 3 }]

describe(swapAtIndex.name, () => {
  it('should handle empty collection', () => {
    const sut = swapAtIndex([], 0, { prop: 'NEW' })

    expect(sut.length).toEqual(1)
    expect(sut[0]).toEqual({ prop: 'NEW' })
  })

  it('should hanbdle 0 index', () => {
    const sut = swapAtIndex(COLLECTION_1, 0, { prop: 'NEW' })

    expect(sut.length).toEqual(3)
    expect(sut[0]).toEqual({ prop: 'NEW' })
    expect(sut[2]).toEqual({ prop: 3 })
  })

  it('should hanbdle last index', () => {
    const sut = swapAtIndex(COLLECTION_1, 2, { prop: 'NEW' })

    expect(sut.length).toEqual(3)
    expect(sut[0]).toEqual({ prop: 1 })
    expect(sut[2]).toEqual({ prop: 'NEW' })
  })

  it('should hanbdle last index + 1', () => {
    const sut = swapAtIndex(COLLECTION_1, 3, { prop: 'NEW' })

    expect(sut.length).toEqual(4)
    expect(sut[0]).toEqual({ prop: 1 })
    expect(sut[2]).toEqual({ prop: 3 })
    expect(sut[3]).toEqual({ prop: 'NEW' })
  })
})

describe('chunk utility function', () => {
  it('should work', () => {
    const sut = chunk(1, [{}, {}, {}, {}])
    expect(sut.length).toEqual(4)
  })

  it('should handle empty collection', () => {
    const sut = chunk(2, [{}, {}, {}])
    expect(sut.length).toEqual(2)
  })

  it('should handle empty collection', () => {
    const sut = chunk(1)
    expect(sut.length).toEqual(0)
  })
})
