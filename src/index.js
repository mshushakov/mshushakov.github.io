import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Toolbar from './components/Toolbar';
import Players from './components/Players';
import Posts from './components/Posts';

import './index.css';

const Samples = () => <Players />
const Sequencer = () => <Players sequencer />

const Root = () => (
    <Router>
        <div>
            <Toolbar caption='BandLab' />
            <Switch>
                <Route exact path='/' component={Posts} />
                <Route exact path='/posts' component={Posts} />
                <Route exact path='/samples' component={Samples} />
                <Route exact path='/sequencer' component={Sequencer} />
            </Switch>
        </div>
    </Router>
)

ReactDOM.render(<Root />, document.querySelector('.root'));
registerServiceWorker();
