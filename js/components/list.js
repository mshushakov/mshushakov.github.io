import { create } from '/js/tools.js';

const item = (url, title) => {
	const item = create('div', { className: 'list_item' },
		title,
		create('div', { className: 'list_item-wave' }),
	);
	
	if (url) {
		item.dataset.url = url;
		item.tabIndex = 0;
	}
	return item;
}

export function List(props) {
	const element = (
		create('div', { className: 'content list' },
			...props.map(data => item(data.url, data.name))
		)
	);

	return element;
}