'use strict'

const { unionUnNormalize, excludeIntervals } = require('./')

describe('unionUnNormalize', () => {
  it('can un normalize a simple interval', () => {
    const actual = unionUnNormalize([2, 6], 0.5)
    expect(actual).toBe(4)
  })
  it('can un normalize an union of two intervals', () => {
    const actual = unionUnNormalize([[2, 6], [10, 16]], 0.5)
    expect(actual).toBe(11)
  })
  it('can un normalize rational', () => {
    const actual = unionUnNormalize([[0.02, 0.06], [0.10, 0.16]], 0.5)
    expect(actual).toBe(0.11)
  })
})

describe('excludeIntervals', () => {
  it('returns main interval when no interval to exclude', () => {
    const actual = excludeIntervals([0, 10], [])
    expect(actual).toEqual([[0, 10]])
  })
  describe('when one interval to exclude', () => {
    it('returns two intervals when interval to exclude is included in main', () => {
      const actual = excludeIntervals([0, 10], [[2, 4]])
      expect(actual).toEqual([[0, 2], [4, 10]])
    })
    it('returns one interval when interval to exclude is on the left of main', () => {
      const actual = excludeIntervals([0, 10], [[-2, 4]])
      expect(actual).toEqual([[4, 10]])
    })
    it('returns one interval when interval to exclude is on the right of main', () => {
      const actual = excludeIntervals([0, 10], [[4, 11]])
      expect(actual).toEqual([[0, 4]])
    })
  })
  describe('when more than one interval to exclude', () => {
    it('returns three intervals when interval to exclude is included in main', () => {
      const actual = excludeIntervals([0, 10], [[2, 4], [6, 8]])
      expect(actual).toEqual([[0, 2], [4, 6], [8, 10]])
    })
    it('exclude common parts of excluding intervals too', () => {
      const actual = excludeIntervals([0, 10], [[4, 7], [6, 9]])
      expect(actual).toEqual([[0, 4], [9, 10]])
    })
  })
})
