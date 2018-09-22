'use strict'

function getFrame (appRoot) {
  return {
    xmin: 0,
    xmax: Number(appRoot.getAttribute('width')),
    ymin: 0,
    ymax: Number(appRoot.getAttribute('height'))
  }
}

function getFrameCenter (frame) {
  return {
    x: Math.round((frame.xmax - frame.xmin) / 2),
    y: Math.round((frame.ymax - frame.ymin) / 2)
  }
}

module.exports = {
  getFrame,
  getFrameCenter
}
