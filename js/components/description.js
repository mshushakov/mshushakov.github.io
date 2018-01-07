import { create, asyncrender } from '/js/tools.js';
import { Icon } from '/js/components/icon.js';


const extract = (items) => items.map(item => (item.from) ? extract(item.from) : item.name.replace('Skill: ', '')).join(', ');

function Equipment(props) {
	const equipments = props.starting_equipment.map(equipment => `${equipment.item.name} (${equipment.quantity})`).join(', ')
	return create('p', { className: 'section_list' , textContent: equipments })
}

function Levels(props) {
	return create('table', { className: 'section_table' },
		create('tr', null, 
			create('th', { textContent: 'Level' }),
			create('th', { textContent: 'Bonus' }),
			create('th', { textContent: 'Features' }),
			create('th', { textContent: 'Rages' }),
			create('th', { textContent: 'Damage' })
		),
		...props.map(data => {
			return create('tr', null, 
				create('td', { textContent: data.level }),
				create('td', { textContent: '+2' }),
				create('td', { textContent: data.features.map(feature => feature.name).join(', ') || '-' }),
				create('td', { textContent: '2' }),
				create('td', { textContent: '+2' })
			)	
		})
		
	)
}

export function Description(props) {
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
					create('div', { textContent: `Hit Points: ${props.hit_die}` })
				)
			),
			create('section', { className: 'section' },
				create('h2', { className: 'section_title', textContent: 'Proficiencies' }),
				create('ul', { className: 'section_list' },
					...props.proficiencies.map(proficiency => create('li', { className: 'section_list-item', textContent: proficiency.name }))
				),
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
		)
	);

	return element;
}