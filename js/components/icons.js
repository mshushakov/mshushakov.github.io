import { create } from '/js/tools.js';

function Icons(props) {
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

function Icon(props) {
	const element = (
		create('div', { className: 'icon' },
			create('div', { className: 'icon_thumbnail' }, 
				create('img', { className: 'icon_image', src: props.image }),
				create('div', { className: 'icon_wave' })
			),
			create('div', { className: 'icon_caption', textContent: props.caption })
		)
	);
	
	if (props.url) {
		element.dataset.url = props.url;
		element.tabIndex = 0;
	}
	
	return element;
}

export { Icons, Icon }