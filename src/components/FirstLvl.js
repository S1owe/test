import React, { Component } from "react";
import Grid from "./Grid";
import Hero from "./Hero";
import MoveBar from "./MoveBar";
import Castle from './ability/Castle';

import '../styles/FirstLvl.scss';
import background from '../img/background/Earth.jpg';

import peasant1 from '../img/hero/peasant/peasant1.png';
import peasantMove1 from '../img/hero/peasant/peasantMove1.png';
import peasantMove2 from '../img/hero/peasant/peasantMove2.png';
import peasantMove3 from '../img/hero/peasant/peasantMove3.png';
import peasantAttack1 from '../img/hero/peasant/peasantAttack1.png';
import peasantAttack2 from '../img/hero/peasant/peasantAttack2.png';

import droft1 from '../img/hero/droft/droft1.png';
import droftMove1 from '../img/hero/droft/droftMove1.png';
import droftMove2 from '../img/hero/droft/droftMove2.png';
import droftMove3 from '../img/hero/droft/droftMove3.png';
import droftAttack1 from '../img/hero/droft/droftAttack1.png';
import droftAttack2 from '../img/hero/droft/droftAttack2.png';
import droftAttack3 from '../img/hero/droft/droftAttack3.png';


import wolf1 from '../img/hero/wolf/wolf1.png';
import wolfMove1 from '../img/hero/wolf/wolfMove1.png';
import wolfMove2 from '../img/hero/wolf/wolfMove2.png';
import wolfMove3 from '../img/hero/wolf/wolfMove3.png';
import wolfAttack1 from '../img/hero/wolf/wolfAttack1.png';
import wolfAttack2 from '../img/hero/wolf/wolfAttack2.png';


import hoblin1 from '../img/hero/hoblin/hoblin1.png';
import hoblinMove1 from '../img/hero/hoblin/hoblinMove1.png';
import hoblinMove2 from '../img/hero/hoblin/hoblinMove2.png';
import hoblinMove3 from '../img/hero/hoblin/hoblinMove3.png';
import hoblinAttack1 from '../img/hero/hoblin/hoblinAttack1.png';
import hoblinAttack2 from '../img/hero/hoblin/hoblinAttack2.png';
import hoblinAttack3 from '../img/hero/hoblin/hoblinAttack3.png';

class FirstLvl extends Component {
    constructor (props) {
        super (props);
        this.state = {

            // 1101, 1102 - peasant  // 1201 - droft
            // 2101, 2102, 2103 - wolf // 2201- hoblin
            map: [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2101],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [1201, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2201],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2102],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2103]
            ],
            paramsHero: [
                {HeroNum: 1101, Texture: "peasant", Protected: 2, Damage: 6, Health: 28, Speed: 1, startSpeed: 1, Position: {x: 1, y: 0}},
                {HeroNum: 1201, Texture: "droft", Protected: 25, Damage: 14, Health: 50, Speed: 2, startSpeed: 2, Position: {x: 3, y: 0}},
                {HeroNum: 2101, Texture: "wolf", Protected: 5, Damage: 8, Health: 20, Speed: 4, startSpeed: 4, Position: {x: 1, y: 11}},
                {HeroNum: 2102, Texture: "wolf", Protected: 5, Damage: 8, Health: 20, Speed: 4, startSpeed: 4, Position: {x: 6, y: 11}},
                {HeroNum: 2103, Texture: "wolf", Protected: 5, Damage: 8, Health: 20, Speed: 4, startSpeed: 4, Position: {x: 5, y: 11}},
                {HeroNum: 2201, Texture: "hoblin", Protected: 14, Damage: 12, Health: 40, Speed: 3, startSpeed: 3, Position: {x: 3, y: 11}},
            ],

            peasant: {
                default: peasant1,
                move: [peasantMove1, peasantMove2, peasantMove3],
                attack: [peasantAttack1, peasantAttack2]
            },

            droft: {
                default: droft1,
                move: [droftMove1, droftMove2, droftMove3],
                attack: [droftAttack1, droftAttack2, droftAttack3]
            },

            wolf: {
                default: wolf1,
                move: [wolfMove1, wolfMove2, wolfMove3],
                attack: [wolfAttack1, wolfAttack2]
            },

            hoblin: {
                default: hoblin1,
                move: [hoblinMove1, hoblinMove2, hoblinMove3],
                attack: [hoblinAttack1, hoblinAttack2, hoblinAttack3]
            },

            animationHero: {
                HeroNum: null,
                move: '',
            },
            attack: false,
            paramsChoiceHero: null,

            choice_hero: null,

            ability: {
                castle: {
                    show: false,
                    Position: {x: -5, y: -5}
                }
            }
        };

    };

    handleClickOutsideSetState = (className, checkInfoContainer) => {
        if ((className !== 'hero_component') && (className !== 'gridMode') && (!checkInfoContainer) && (className !== 'gridMode gridMode_opponentsUp')) {

            this.setState({
                choice_hero: null,
                attack: false,
            })
        } else if (className === 'hero_component') {
            this.setState({
                attack: false,
            })
        }
    };

    // выбор героя
    hero_choice = (item) => {
        this.setState({
            choice_hero: item.HeroNum,
            paramsChoiceHero: item,
        });
    };

    heroPlayerMoveSetState = (paramsHero, map, choice_hero, attack) => {
        this.setState({
            paramsHero: paramsHero,
            map: map,
            choice_hero: choice_hero,
            attack: attack,
        });
    };

    // атака игроком героя компьютера
    heroPlayerAttackSetState = (paramsHero, map, attack) => {
        this.setState({
            paramsHero: paramsHero,
            map: map,
            attack: attack,

        });
    };

    // анимация героя
    animationHeroSetState = (hero, move) => {
        let animationHero = Object.assign([], this.state.animationHero);

        animationHero.HeroNum = hero;
        animationHero.move = move;
        this.setState({
            animationHero
        });
    };


    // следующий ход
    // ход противника
    nextMoveSetState = (paramsHero, map) => {
        if (map === 'default') {
            this.setState({
                paramsHero: paramsHero,
            });
        } else {
            this.setState({
                paramsHero: paramsHero,
                map: map,
            });
        }
    };

    attackMove = () => {     // click on btn атаки

        if (this.state.paramsChoiceHero.Speed > 0) {
            this.setState({
                attack: !this.state.attack
            });
        }
    };

    abilityCastle = (params, position) => {

        if (position) {

            let ability = Object.assign([], this.state.ability);
            ability.castle.Position = position;
            this.setState({
                ability
            });

        } else {

            let ability = Object.assign([], this.state.ability);
            ability.castle.show = params;
            this.setState({
                ability
            });
            
        }
    };

    backgroundHero = (num) => {

        let str = String(num).slice(0, 2);

        if (str === '11') {
            return this.state.peasant
        } else if (str === '12') {
            return this.state.droft
        } else if (str === '21') {
            return this.state.wolf
        } else if (str === '22') {
            return this.state.hoblin
        }

    };

    kingPosition = () => {
        for (let i = 0; i < this.state.paramsHero.length; i++) {
            if ((String(this.state.paramsHero[i].HeroNum).slice(0,2)) === '12') {

                return this.state.paramsHero[i].Position
            }
        }
    };

    render() {

        const styleMap = {
            width: (this.state.map[0].length * 100) +'px',
            height: (this.state.map.length * 100) +'px',
            backgroundImage: `url(${background})`,
        };

        let styleInfoHeroBg;
        if (this.state.paramsChoiceHero) {
            switch (this.state.paramsChoiceHero.Texture) {
                case 'peasant':
                    styleInfoHeroBg = {
                        backgroundImage: `url(${peasant1})`,
                    };
                    break;
                case 'droft':
                    styleInfoHeroBg = {
                        backgroundImage: `url(${droft1})`,
                    };
                    break;
                case 'wolf':
                    styleInfoHeroBg = {
                        backgroundImage: `url(${wolf1})`,
                    };
                    break;
                case 'hoblin':
                    styleInfoHeroBg = {
                        backgroundImage: `url(${hoblin1})`,
                    };
                    break;
            }
        }


        return (
            <div className="level">
                <div className={"game_place"}>
                    <div id="map"
                         style={styleMap}
                    >
                        <Grid
                            mapMass={this.state.map}
                        />


                        {this.state.paramsHero.map((item, index) =>
                                <Hero
                                    key={'hero_' + index}
                                    paramsHero={this.state.paramsHero}
                                    paramsChoiceHero = {this.state.paramsChoiceHero}
                                    item={item}
                                    choice_hero = {this.state.choice_hero}
                                    hero_choice = {this.hero_choice}
                                    attack = {this.state.attack}
                                    map = {this.state.map}
                                    heroPlayerMoveSetState = {this.heroPlayerMoveSetState}
                                    heroPlayerAttackSetState = {this.heroPlayerAttackSetState}
                                    handleClickOutsideSetState = {this.handleClickOutsideSetState}
                                    animationHeroSetState = {this.animationHeroSetState}
                                    animationHero = {this.state.animationHero}
                                    backgroundHero = {this.backgroundHero(item.HeroNum)}
                                    ability = {this.state.ability}
                                />
                            )
                        }

                        {this.state.ability.castle.show && <Castle
                                key={'castle_key_' + 0}
                                position={this.kingPosition}
                                abilityCastle = {this.abilityCastle}
                        />}


                    </div>

                    <MoveBar
                        styleInfoHeroBg = {styleInfoHeroBg}
                        choice_hero = {this.state.choice_hero}
                        paramsChoiceHero = {this.state.paramsChoiceHero}
                        paramsHero = {this.state.paramsHero}
                        map = {this.state.map}
                        nextMoveSetState = {this.nextMoveSetState}
                        attackMove = {this.attackMove}
                        animationHeroSetState = {this.animationHeroSetState}
                        abilityCastle = {this.abilityCastle}
                        handleClickOutsideSetState = {this.handleClickOutsideSetState}
                    />
                </div>
            </div>
        );
    }
}

export default FirstLvl;