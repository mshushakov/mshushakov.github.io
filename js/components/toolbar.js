import { create, createIcon } from '/js/tools.js';

const icons = {
	'menu': createIcon('svg', { viewBox: '0 0 24 24'},
		createIcon('path', { d: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z', fill: 'currentColor'})
	),
	'back': ''
}

export function Toolbar(props) {
	const element = (
		create('div', { className: 'toolbar' },
			create('div', { className: 'toolbar_icons' }, 
				icons.menu
			),
			create('div', { className: 'toolbar_title', textContent: 'Dungeons & Dragons' })
		)
	);

	return element;
}
