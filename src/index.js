'use strict'

const Circle = require('./circle')
const frame = require('./frame')
const geometry = require('@gliluaume/geometry')
const { unionUnNormalize, excludeIntervals } = require('./tools')

const appRoot = document.querySelector('#svg-circles')
const frameInfo = frame.getFrame(appRoot)
const point = frame.getFrameCenter(frameInfo)
const centers = generate(point, 1)

draw(centers, appRoot)

function draw (centers, appRoot) {
  let index = 0
  const interval = setInterval(() => {
    if (index >= centers.length) {
      clearInterval(interval)
      return
    }
    (new Circle(centers[index])).draw(appRoot)
    index++
  })
}

function generate (origin, number) {
  const previous = { ...origin }
  const centers = [ previous ]

  for (let i = 0; i < number; i++) {
    console.log('iteration', i)
    const anglesIntervals = searchPossibleAngleIntervals(centers)
    const angle = unionUnNormalize(anglesIntervals, Math.random())
    const newCenter = getCoordinates(
      centers[centers.length - 1],
      2 * Circle.RADIUS,
      angle)
    centers.push(newCenter)
  }

  console.log('centers', centers)

  return centers
}
/**
 * Assume that all possible angles to avoid intersection are in a simple interval
 * This interval is a part of [0, 2*PI[
 * Circle of intersection is a circle of center as last center and radius is 3 x R
 * @param {*} centers
 */
function searchPossibleAngleIntervals (centers) {
  const centersOnCircleOfIntersections = centers.filter((center) => {
    return distance(centers[centers.length - 1], center) < 3 * Circle.RADIUS
  })
  // debug
  ;(new Circle(centers[centers.length - 1], 3 * Circle.RADIUS, 'blue')).draw(appRoot)
  console.log('centersOnCircleOfIntersections', centersOnCircleOfIntersections)

  const masterCenter = centers[centers.length - 1]
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
  const angleOffset = Math.PI / 2
  const intervalsOfImpossiblesAngles = anglesOfIntersections.map((angle) => {
    // return [mod2pi(angle), mod2pi(angle + angleOffset)]
    return [mod2pi(angle - angleOffset), mod2pi(angle + angleOffset)]
  })
  const intervalsOfPossiblesAngles = excludeIntervals([0, 2 * Math.PI], intervalsOfImpossiblesAngles)

  console.log('intervalsOfPossiblesAngles', intervalsOfPossiblesAngles)
  return intervalsOfPossiblesAngles
}

// function isIntersect (candidate, points) {
//   return points.some(point => distance(candidate, point) < 2 * Circle.RADIUS)
// }

// function randomAngle () {
//   return 2 * Math.PI * Math.random()
// }

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
// TODO move into geometry
function distance (a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function mod2pi (angle) {
  return angle % (2 * Math.PI)
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
