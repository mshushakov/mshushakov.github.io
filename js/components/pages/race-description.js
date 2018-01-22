import { create, asyncrender } from '/js/tools.js';

const extract = (items) => items.map(item => (item.from) ? extract(item.from) : item.name.replace('Skill: ', '')).join(', ');


function Description(props) {
	//console.log(props);
	/*const choices = props.proficiency_choices.map(choices => {
		const list = extract(choices.from);

		return create('p', { 
			className: 'section_list',
			textContent: `Choose ${choices.choose} from: ` + list
		})
	});*/

	const element = (
		create('div', { className: 'content' },
			create('div', { className: 'content_header' },
				create('div', { className: 'content_header-caption' }, 
					create('h1', { className: 'content_header-title', textContent: props.name }),
					create('div', { textContent: `Speed: ${props.speed}` }),
					create('p', { className: 'section_title', textContent: 'Racial Traits' }),
					create('div', { textContent: extract(props.traits) || 'none' }),
				),
				create('div', { className: 'content_header-image' }, 
					create('img', { src: props.image })
				),
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Age' }),
				create('p', { className: 'section_list' , textContent: props.age }),
				create('h2', { className: 'section_title', textContent: `Size: ${props.size}` }),
				create('p', { className: 'section_list' , textContent: props.size_description }),
				create('h2', { className: 'section_title', textContent: 'Alignment' }),
				create('p', { className: 'section_list' , textContent: props.alignment }),
				
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Languages' }),
				create('p', { className: 'section_list' , textContent: props.language_desc }),
			),
		)
	);

	return element;
}

export { Description as RaceDescription }