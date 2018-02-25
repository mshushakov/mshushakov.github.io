import React from 'react';
import Player from './Player';
import './Players.css';

const samples = (
    <React.Fragment>
        <Player src="https://static.bandlab.com/soundbanks/previews/new-wave-kit.ogg" caption="Drums" />
        <Player src="https://static.bandlab.com/soundbanks/previews/synth-organ.ogg" caption="Melody" />
    </React.Fragment>
)

const sequencer = (
    <React.Fragment>
        <Player src="/audio/shaker.wav" caption="Shaker" sync="120/4" />
        <Player src="/audio/drums.wav" caption="Drums" sync="120/8" />
        <Player src="/audio/bass.wav" caption="Bass" gain=".6" sync="120/16" />
        <Player src="/audio/chords.wav" caption="Chords" gain=".6" sync="120/16" />
        <Player src="/audio/lead.wav" caption="Lead"  gain=".7" sync="120/16" />
        <Player src="/audio/synth.wav" caption="Synth" gain=".6" sync="120/16" />
        <Player src="/audio/synth2.wav" caption="Synth" gain=".2" sync="120/16" />
    </React.Fragment>
)

export default function Players(props) {
	return (
        <div className="players">
            { props.sequencer ? sequencer : samples }
        </div>
    )
}