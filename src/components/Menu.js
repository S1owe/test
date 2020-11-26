import React, { Component } from "react";
import { Link } from 'react-router-dom';

import '../styles/Menu.scss';

class FirstLvl extends Component {
    constructor (props) {
        super (props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="manu">
                <h1>Menu</h1>
                <Link to={{ pathname: '/first_lvl' }}>Начать</Link>
                <Link to={{ pathname: '/first_lvl' }}>Настройки</Link>
                <Link to={{ pathname: '/first_lvl' }}>Выход</Link>
            </div>
        );
    }
}

export default FirstLvl;