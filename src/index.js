'use strict'

const Circle = require('./circle')
const frame = require('./frame')
const geometry = require('@gliluaume/geometry')
const {
  unionUnNormalize,
  excludeIntervals,
  excludeAngleRegion } = require('./tools')

const appRoot = document.querySelector('#svg-circles')
const frameInfo = frame.getFrame(appRoot)
const point = frame.getFrameCenter(frameInfo)

draw(point, 2000, frameInfo, appRoot)

function draw (origin, number, frameInfo, appRoot, delay = 0) {
  const generator = generate(origin, number, frameInfo)
  const interval = setInterval(() => {
    const center = generator.next().value
    if (!center) {
      clearInterval(interval)
      return
    }
    (new Circle(center)).draw(appRoot)
  }, delay)
}

function * generate (origin, number, frameInfo) {
  const previous = { ...origin }
  const centers = [ previous ]

  for (let i = 0; i < number; i++) {
    console.log('iteration', i, centers.length)
    let refIndex = centers.length - 1
    if (isCloseToFrameEdges(centers[refIndex], frameInfo, 2.5 * Circle.RADIUS)) {
      refIndex = Math.floor(Math.random() * (centers.length - 1))
    }
    // TODO refactor
    let trial = 0
    let anglesIntervals = searchPossibleAngleIntervals(centers, refIndex)
    while (anglesIntervals === -1) {
      refIndex = Math.floor(Math.random() * (centers.length - 1))
      anglesIntervals = searchPossibleAngleIntervals(centers, refIndex)
      trial++
      if (trial > 10) {
        throw new Error('Not found!')
      }
    }
    if (anglesIntervals === -1) {
      refIndex = Math.floor(Math.random() * (centers.length - 1))
    }

    const angle = unionUnNormalize(anglesIntervals, Math.random())
    const center = getCoordinates(
      centers[refIndex],
      2 * Circle.RADIUS,
      angle)
    centers.push(center)
    yield center
  }
}

/**
 * Assume that all possible angles to avoid intersection are in a simple interval
 * This interval is a part of [0, 2*PI[
 * Circle of intersection is a circle of center as last center and radius is 3 x R
 * @param {*} centers
 */
function searchPossibleAngleIntervals (centers, refIndex = -1) {
  const startIndex = refIndex === -1
    ? centers.length - 1
    : refIndex
  const centersOnCircleOfIntersections = centers.filter((center) => {
    return distance(centers[startIndex], center) < 3 * Circle.RADIUS
  })
  // debug
  // ;(new Circle(centers[startIndex], 3 * Circle.RADIUS, 'blue')).draw(appRoot)
  console.log('centersOnCircleOfIntersections', centersOnCircleOfIntersections)

  const masterCenter = centers[startIndex]
  const anglesOfIntersections = centersOnCircleOfIntersections
    .slice(0, centersOnCircleOfIntersections.length - 1)
    .map((center) => {
      const d = distance(masterCenter, center)
      const sin = (center.y - masterCenter.y) / d
      const cos = (center.x - masterCenter.x) / d
      console.log('cos', cos, 'sin', sin)
      const alpha = Math.acos(cos)
      return sin > 0 ? alpha : 2 * Math.PI - alpha
    })
    .sort()

  console.log('anglesOfIntersections', anglesOfIntersections)
  // TODO comment savoir si l'offset est positif ou négatif ?
  const intervalsOfImpossiblesAngles = anglesOfIntersections.reduce((acc, angle) => {
    const angleOffset = Math.PI / 2
    const intervals = excludeAngleRegion(angle, angleOffset)
    intervals.forEach((interval) => acc.push(interval))
    return acc
  }, [])

  console.log('intervalsOfImpossiblesAngles', intervalsOfImpossiblesAngles)
  const intervalsOfPossiblesAngles = excludeIntervals([0, 2 * Math.PI], intervalsOfImpossiblesAngles)

  if (intervalsOfPossiblesAngles.length === 0) {
    // throw new Error('No angle found!')
    return -1
  }
  console.log('intervalsOfPossiblesAngles', intervalsOfPossiblesAngles)
  return intervalsOfPossiblesAngles
}

/**
 * Calculate cartesian coordinates of a point defined by the intersection of
 * a circle (defined by a center and a radius) and a segment starting from the circle center
 * and defining an angle (given angle) with X axis.
 * We calculate it by a composition of a translation and a rotation.
 * @param {Object} center {x, y}
 * @param {number} radius radius of a circle
 * @param {number} angle angle defined by X axis and a segment starting from center
 */
function getCoordinates (center, radius, angle) {
  const translateFrom0 = geometry.translate.bind(null, { a: center.x, b: center.y })
  const rotateAngle = geometry.rotateFromO.bind(null, angle)

  return geometry.compose([
    translateFrom0,
    rotateAngle
  ], { x: radius, y: 0 })
}

/**************************************************
 * TOOLS TO MOVE
***************************************************/
// TODO move into geometry (?)
function isCloseToFrameEdges (point, frameInfo, margin) {
  return (Math.abs(point.x - frameInfo.xmin) < margin) ||
    (Math.abs(point.x - frameInfo.xmax) < margin) ||
    (Math.abs(point.y - frameInfo.ymin) < margin) ||
    (Math.abs(point.y - frameInfo.ymax) < margin)
}

// TODO move into geometry
function distance (a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

// TODO (re-)move
/**
 * Search a value in an interval by dichotomy
 * @param {*} interval
 * @param {*} fnTest
 */
function searchDicho (interval, fnTest, count) {
  console.log(count, interval)
  let foundValue = (interval[0] + interval[1]) / 2
  while (count < searchDicho.maxIter) {
    if (fnTest(foundValue) > 0) {
      foundValue = searchDicho([interval[0], foundValue], fnTest, ++count)
    } else if (fnTest(foundValue) < 0) {
      foundValue = searchDicho([foundValue, interval[1]], fnTest, ++count)
    }
  }
  return foundValue
}
searchDicho.maxIter = 20
