import React from 'react';
import Player from './Player';
import './Players.css';

export default function Players(props) {
	return (
        <div className="players">
		    <Player src="https://static.bandlab.com/soundbanks/previews/new-wave-kit.ogg" caption="Drums" />
            <Player src="https://static.bandlab.com/soundbanks/previews/synth-organ.ogg" caption="Melody" />    
        </div>
    )
}