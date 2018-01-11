import { create } from '/js/tools.js';

export function List(props) {
	const element = (
		create('div', { className: 'content list' },
			...props.map(data => {
				return create('div', { className: 'list_item',  textContent: data.name })
			})
		)
	);

	return element;
}