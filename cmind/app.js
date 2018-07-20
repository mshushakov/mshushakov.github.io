// Helpers
const helpers = {
	calc4thPoint: (points) => ({
		x: points[0].x + (points[2].x - points[1].x),
		y: points[0].y + (points[2].y - points[1].y),
	}),
	
	calcCenterPoint: (points) => ({
		x: points[0].x + (points[2].x - points[0].x) / 2,
		y: points[0].y + (points[2].y - points[0].y) / 2,
	}),

	calcArea: (points) => {
		const a = Math.sqrt(Math.pow(points[0].x- points[1].x, 2) + Math.pow(points[0].y - points[1].y, 2));
		const b = Math.sqrt(Math.pow(points[0].x - points[3].x, 2) + Math.pow(points[0].y - points[3].y, 2));
		const c = Math.sqrt(Math.pow(points[1].x - points[3].x, 2) + Math.pow(points[1].y - points[3].y, 2));
		const p = (a + b + c) / 2;

		return 2 * Math.sqrt(p * (p - a) * (p - b) * (p - c));
	},

	calcRadius: (points) => Math.sqrt(helpers.calcArea(points) / Math.PI)
}

const create = (tag, params) => {
	const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
	if (params) Object.keys(params).forEach(key => elem.setAttribute(key, params[key]));
	return elem;
}

const offset = (elem, x, y) => ({
	x: x - elem.getBoundingClientRect().x,
	y: y - elem.getBoundingClientRect().y,
})

// App
const svg = document.querySelector('svg');
const state = {
	isDragging: false,
	points: new Map(),
	hints: new Map(),
	touches: [],
}
const shapes = { // calculated shapes
	polygon: create('polygon'),
	circle: create('circle'),
}

const hint = (elem, { x, y }, caption) => {
	const hint = state.hints.has(elem) ? state.hints.get(elem) : create('text');
	hint.textContent = (caption) ? `${caption}` :`${Math.round(x)}, ${Math.round(y)}`;
	hint.setAttribute('x', x);
	hint.setAttribute('y', y);
	svg.appendChild(hint);
	state.hints.set(elem, hint);
}

const update = () => {
	state.points.forEach((position, element) => {
		element.setAttribute('cx', position.x);
		element.setAttribute('cy', position.y);
		hint(element, position);
	});

	if (state.points.size === 3) {
		const points = Array.from(state.points.values());
		points.push(helpers.calc4thPoint(points));
		
		const center = helpers.calcCenterPoint(points);
		const radius = helpers.calcRadius(points);
		const area = helpers.calcArea(points);
		
		shapes.polygon.setAttribute("points", points.map((point) => point.x + ' ' + point.y).join(','));
		shapes.circle.setAttribute("cx", center.x);
		shapes.circle.setAttribute("cy", center.y);
		shapes.circle.setAttribute("r", radius);
		hint(shapes.circle, center, Math.round(area) + 'sq.pxs');
	}
	
	if (state.isDragging) requestAnimationFrame(update);
}

// Events
const dragStart = (e) => {
	const touch = e.changedTouches && e.changedTouches[0] || e;
	const identifier = touch.identifier || 0;
	const { x, y } = offset(svg, touch.clientX, touch.clientY);
	const point = state.points.has(touch.target) ? touch.target : create('circle', { cx: x, cy: y, r: 11 });

	if (state.points.has(point) || state.points.size < 3) {
		svg.appendChild(point); 
		state.points.set(point, { x, y });
		state.touches[identifier] = point;
	}
	else {
		state.touches[identifier] = null;
	}
	
	state.isDragging = true;

	requestAnimationFrame(update);
}

const dragMove = (e) => {
	if (!state.isDragging) return;
	const touches = e.touches && Array.from(e.touches) || [ e ];
	
	touches.forEach(touch => { 
		const identifier = touch.identifier || 0;
		if (!state.touches[identifier]) return;
		state.points.set(state.touches[identifier], offset(svg, touch.clientX, touch.clientY));
	});
}

const dragStop = (e) => {
	const identifier = e.changedTouches && e.changedTouches[0] || 0;
	state.touches[identifier] = null;
	if (!e.touches || !e.touches.length) state.isDragging = false;
}

svg.addEventListener('mousedown', dragStart);
svg.addEventListener('touchstart', dragStart);

svg.addEventListener('mousemove', dragMove);
svg.addEventListener('touchmove', dragMove);

svg.addEventListener('mouseup', dragStop);
svg.addEventListener('touchend', dragStop);
svg.addEventListener('mouseleave', dragStop);

svg.appendChild(shapes.polygon);
svg.appendChild(shapes.circle);
