import React, { Component } from "react";
import { Link, Route, NavLink, BrowserRouter, Switch, HashRouter } from 'react-router-dom';

import FirstLvl from './FirstLvl';
import Menu from './Menu';

import '../styles/App.scss';

class App extends Component {
    constructor (props) {
        super (props);
        this.state = {

        }
    }

    render() {
        return (
            <HashRouter>
                <div id="menu">
                    <div className="route-place">
                        <Switch>
                            <Route exact path="/" component={Menu} />
                            <Route exact path="/first_lvl" component={FirstLvl} />
                        </Switch>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default App;