import Description from '/js/components/description.js';
import Icon from '/js/components/icon.js';

const showClasses = () => {
	return new Promise((resolve, reject) => { 
		fetch(`${api}/classes`).then(response => response.json()).then(data => {
			const icons = document.createElement('div');
			data.results.forEach((data, index) => {
				const i = Icon({ image: `/symbols/${data.name.toLowerCase()}.jpg`, caption: data.name, url: data.url });
				icons.appendChild(i);
			});

			const events = (e) => {
				if (e.target.classList.contains('icon')) {
					if (e.code && e.code !== 'Enter') return;
					App.changeState(showClass.bind(null, 5), 'modal')
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

export { showClass, showClass }