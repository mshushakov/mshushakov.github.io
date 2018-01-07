import { create } from '/js/tools.js';

export function Icon(props) {
	const element = (
		create('div', { className: 'icon' },
			create('div', { className: 'icon_thumbnail' }, 
				create('img', { className: 'icon_image', src: props.image }),
				create('div', { className: 'icon_wave' })
			),
			create('div', { className: 'icon_caption', textContent: props.caption })
		)
	);
	
	if (props.id) {
		// add id as data attrubute and make it clickble
		element.dataset.id = props.id;
		element.tabIndex = 0;
	}
	
	return element;
}