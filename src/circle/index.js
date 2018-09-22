class Circle {
  constructor ({ x, y }) {
    this.x = x
    this.y = y
    this.r = 4
  }

  draw () {
    return createSvgElement('circle', {
      r: this.r,
      cx: this.x,
      cy: this.y,
      stroke: 'red',
      fill: 'none'
    })
  }
}

Circle.RADIUS = 4

const SVG_NS = 'http://www.w3.org/2000/svg'

function createSvgElement (tag, attributes) {
  const svgElt = document.createElementNS(SVG_NS, tag)
  for (let key in attributes) {
    svgElt.setAttribute(key, attributes[key])
  }
  return svgElt
}

module.exports = Circle
