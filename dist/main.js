/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../time-divider/src/modules/geometry.js":
/*!***********************************************!*\
  !*** ../time-divider/src/modules/geometry.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Apply a mathematical composition of functions on a point\n * @param {Array<function>} functions\n * @param {object} point as { x, y }\n */\nfunction compose(functions, point) {\n  return functions\n    .reverse()\n    .reduce((acc, item) => item(acc), point)\n}\n\nfunction rotateFromO(angle, {x, y}) {\n  return {\n    x: x * Math.cos(angle) - y * Math.sin(angle),\n    y: x * Math.sin(angle) + y * Math.cos(angle)\n  }\n}\n\nfunction translate({a, b}, {x, y}) {\n  return { x: x + a, y: y + b }\n}\n\nmodule.exports = {\n  compose,\n  rotateFromO,\n  translate,\n}\n\n//# sourceURL=webpack:///../time-divider/src/modules/geometry.js?");

/***/ }),

/***/ "./src/circle/index.js":
/*!*****************************!*\
  !*** ./src/circle/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Circle {\n  constructor ({ x, y }) {\n    this.x = x\n    this.y = y\n    this.r = 4\n  }\n\n  draw () {\n    return createSvgElement('circle', {\n      r: this.r,\n      cx: this.x,\n      cy: this.y,\n      stroke: 'red',\n      fill: 'none'\n    })\n  }\n}\n\nCircle.RADIUS = 4\n\nconst SVG_NS = 'http://www.w3.org/2000/svg'\n\nfunction createSvgElement (tag, attributes) {\n  const svgElt = document.createElementNS(SVG_NS, tag)\n  for (let key in attributes) {\n    svgElt.setAttribute(key, attributes[key])\n  }\n  return svgElt\n}\n\nmodule.exports = Circle\n\n\n//# sourceURL=webpack:///./src/circle/index.js?");

/***/ }),

/***/ "./src/frame/index.js":
/*!****************************!*\
  !*** ./src/frame/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction getFrame (appRoot) {\n  return {\n    xmin: 0,\n    xmax: Number(appRoot.getAttribute('width')),\n    ymin: 0,\n    ymax: Number(appRoot.getAttribute('height'))\n  }\n}\n\nfunction getFrameCenter (frame) {\n  return {\n    x: Math.round((frame.xmax - frame.xmin) / 2),\n    y: Math.round((frame.ymax - frame.ymin) / 2)\n  }\n}\n\nmodule.exports = {\n  getFrame,\n  getFrameCenter\n}\n\n\n//# sourceURL=webpack:///./src/frame/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst Circle = __webpack_require__(/*! ./circle */ \"./src/circle/index.js\")\nconst frame = __webpack_require__(/*! ./frame */ \"./src/frame/index.js\")\nconst geometry = __webpack_require__(/*! ../../time-divider/src/modules/geometry */ \"../time-divider/src/modules/geometry.js\") // TODO make a npm module\n\nconst appRoot = document.querySelector('#svg-circles')\nconst frameInfo = frame.getFrame(appRoot)\nconst point = frame.getFrameCenter(frameInfo)\nconst centers = generate(point, 100)\n\ndraw(centers, appRoot)\n\nfunction draw (centers, appRoot) {\n  let index = 0\n  const interval = setInterval(() => {\n    if (index >= centers.length) {\n      clearInterval(interval)\n      return\n    }\n    const one = new Circle(centers[index])\n    const circle = one.draw()\n    appRoot.appendChild(circle)\n    index++\n  })\n}\n\nfunction generate (origin, number) {\n  const previous = { ...origin }\n  const centers = [ previous ]\n  for (let i = 0; i < number; i++) {\n    const coordinates = getCoordinates(\n      centers[centers.length - 1],\n      2 * Circle.RADIUS,\n      randomAngle())\n    centers.push(coordinates)\n  }\n  return centers\n}\n\nfunction randomAngle () {\n  return 2 * Math.PI * Math.random()\n}\n\n/**\n * Calculate cartesian coordinates of a point defined by the intersection of\n * a circle (defined by a center and a radius) and a segment starting from the circle center\n * and defining an angle (given angle) with X axis.\n * We calculate it by a composition of a translation and a rotation.\n * @param {Object} center {x, y}\n * @param {number} radius radius of a circle\n * @param {number} angle angle defined by X axis and a segment starting from center\n */\nfunction getCoordinates (center, radius, angle) {\n  const translateFrom0 = geometry.translate.bind(null, { a: center.x, b: center.y })\n  const rotateAngle = geometry.rotateFromO.bind(null, angle)\n\n  return geometry.compose([\n    translateFrom0,\n    rotateAngle\n  ], { x: radius, y: 0 })\n}\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });