const create = (tag, props, ...children) => {
	const element = document.createElement(tag);
	if (props) Object.keys(props).forEach(prop => element[prop] = props[prop])
	if (children) children.forEach(child => element.appendChild(child));
	return element;
}

const asyncrender = (url, render, fail) => {
	const element = create('div', { className: 'fragment' });

	fetch(url)
		.then(response => {
			if (!response.ok) { fail(response); };
			return response.json();
		})
		.then(data => {
			element.classList.add('-loaded');
			element.appendChild(render(data));
		})
		.catch(e => {
			throw new Error(e);
		});

	return element;
}

export { create, asyncrender }