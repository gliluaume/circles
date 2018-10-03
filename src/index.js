'use strict'

const Circle = require('./circle')
const frame = require('./frame')
const geometry = require('@gliluaume/geometry')

const appRoot = document.querySelector('#svg-circles')
const frameInfo = frame.getFrame(appRoot)
const point = frame.getFrameCenter(frameInfo)
const centers = generate(point, 13)

draw(centers, appRoot)

function draw (centers, appRoot) {
  let index = 0
  const interval = setInterval(() => {
    if (index >= centers.length) {
      clearInterval(interval)
      return
    }
    const one = new Circle(centers[index])
    const circle = one.draw()
    appRoot.appendChild(circle)
    index++
  })
}

function generate (origin, number) {
  const previous = { ...origin }
  const centers = [ previous ]
  for (let i = 0; i < number; i++) {
    // Dummy way: repeat random angle until you find a good one
    let candidate = false
    while (!candidate || isIntersect(candidate, centers)) {
      candidate = getCoordinates(
        centers[centers.length - 1],
        2 * Circle.RADIUS,
        randomAngle())
      console.log(i, 'new candidate:', candidate)
    }
    centers.push(candidate)
  }
  return centers
}

function isIntersect (candidate, points) {
  return points.some(point => distance(candidate, point) < 2 * Circle.RADIUS)
}

function randomAngle () {
  return 2 * Math.PI * Math.random()
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

// TODO move into geometry
function distance (a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}
