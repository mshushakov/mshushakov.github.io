import { Toolbar } from '/js/components/toolbar.js';
import { Description } from '/js/components/description.js';
import { Icons } from '/js/components/icons.js';


const showClasses = () => {
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
					App.changeState(showClass.bind(null, id), 'modal', `#classes/${id}`)
				}
			}

			icons.addEventListener('click', events)
			icons.addEventListener('keypress', events)

			resolve(icons);
		})	
	});
};

const showClass = (id) => { 
	return new Promise((resolve, reject) => { 
		fetch(`${api}/classes/${id}`).then(response => response.json()).then(data => {
			resolve(Description(data));
		})	
	});
};


const api = 'http://www.dnd5eapi.co/api';
const routes = {
	'#classes/$': showClasses,
	'#classes/(\\d+)': showClass,
	default: showClasses 
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
		controller().then(component => {
			if (this.state === 'landing') {
				this.preloader.style.display = 'none';
				this.container.appendChild(Toolbar());
			}

			if (this.component) this.container.removeChild(this.component);
			if (route) history.pushState(null, null, route);
			this.state = state;

			this.component = component;
			this.component.classList.add(`-type-${state}`);
			this.container.appendChild(component);
		});
	}
}

App.init();

