class Circle {
  constructor ({ x, y }, radius, color) {
    this.x = x
    this.y = y
    this.r = radius || 4
    this.color = color || 'red'
  }

  draw (svgRoot) {
    const svgElt = createSvgElement('circle', {
      r: this.r,
      cx: this.x,
      cy: this.y,
      stroke: this.color,
      fill: 'none'
    })
    if (svgRoot) svgRoot.appendChild(svgElt)

    return svgElt
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
