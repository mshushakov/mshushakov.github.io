import React from 'react';
import './Player.css';

const context = new AudioContext();
const proxy = 'https://cors-anywhere.herokuapp.com/';

export default class Player extends React.Component {
	static defaultProps = {
		loop: true,
		autoplay: false,
	}

	constructor(props) {
		super(props);
		this.state = { status: 'idle' };

		this.context = context;
		this.source = null;
		this.buffer = null;
	}

	componentDidMount() {
		this.setState({ status: 'loading' });

		fetch(proxy + this.props.src)
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => context.decodeAudioData(arrayBuffer))
			.then(audioBuffer => {
				this.buffer = audioBuffer;
				if (this.props.autoplay) this.start();
				else this.setState({ status: 'idle' });	
			});
	}

	componentWillUnmount() {
		this.stop();
	}

	start() {
		this.source = context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect(context.destination);
		this.source.loop = true;
		this.source.start();
		this.setState({ status: 'playing' });
	}

	stop() {
		if (!this.source) return;
		this.source.stop();
		this.setState({ status: 'idle' });	
	}

	toggle() {
		if (this.state.status === 'idle') 
			this.start()
		else 
			this.stop()
	}

	render() {
		return (
			<div className="player" status={ this.state.status } onClick={ this.toggle.bind(this) }>
				<div className="player_caption">{ this.props.caption }</div>
				<svg className="player_icon" fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
		    		<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
		    		<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
				<svg className="player_preloader" height="24" viewBox="24 24 48 48">
		            <circle stroke="currentcolor" cx="48" cy="48" r="18"/>
		        </svg>
			</div>
		)
	}
}