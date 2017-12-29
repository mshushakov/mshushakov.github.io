import { SVGShapes, SVGStage } from './svg.js';

const svg = document.querySelector('svg');
const stage = new SVGStage(svg);
const points = [];
const state = { current: 'idle', params: null }

// States
const update = (state1, params1) => {
	const calc4thPoint = (points) => {
		return [
			points[0][0] + (points[2][0] - points[1][0]),
            points[0][1] + (points[2][1] - points[1][1]),
        ]
	}

	const calcCenterPoint = (points) => {
		return [
			points[0][0] + (points[2][0] - points[0][0]) / 2,
			points[0][1] + (points[2][1] - points[0][1]) / 2,
		]
	}

	const calcArea = (points) => {
		const point = calc4thPoint(points);
		const b = Math.sqrt(Math.pow(points[0][0] - points[1][0], 2) + Math.pow(points[0][1] - points[1][1], 2));
	    const h = Math.sqrt(Math.pow(points[0][0] - point[0], 2) + Math.pow(points[0][1] - point[1], 2));
	    return b * h;
	}

	const calcRadius = (points) => {
		return Math.sqrt(calcArea(points) / Math.PI);
	}

	if (state.current === 'add') {
		const [ x, y, r ] = [ stage.localX(state.params.x), stage.localY(state.params.y), state.params.r ];
		
		stage.add(SVGShapes.createCircle(x, y, r));
		points.push([ x, y ]);
		
		if (points.length === 3) {
			stage.add(SVGShapes.createPolygon(...points, calc4thPoint(points)));
			
			const special = SVGShapes.createCircle(...calcCenterPoint(points), calcRadius(points));
			special.classList.add('-special');
			special.title = calcArea(points);
			stage.add(special);
		}

		state.current = 'idle';
	}
}

// Render
const step = () => {
	update();
	window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);

// Events
svg.addEventListener('mousedown', e => {
	console.log(e.target.tagName === 'circle')
	state.current = 'add';
	state.params = { x: e.clientX, y: e.clientY, r: 11 }
});
