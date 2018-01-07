import { create } from '/js/tools.js';

export function Toolbar(props) {
	const element = (
		create('div', { className: 'toolbar' },
			create('div', { className: 'toolbar_icons' }),
			create('div', { className: 'toolbar_title', textContent: 'Dungeons & Dragons' }),
			create('div', { className: 'toolbar_icons' }),
		)
	);

	return element;
}