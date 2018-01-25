import { create, asyncrender } from '/js/tools.js';
import { Icon } from '/js/components/icons.js';


const extract = (items) => {
	return items.map(item => {
		return (item.from) ? extract(item.from) : item.name.replace('Skill: ', '')
	}).join(', ')
};

function Equipment(props) {
	const elements = [];
	const format = (name, quantity) => name += (quantity > 1) ? ' (' + quantity + ')' : '';
	const equipments = props.starting_equipment.map(equipment => format(equipment.item.name, equipment.quantity)).join(', ');
	
	for (let i = 1; i <= props.choices_to_make; i++) {
		const choice = props['choice_' + i];
		if (!choice) continue;
		const options = choice.map((choices, index) => {
			const oneFrom = (choices.from.length !== choices.choose) ? 'any from: ' : '';
			const letter = (choice.length > 1) ? `(${String.fromCharCode(97 + index)}) ` : '';
			return letter + oneFrom + choices.from.map(eq => format(eq.item.name, eq.quantity)).join(', ');
		});
		elements.push(create('li', { className: 'section_list-item' , textContent: options.join(', or, ') }));
	}

	return create('div', null,  
		create('p', { className: 'section_item' , textContent: equipments }),
		create('div', { textContent: 'Choices to make:' }),
		create('ol', { className: 'section_list' }, ...elements )
	)
}

function Levels(props) {
	return create('table', { className: 'section_table' },
		create('tr', null, 
			create('th', { textContent: 'Level' }),
			create('th', { textContent: 'Bonus' }),
			create('th', { textContent: 'Features' })
		),
		...props.map(data => {
			return create('tr', null, 
				create('td', { textContent: data.level }),
				create('td', { textContent: '+' + data.prof_bonus }),
				create('td', { textContent: data.features.map(feature => feature.name).join(', ') || '-' })
			)
		})
	)
}

function Subclasses(props) {
	return create('div', { className: 'section_list' },
		create('h3', { className: 'section_subtitle', textContent: props.name }),
		create('div', { textContent: 'Flavor: ' + props.subclass_flavor }),
		create('p', { textContent: props.desc })
	)
}

function Spellcasting(props) {
	return create('div', { className: 'section_list' },
		...props.info.map(data => {
			return create('div', null, 
				create('h3', { className: 'section_subtitle',  textContent: data.name }),
				create('div', { textContent: data.desc })
			)
		})
	)
}

function Description(props) {
	props.image = props.image || Icon({ image: `/symbols/${props.name.toLowerCase()}.jpg` });

	const choices = props.proficiency_choices.map(choices => {
		const list = extract(choices.from);

		return create('p', { 
			className: 'section_list',
			textContent: `Choose ${choices.choose} from: ` + list
		})
	});

	const element = (
		create('div', { className: 'content' },
			create('div', { className: 'content_header' },
				create('div', { className: 'content_header-icon' }, props.image),
				create('div', { className: 'content_header-caption' }, 
					create('h1', { className: 'content_header-title', textContent: props.name }),
					create('div', { textContent: `Hit Die: ${props.hit_die}` })
				)
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Proficiencies' }),
				create('p', { className: 'section_list', textContent: props.proficiencies.map(p => p.name).join(', ') }),
				create('h2', { className: 'section_title', textContent: 'Skills' }),
				...choices,
				create('h2', { className: 'section_title', textContent: 'Saving Throws' }),
				create('p', { className: 'section_list' , textContent: extract(props.saving_throws) })
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Starting Equipment' }),
				asyncrender( props.starting_equipment.url, Equipment )
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Levels' }),
				asyncrender( props.class_levels.url.toLowerCase(), Levels )
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Subclasses' }),
				...props.subclasses.map(subclass => asyncrender(subclass.url, Subclasses))
			),
			// create('section', { className: 'section' },
			// 	create('h2', { className: 'section_title', textContent: 'Spellcasting' }),
			// 	asyncrender( props.spellcasting.url.toLowerCase(), Spellcasting )
			// ),
		)
	);

	return element;
}

export { Description as ClassDescription }
