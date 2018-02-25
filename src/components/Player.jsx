import React from 'react';
import './Player.css';

const context = new AudioContext();
const proxy = 'https://cors-anywhere.herokuapp.com/';

export default class Player extends React.Component {
	static defaultProps = {
		loop: true,
		autoplay: false,
		gain: 0.8,
		sync: null,
	}

	constructor(props) {
		super(props);
		this.state = { status: 'idle' };

		this.context = context;
		this.source = null;
		this.buffer = null;

		this.proxy = this.props.src.match('http') ? proxy : '';
	}

	componentDidMount() {
		this.setState({ status: 'loading' });

		fetch(this.proxy + this.props.src)
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
		const gain = context.createGain();
		const [ bpm, bars ] = this.props.sync ? this.props.sync.split('/') : '';
		const sync = this.props.sync ? 60 / bpm * bars - context.currentTime % (60 / bpm * bars) : 0;
		
		this.source = context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect(gain);
		this.source.loop = this.props.loop;
		this.source.start(context.currentTime + sync);

		gain.connect(context.destination);
		gain.gain.setValueAtTime(this.props.gain, context.currentTime);
		
		this.setState({ status: 'sync' });
		setTimeout(() => this.setState({ status: 'playing' }), sync * 1000)
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