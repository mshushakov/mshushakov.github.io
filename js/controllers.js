import { Description } from '/js/components/description.js';
import { Icons } from '/js/components/icons.js';
import { List } from '/js/components/list.js';

const api = 'http://www.dnd5eapi.co/api';
const title = 'Dungeons & Dragons';

const Controllers = {
	showClasses(app) {
		return new Promise((resolve, reject) => { 
			fetch(`${api}/classes`).then(response => response.json()).then(data => {
				const props = data.results.map(item => {
					item.id = item.url.match(/.?(\d+)$/)[1];
					item.url = `#classes/${item.id}`;
					return item;
				});

				app.state.title = title;
				resolve(Icons(props));
			})	
		})
	},

	showClass(id, app) { 
		return new Promise((resolve, reject) => { 
			fetch(`${api}/classes/${id}`).then(response => response.json()).then(data => {
				app.state.title = `${title}: ${data.name}`;
				resolve(Description(data));
			})	
		});
	},

	showMonsters(app) { 
		return new Promise((resolve, reject) => { 
			fetch(`${api}/monsters`).then(response => response.json()).then(data => {
				const props = data.results.map(item => {
					item.id = item.url.match(/.?(\d+)$/)[1];
					item.url = `#monsters/${item.id}`;
					return item;
				});

				app.state.title = `${title}: Monsters`;
				resolve(List(props));
			})	
		});
	},

	showRaces(app) { 
		return new Promise((resolve, reject) => { 
			fetch(`${api}/races`).then(response => response.json()).then(data => {
				const props = data.results.map(item => {
					item.id = item.url.match(/.?(\d+)$/)[1];
					item.url = `#races/${item.id}`;
					return item;
				});

				app.state.title = `${title}: Races`;
				resolve(List(props));
			})	
		});
	},
}

export { Controllers }