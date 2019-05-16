import { swapItemsViaIndices, chunk } from './helpers'

const COLLECTION_1: ReadonlyArray<any> = [{ prop: 1 }, { prop: 2 }, { prop: 3 }]

describe(swapItemsViaIndices.name, () => {
  it('should handle empty collection', () => {
    const sut = swapItemsViaIndices([], 0, 2)

    expect(sut.length).toEqual(0)
    expect(sut[0]).toBeUndefined()
  })

  it('should hanbdle 0 index', () => {
    const sut = swapItemsViaIndices(COLLECTION_1, 0, 2)

    expect(sut.length).toEqual(3)
    expect(sut[0]).toEqual({ prop: 3 })
    expect(sut[2]).toEqual({ prop: 1 })
  })

  it('should hanbdle last index', () => {
    const sut = swapItemsViaIndices(COLLECTION_1, 2, 3)

    expect(sut.length).toEqual(4)
    expect(sut[0]).toEqual({ prop: 1 })
    expect(sut[3]).toEqual({ prop: 3 })
    expect(sut[2]).toBeUndefined()
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
