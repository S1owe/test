import React, { Component } from "react";
import wall from '../../img/background/wallAbility.png';

import '../../styles/Castle.scss';

class Castle extends Component{
    constructor(props) {
        super (props);
        this.state = {
            position: {x: null, y: null}
        }

    }

    componentDidMount() {
        let position = Object.assign([], this.state.position);
        position.x = this.props.position().x;
        position.y = this.props.position().y;

        this.setState({
            position
        });

        this.props.abilityCastle(true, {x: position.x, y: position.y});
    }

    render() {

        const style = {
            backgroundImage:`url(${wall})`,
            left: (this.state.position.y * 100) - 120 + 'px',
            top: (this.state.position.x * 100) - 120 + 'px',
        };

        return (
            <div
                className={'castleMode'}
                id={'castleMode_' + 0}
                style={style}
            >

            </div>
        )
    }
    
}

export default Castle