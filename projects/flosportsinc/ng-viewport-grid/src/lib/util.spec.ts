import { shortGuid } from './util'

describe('Util', () => {
  it('should create short guid', () => {
    expect(shortGuid().length).toEqual(12)
  })
})
