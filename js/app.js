import { Toolbar } from '/js/components/toolbar.js';
import { Navigation } from '/js/components/navigation.js';

import { Observable } from '/js/tools.js';
import { Controllers } from '/js/controllers.js';


const state = Observable({ 
	title: 'Dungeons & Dragons',
	viewType: '-type-landing', // current view type [ -landing / -page / -modal ]
	isLoading: true, // for showing preloader
	isNavigationOpened: false, // for showing navigation drawer
})

const routes = {
	'#classes/{0,1}$': Controllers.showClasses,
	'#classes/(\\d+)': Controllers.showClass,
	'#races/{0,1}$': Controllers.showRaces,
	'#races/(\\d+)': Controllers.showRace,
	'#monsters/{0,1}$': Controllers.showMonsters,
	'#monsters/(\\d+)': Controllers.showMonster,
	default: Controllers.showClasses 
}

const router = (route) => {
	const hash = route || document.location.hash;

	for (const route in routes) {
		const params = hash.match(new RegExp(route));
		if (!params) continue;
		params.shift(); //first item of the `match` is the whole url string
		return routes[route].bind(null, ...params);
	}

	return routes['default'];
}

const App = {
	init() {
		this.component = null; // current component on the screen
		this.modal = null; 	// current modal on the screen
		this.state = state; // link to a global state;
		this.container = document.querySelector('.app');
		this.preloader = document.querySelector('.landing');

		this.container.appendChild(Toolbar({ 
			title: state.title, 
			onMenuClick: () => state.isNavigationOpened = true,
			onBackClick: () => {
				(history.state && history.state.prev) ?
					App.changeState(router(history.state.prev), 'page', history.state.prev) :
					App.changeState(router('default'), 'page', '/');
			}
		}));
		this.container.appendChild(Navigation({ 
			isOpened: state.isNavigationOpened,
			onClose: () => state.isNavigationOpened = false,
		}));

		// bind `state.viewType` as a class to the container element
		state.viewType.subscribe(this.container, 'class');
		// bind `state.isLoading` to the preloader element to toggle `show/hide` classes
		state.isLoading.subscribe(this.preloader, 'class', ['-show', '-hide']);

		// show modals for links with [data-url]
		this.container.addEventListener('click', (e) => {
			if (!e.target.dataset.url) return;
			const url = e.target.dataset.url;
			this.changeState(router(url), 'modal', url);
		});

		// add class for animation loaded images
		document.addEventListener('load', (e) => e.target.classList.add('-loaded'), true);

		this.changeState(router());
		window.addEventListener('popstate', () => this.changeState(router()))
	},

	changeState(controller, type = 'page', route = null) {
		state.isLoading = true;
		state.isNavigationOpened = false;
		
		controller(this).then(component => {
			if (this.component) this.container.removeChild(this.component);
			if (route) history.pushState({ prev: location.hash }, state.title, route);
			
			this.component = component;
			this.container.appendChild(component);
			
			state.viewType = `-type-${type}`;
			state.isLoading = false;
		});
	},
}


if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(registration => {
		navigator.serviceWorker.ready.then(() => App.init());
	}, err => {
		console.log('ServiceWorker registration failed: ', err);
	});
}
else {
	App.init();
}



