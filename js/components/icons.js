import { create } from '/js/tools.js';
import { Icon } from '/js/components/icon.js';

export function Icons(props) {
	const element = (
		create('div', { className: 'icons' },
			...props.map(data => {
				return Icon({ image: `/symbols/${data.name.toLowerCase()}.jpg`, caption: data.name, url: data.url });
			})
		)
	);

	element.addEventListener('click', props.onClick)
	element.addEventListener('keypress', props.onClick)

	return element;
}