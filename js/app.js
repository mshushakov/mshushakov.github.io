import { Toolbar } from '/js/components/toolbar.js';
import { Navigation } from '/js/components/navigation.js';

import { Description } from '/js/components/description.js';
import { Icons } from '/js/components/icons.js';
import { List } from '/js/components/list.js';


const Controllers = {
	showClasses () {
		return new Promise((resolve, reject) => { 
			fetch(`${api}/classes`).then(response => response.json()).then(data => {
				const props = data.results.map(item => {
					item.id = item.url.match(/.?(\d+)$/)[1];
					return item;
				});

				const icons = Icons(props);
				const events = (e) => {
					if (e.target.classList.contains('icon')) {
						if (e.code && e.code !== 'Enter') return;
						const id = e.target.dataset.id;
						App.changeState(Controllers.showClass.bind(null, id), 'modal', `#classes/${id}`)
					}
				}

				icons.addEventListener('click', events)
				icons.addEventListener('keypress', events)

				resolve(icons);
			})	
		})
	},

	showClass(id) { 
		return new Promise((resolve, reject) => { 
			fetch(`${api}/classes/${id}`).then(response => response.json()).then(data => {
				resolve(Description(data));
			})	
		});
	},

	showMonsters() { 
		return new Promise((resolve, reject) => { 
			fetch(`${api}/monsters`).then(response => response.json()).then(data => {
				resolve(List(data.results));
			})	
		});
	}
};


const api = 'http://www.dnd5eapi.co/api';
const routes = {
	'#classes(/{0,1})$': Controllers.showClasses,
	'#classes/(\\d+)': Controllers.showClass,
	'#monsters(/{0,1})$': Controllers.showMonsters,
	default: Controllers.showClasses 
}

const router = () => {
	const hash = document.location.hash;

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
		this.state = 'landing'; // app state: landing or page or modal
		this.component = null; // current component on the screen
		this.container = document.querySelector('.app');
		this.preloader = document.querySelector('.landing');
		this.toolbar = Toolbar({ title: 'Dungeons & Dragons' });
		this.navigation = Navigation();

		//TODO: to think how to manage events inside of a compound
		const events = (e) => {
			if (e.target.classList.contains('-icon-menu')) {
				this.navigation.classList.add('-opened');
			}
			if (e.target.classList.contains('navigation')) {
				this.navigation.classList.remove('-opened');
			}
			if (e.target.classList.contains('navigation_link')) {
				this.navigation.classList.remove('-opened');
			}
			if (e.target.classList.contains('-icon-back')) {
				App.changeState(Controllers.showClasses, 'page', `#classes/`)
			}
		}

		this.toolbar.addEventListener('click', events)
		this.navigation.addEventListener('click', events)
		
		this.changeState(router());
		window.addEventListener('popstate', () => this.changeState(router()))
	},

	changeState(controller, state = 'page', route = null) {
		this.prevState = this.state;
		
		if (this.prevState === 'landing') {
			this.container.appendChild(this.toolbar);
			this.container.appendChild(this.navigation);
			this.container.classList.add(`-type-${this.prevState}`);
		}
		else {
			this.preloader.classList.add('-preloader');	
			this.preloader.classList.remove('-hide');
		}
		
		controller().then(component => {
			this.preloader.classList.add('-hide');
			if (this.component) this.container.removeChild(this.component);
			if (route) history.pushState(null, null, route);

			this.state = state;
			this.component = component;
			this.component.classList.add(`-type-${state}`);
			this.container.appendChild(component);

			this.container.classList.remove(`-type-${this.prevState}`);
			this.container.classList.add(`-type-${this.state}`);
		});
	},
}

App.init();

