import { create, createIcon } from '/js/tools.js';

const link = (url, title) => {
	return create('a', { className: 'navigation_link', href: url, textContent: title, id: url.replace('#', '') }, 
		create('div', { className: 'navigation_link-wave' })
	)
}

export function Navigation(props) {
	const element = (
		create('div', { className: 'navigation' },
			create('div', { className: 'navigation_drawer' },
				link('#classes/', 'Classes'),
				link('#monsters/', 'Monsters'),
			)
		)
	);

	return element;
}
