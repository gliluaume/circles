'use strict'

/**
 * Take an union of intervals (an array of array of two elements)
 * See union of interval as a continuous single interval
 * For a given number in [0, 1] give a matching value in one of the intervals
 * intervals:
 *
 * 0  a    b    c   d  e       f
 *    ------    -----  ---------
 *
 * seen as single interval: comptacted interval
 *
 * 0  b-a b-a+c-d  b-a+c-d+f-e
 * |    |    |        |
 * --------------------
 *
 * Restrictions on interval collection:
 *  * are ordered
 *  * do not have intersection
 * If some intervals have an intersection, unnormalized value returned will be from the last interval
 */
function unionUnNormalize (intervals, normalizedValue) {
  const workIntervals = (typeof intervals[0] === 'number')
    ? [intervals]
    : intervals

  const totalLength = workIntervals.reduce((acc, interval) => {
    return acc + (interval[1] - interval[0])
  }, 0)
  console.log('workIntervals', workIntervals)
  // make compacted intervals
  const compactedIntervals = [[0, workIntervals[0][1] - workIntervals[0][0]]]
  for (let i = 1; i < workIntervals.length; i++) {
    const left = compactedIntervals[i - 1][1]
    const len = workIntervals[i][1] - workIntervals[i][0]
    compactedIntervals.push([
      left,
      left + len
    ])
  }

  const relativeValue = normalizedValue * totalLength

  const belongingIntervalIndex = searchBelongingIntervalIndex(relativeValue, compactedIntervals)

  let sumOfBlanksLengthOnLeft = workIntervals[0][0]
  for (let j = 1; j <= belongingIntervalIndex; j++) {
    const blank = workIntervals[j][0] - workIntervals[j - 1][1]
    sumOfBlanksLengthOnLeft = sumOfBlanksLengthOnLeft + blank
  }

  return Number((relativeValue + sumOfBlanksLengthOnLeft).toFixed(4))
}

function searchBelongingIntervalIndex (value, intervals) {
  let intervalIndex = -1
  intervals.forEach((interval, index) => {
    if (belongToInterval(value, interval)) {
      intervalIndex = index
    }
  })
  return intervalIndex
}

function belongToInterval (value, interval) {
  return value >= interval[0] && value <= interval[1]
}

function excludeIntervals (mainInterval, intervalsToExclude) {
  if (intervalsToExclude.length === 0) return [mainInterval]

  const intervalsToExcludeWork = intervalsToExclude.sort((a, b) => a[0] - b[0])
  const intervals = [[mainInterval[0], intervalsToExcludeWork[0][0]]]
  for (let i = 1; i < intervalsToExcludeWork.length; i++) {
    intervals.push([
      intervalsToExcludeWork[i - 1][1],
      intervalsToExcludeWork[i][0]])
  }
  intervals.push([
    intervalsToExcludeWork[intervalsToExcludeWork.length - 1][1],
    mainInterval[1]
  ])

  return intervals.filter((interval) => interval[0] < interval[1])
}

module.exports = {
  unionUnNormalize,
  excludeIntervals
}
