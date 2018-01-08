import { Toolbar } from '/js/components/toolbar.js';
import { Description } from '/js/components/description.js';
import { Icons } from '/js/components/icons.js';


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
};


const api = 'http://www.dnd5eapi.co/api';
const routes = {
	'#classes/$': Controllers.showClasses,
	'#classes/(\\d+)': Controllers.showClass,
	default: Controllers.showClasses 
}

const router = () => {
	const hash = document.location.hash;

	for (const route in routes) {
		const params = hash.match(new RegExp(route));
		if (!params) continue;
		params.shift(); //first item of `match` is router string
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
		this.changeState(router());
		window.addEventListener('hashchange', () => this.changeState(router()))
	},

	changeState(controller, state = 'page', route = null) {
		this.prevState = this.state;
		this.state = state;
		console.log(this.prevState, this.state);
		
		if (this.prevState === 'landing') {
			this.container.appendChild(Toolbar());
		}
		else {
			this.preloader.classList.add('-preloader');	
			this.preloader.classList.remove('-hide');
		}
		
		controller().then(component => {
			this.preloader.classList.add('-hide');
			if (this.component) this.container.removeChild(this.component);
			if (route) history.pushState(null, null, route);

			this.component = component;
			this.component.classList.add(`-type-${state}`);
			this.container.appendChild(component);
		});
	}
}

App.init();

