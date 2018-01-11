import { create, createIcon } from '/js/tools.js';

const icons = {
	
}

export function Navigation(props) {
	const element = (
		create('div', { className: 'navigation' },
			create('div', { className: 'navigation_drawer' },
				create('a', { className: 'navigation_link', href: '#classes/', textContent: 'Classes' }),
				create('a', { className: 'navigation_link', href: '#monsters/', textContent: 'Monsters' })
			)
		)
	);

	return element;
}
