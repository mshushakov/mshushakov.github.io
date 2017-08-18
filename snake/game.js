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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* exports provided: SVGShapes, SVGStage */
/* exports used: SVGStage, SVGShapes */
/*!************************!*\
  !*** ./classes/svg.js ***!
  \************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
// Simple Library for creating figures on SVG
// Version: 1.0

class SVGShapes {
    static createCircle([x, y], r) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("cx", x || 0);
        circle.setAttribute("cy", y || 0);
        circle.setAttribute("r", r);

        return circle;
    }

    static createPolyline(...points) {
        if (points.length < 2) throw new ReferenceError('Should be at least 2 points for Polyline');

        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute("points", points.map(point => point.join(' ')).join(','));

        return polyline;
    }

    static createPolygon(...points) {
        if (points.length < 3) throw new ReferenceError('Should be at least 3 points for Polygon');

        var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute("points", points.map(point => point.join(',')).join(' '));

        return polygon;
    }

    static createParallelogram(...points) {
        if (points.length !== 3) throw new ReferenceError('Should be 3 points for Parallelogram');

        points.push([points[0][0] + (points[2][0] - points[1][0]), points[0][1] + (points[2][1] - points[1][1])]);

        return this.createPolygon(...points);
    }

    static createGroup(...elements) {
        var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        elements.forEach(element => {
            group.appendChild(element);
        });

        return group;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SVGShapes;
;

class SVGStage {
    constructor(svg) {
        this.svg = svg;
        this.shapes = new Map();
    }

    add(shape) {
        this.shapes.set(shape, shape);
        this.svg.appendChild(shape);
    }

    remove(shape) {
        this.shapes.delete(shape);
        this.svg.removeChild(shape);;
    }

    localX(globalX) {
        return globalX - this.svg.getBoundingClientRect().left;
    }

    localY(globalY) {
        return globalY - this.svg.getBoundingClientRect().top;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SVGStage;


/***/ }),
/* 1 */
/* no static exports found */
/* all exports used */
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_svg__ = __webpack_require__(/*! svg */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_matrix__ = __webpack_require__(/*! matrix */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_snake__ = __webpack_require__(/*! snake */ 3);




Array.prototype.head = function () {
	return this[this.length - 1].concat();
};

const svg = document.querySelector('.game');
const stage = new __WEBPACK_IMPORTED_MODULE_0_svg__["a" /* SVGStage */](svg);
let speed = 200;
const delay = parseInt(1000 / speed);
const dimensions = [20, 20];
svg.setAttribute('viewBox', `0 0 ${dimensions.map(d => d * 10).join(' ')}`);

const matrix = new __WEBPACK_IMPORTED_MODULE_1_matrix__["a" /* default */](stage, dimensions);
const snakes = [
	/*new Snake([[0,19],[1,19],[2,19]], matrix, '#f50'),
 new Snake([[0,15],[1,15],[2,15]], matrix, '#0f0'),
 new Snake([[0,10],[1,10],[2,10]], matrix, '#00f'),
 new Snake([[0,5],[1,5],[2,5]], matrix, '#aaa'),*/
];
const snake = new __WEBPACK_IMPORTED_MODULE_2_snake__["a" /* default */]([[0, 0], [1, 0], [2, 0]], matrix);

(function (delay) {
	let timer = delay;
	let direction = 0;
	let nextdirection = 0;

	const step = () => {
		timer--;
		if (!timer) {
			direction = nextdirection;
			snake.move(direction);
			//snakes.forEach(snake => snake.move(snake.direction));
			timer = delay;
		}
		window.requestAnimationFrame(step);
	};
	window.requestAnimationFrame(step);

	window.addEventListener('keyup', e => {
		switch (e.key) {
			case 'ArrowRight':
				if (direction !== 1) nextdirection = 0;
				break;
			case 'ArrowLeft':
				if (direction !== 0) nextdirection = 1;
				break;
			case 'ArrowDown':
				if (direction !== 3) nextdirection = 2;
				break;
			case 'ArrowUp':
				if (direction !== 2) nextdirection = 3;
				break;
		}
	});

	let _touchStartPointX, _touchStartPointY, _touchStartTime, _touchDeltaX, _touchDeltaY;

	svg.addEventListener('touchstart', e => {
		_touchStartPointX = e.touches[0].pageX;
		_touchStartPointY = e.touches[0].pageY;
		_touchStartTime = Date.now();
	});

	svg.addEventListener('touchmove', e => {
		_touchDeltaX = _touchStartPointX - e.touches[0].pageX;
		_touchDeltaY = _touchStartPointY - e.touches[0].pageY;
	});

	svg.addEventListener('touchend', e => {
		if (Date.now() - _touchStartTime < 1000) {
			if (Math.abs(_touchDeltaX) > Math.abs(_touchDeltaY)) {
				if (direction !== 1 && _touchDeltaX < 100) nextdirection = 0;
				if (direction !== 0 && _touchDeltaX > 100) nextdirection = 1;
			}

			if (Math.abs(_touchDeltaY) > Math.abs(_touchDeltaX)) {
				if (direction !== 3 && _touchDeltaY < 100) nextdirection = 2;
				if (direction !== 2 && _touchDeltaY > 100) nextdirection = 3;
			}
		}
	});
})(delay);

let random = [0, 0];

setInterval(() => {
	if (matrix.is('-bonus', random)) return;
	random = [parseInt(Math.random() * 20), parseInt(Math.random() * 20)];
	if (!matrix.is('-active', random)) {
		matrix.matrix[random[0]][random[1]].classList.add('-bonus');
	}
	speed += 10;
}, 5000);

/*const socket = new WebSocket('ws://localhost:8000');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({ type: 'add', points: [parseInt(Math.random() * 20), parseInt(Math.random() * 20)] }));
});

// Listen for messages
socket.addEventListener('message', function (event) {
    const state = JSON.parse(event.data);
    if (!document.querySelector('ul')) { document.body.appendChild(document.createElement('ul')) }
    const ul = document.querySelector('ul');
	ul.style.position = 'absolute';
	ul.style.top = '0';
	ul.style.left= '0';
	ul.innerHTML = state.map(user => `<li style="color: ${user.color}">${user.id}</li>`).join('');

	state.forEach(user => {
		matrix.on(user.color, ...user.points);
	});
});

// Close connection
window.onbeforeunload = function() {
    //socket.onclose = function () {}; // disable onclose handler first
    socket.close()
};*/

/***/ }),
/* 2 */
/* exports provided: default */
/* exports used: default */
/*!***************************!*\
  !*** ./classes/matrix.js ***!
  \***************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_svg__ = __webpack_require__(/*! svg */ 0);


class Matrix {
	constructor(stage, dimensions = [10, 10]) {
		this.matrix = [];
		this.dimensions = dimensions;
		for (let x = 0; x < this.dimensions[0]; x++) {
			this.matrix[x] = [];
			for (let y = 0; y < this.dimensions[1]; y++) {
				this.matrix[x][y] = this.createDot(x, y);
				stage.add(this.matrix[x][y]);
			}
		}
	}

	createDot(x, y) {
		return __WEBPACK_IMPORTED_MODULE_0_svg__["b" /* SVGShapes */].createParallelogram([x * 10, y * 10], [x * 10 + 8, y * 10], [x * 10 + 8, y * 10 + 8]);
		//return SVGShapes.createCircle([x * 10 + 5, y * 10 + 5], 4);
	}

	is(type, ...points) {
		return points.every(point => this.matrix[point[0]][point[1]].classList.contains(type));
	}

	on(color, ...points) {
		points.forEach(point => {
			this.matrix[point[0]][point[1]].classList.add('-active');
			this.matrix[point[0]][point[1]].style.color = color;
		});
	}

	off(...points) {
		points.forEach(point => {
			this.matrix[point[0]][point[1]].classList.remove('-active');
			this.matrix[point[0]][point[1]].style.fill = '';
		});
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Matrix;


/***/ }),
/* 3 */
/* exports provided: default */
/* exports used: default */
/*!**************************!*\
  !*** ./classes/snake.js ***!
  \**************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Snake {
	constructor(points, matrix, color = '#333') {
		this.points = points;
		this.matrix = matrix;
		this.color = color;
		this.died = false;
		matrix.on(this.color, ...points);
	}

	next(direction) {
		const random = Math.floor(Math.random() * 4);
		const head = this.points.head();
		const points = [head[0] + 1 >= this.matrix.dimensions[0] ? [0, head[1]] : [head[0] + 1, head[1]], // right
		head[0] - 1 < 0 ? [this.matrix.dimensions[0] - 1, head[1]] : [head[0] - 1, head[1]], // left
		head[1] + 1 >= this.matrix.dimensions[1] ? [head[0], 0] : [head[0], head[1] + 1], // down
		head[1] - 1 < 0 ? [head[0], this.matrix.dimensions[1] - 1] : [head[0], head[1] - 1]];

		if (direction > -1 && !this.matrix.is('-active', points[direction])) return points[direction];
		if (direction > -1 && this.matrix.is('-active', points[direction])) return null;

		if (this.matrix.is('-active', ...points)) return null;
		if (this.matrix.is('-active', points[random])) return this.next();
		return points[random];
	}

	move(direction) {
		if (!this.points.length || this.died) return;

		const head = this.next(direction);
		if (!head) {
			this.die();
			return;
		}
		if (!this.matrix.is('-bonus', head)) {
			this.matrix.off(this.points.shift());
		} else {
			this.matrix.matrix[head[0]][head[1]].classList.remove('-bonus');
		}

		this.points.push(head);
		this.matrix.on(this.color, head);
	}

	die() {
		this.died = true;
		/*this.matrix.off(this.points);
  this.points = [];*/
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Snake;


/***/ }),
/* 4 */
/* no static exports found */
/* all exports used */
/*!**********************!*\
  !*** multi ./app.js ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app.js */1);


/***/ })
/******/ ]);