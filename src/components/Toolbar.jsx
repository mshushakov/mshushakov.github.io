import React from 'react';
import { Link } from 'react-router-dom';
import './Toolbar.css';

export default function Toolbar(props) {
	return (
        <header className="toolbar">
            <div className="toolbar_content">
                <h1 className="toolbar_caption">{ props.caption }</h1>
                <div className="toolbar_navigation">
                    <Link to='/posts'>News</Link>
                    <Link to='/samples'>Samples</Link>
                    <Link to='/sequencer'>Sequencer</Link>
                </div>
            </div>
        </header>
    )
}