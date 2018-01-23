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
					create('div', { textContent: props.alignment }),
					create('p', { textContent: `Armor Class: ${props.armor_class}` }),
					create('p', { textContent: `Hit Points: ${props.hit_points} (${props.hit_dice})` }),
					create('p', { textContent: `speed: ${props.speed}` }),
				)
			),
		)
	);

	return element;
}

export { Description as MonsterDescription }