import React, { Component } from "react";

import '../styles/Grid.scss';

class Grid extends Component {
    constructor (props) {
        super (props);
        this.state = {

        }

       // this.test = this.test.bind(this);
    };
    
    render() {

        const listGrid = this.props.mapMass.map((item, hindex) => {

            return (
                item.map((item2, windex) => {
                    return <div className="grid_el" key={hindex + "_" + windex} />;

                })
            )
        });


        return (
            <div className="grid_component">
                {listGrid}
            </div>
        );
    }
}

export default Grid;