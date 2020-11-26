import React, { Component } from "react";

import '../styles/Hero.scss';

import peasant1 from '../img/hero/peasant/peasant1.png';
import droft1 from '../img/hero/droft/droft1.png';
import wolf1 from '../img/hero/wolf/wolf1.png';
import hoblin1 from '../img/hero/hoblin/hoblin1.png';

import guardBackground from '../img/background/guard2.png';


class Hero extends Component {
    constructor (props) {
        super (props);
        this.state = {
            styleMap: {
                backgroundImage: null,
                zIndex: null
            },
            timeAttack: 150,
            timeMove: 100,
            guard: false, // находится ли данный игрок под защитой
            guardCount: 5, // +5 к защите
            checkFirstUpdateGuard: 0,
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);

        switch (this.props.item.Texture) {
            case 'peasant':
                this.setState({
                    styleMap: {
                        backgroundImage: `url(${peasant1})`,
                        zIndex: 1
                    }
                });
                break;
            case 'droft':
                this.setState({
                    styleMap: {
                        backgroundImage: `url(${droft1})`,
                        zIndex: 1
                    }
                });
                break;
            case 'wolf':
                this.setState({
                    styleMap: {
                        backgroundImage: `url(${wolf1})`,
                        zIndex: 1
                    }
                });
                break;
            case 'hoblin':
                this.setState({
                    styleMap: {
                        backgroundImage: `url(${hoblin1})`,
                        zIndex: 1
                    }
                });
                break;
        }
    };

    componentWillReceiveProps (nextProps) {

        if ((this.props.animationHero.HeroNum !== nextProps.animationHero.HeroNum) && (this.props.item.HeroNum === nextProps.animationHero.HeroNum)) {

            this.animHero(nextProps.animationHero.move);
            this.props.animationHeroSetState(null, '');
        }

        /*if (this.props.paramsHero !== nextProps.paramsHero) {

            let checkKing = false;
            for (let i = 0; i < this.props.paramsHero.length; i++) {
                if ((String(this.props.paramsHero[i].HeroNum).slice(0,2)) === '12') {

                    checkKing = true;
                    break;
                }
            }

            if (!checkKing) {
                this.setState({
                    guard: false,
                });
            }
        }*/

        // watch отслеживание построения крепости
        if ((this.state.checkFirstUpdateGuard < 2) && (String(this.props.item.HeroNum).slice(0, 1) === '1') && (this.props.ability.castle.show === true)) {
            let guard = false;
            if (this.state.checkFirstUpdateGuard === 1) {

                let pos = this.props.ability.castle.Position;

                if ((this.props.item.Position.x >= (pos.x - 1)) && (this.props.item.Position.x <= (pos.x + 1)) && (this.props.item.Position.y >= (pos.y - 1)) && (this.props.item.Position.y <= (pos.y + 1))) {        //guard
                    
                    guard = true;

                    let paramsHero = Object.assign([], this.props.paramsHero);
                    let map = Object.assign([], this.props.map);

                    for (let i = 0; i < paramsHero.length; i++) {
                        if (paramsHero[i].HeroNum === this.props.item.HeroNum) {

                            paramsHero[i].Protected += this.state.guardCount;
                            break;
                        }
                    }

                    this.props.heroPlayerMoveSetState(paramsHero, map, null, false);
                }
            }

            this.setState({
                guard: guard,
                checkFirstUpdateGuard: this.state.checkFirstUpdateGuard + 1,
            });

        }
    }

    guardFunc = () => {
       
        let th = this;

        let pos = th.props.ability.castle.Position;
        let x = th.props.item.Position.x;
        let y = th.props.item.Position.y;

        let paramsHero = Object.assign([], th.props.paramsHero);

        for (let item of paramsHero) {
            if (item.HeroNum === th.props.item.HeroNum) {

                if ((x >= (pos.x - 1)) && (x <= (pos.x + 1)) && (y >= (pos.y - 1)) && (y <= (pos.y + 1)) && (String(th.props.item.HeroNum).slice(0, 1) === '1')) {        //guard

                    if (!th.state.guard) {

                        th.setState({
                            guard: true,
                        });
                        item.Protected += th.state.guardCount;
                    }

                } else if (th.state.guard) {

                    th.setState({
                        guard: false,
                    });

                    item.Protected -= th.state.guardCount;
                }
                th.props.heroPlayerMoveSetState(paramsHero, th.props.map, null, false);

                break;
            }

        }

    };

    animHero = (move) => {
        let th = this;

        if (move === 'attack') {
            let styleMap = Object.assign([], this.state.styleMap);
            let i = 0;

            let background = this.props.backgroundHero;
            console.log(background);
            

            let interval = setInterval(function () {

                if (i < background.attack.length) {
                    styleMap.backgroundImage = `url(${background.attack[i]})`;
                    i++;
                } else {
                    i = 0;
                    clearInterval(interval);
                    styleMap.backgroundImage = `url(${background.default})`;
                }

                th.setState({
                    styleMap: styleMap
                });
                styleMap = Object.assign([], th.state.styleMap);

            }, this.state.timeAttack);
        } else if (move === 'move') {
            let styleMap = Object.assign([], this.state.styleMap);
            let i = 0;
            let allCount = 0;

            let background = this.props.backgroundHero;

            let intervalMove = setInterval(function () {


                if (allCount < 5) {
                    allCount++;
                    styleMap.backgroundImage = `url(${background.move[i]})`;

                    if (i < (background.move.length-1)) {
                        i++;
                    } else {
                        i = 0;
                    }

                } else {
                    clearInterval(intervalMove);
                    styleMap.backgroundImage = `url(${background.default})`;

                    th.guardFunc();
                }

                th.setState({
                    styleMap: styleMap
                });
                styleMap = Object.assign([], th.state.styleMap);

            }, this.state.timeMove);

        }

    };

    handleClickOutside = (event) => {
        let checkInfoContainer = false;

        for (let i = 0; i < event.path.length; i++) {
            if (event.path[i].className === 'info_container') {
                checkInfoContainer = true;
                break;
            }
        }

        let className = event.target.className;
        this.props.handleClickOutsideSetState(className, checkInfoContainer);
    };

    // задаем позицию
    positionHero = (position) => {
        return {
            top: (position.x * 100) + 'px',
            left: (position.y * 100) + 'px',
        }
    };

    checkPlaceII = (item, positionChoiceHero) => {

        if ((String(item.HeroNum)[0] === "2") && ((item.Position.x >= (positionChoiceHero.x - 1)) && (item.Position.x <= (positionChoiceHero.x + 1))) && (((item.Position.y >= (positionChoiceHero.y - 1)) && (item.Position.y <= (positionChoiceHero.y + 1))))) {
            return true
        } else {
            return false
        }

    };

    // атака игроком героя компьютера
    heroPlayerAttack = (event) => {
        
        let elemClick = document.getElementById(event.target.id).getBoundingClientRect();
        let rectMap = document.getElementById('map').getBoundingClientRect();

        let x = (elemClick.top - rectMap.top) / 100;
        let y = (elemClick.left - rectMap.left) / 100;

        let indexOpponent = null;
        let indexPlayer = null;

        let paramsHero = Object.assign([], this.props.paramsHero);
        let map = Object.assign([], this.props.map);

        for (let i = 0; i < this.props.paramsHero.length; i++) {
            if ((this.props.paramsHero[i].Position.x === x) && (this.props.paramsHero[i].Position.y === y)) {
                indexOpponent = i;
                break;
            }
        }

        for (let i = 0; i < this.props.paramsHero.length; i++) {
            if (this.props.paramsHero[i].HeroNum === this.props.paramsChoiceHero.HeroNum) {
                indexPlayer = i;
                break;
            }
        }

        let heroII = this.props.paramsHero[indexOpponent];
        let heroPlayer = this.props.paramsChoiceHero;

        let checkKill = false;
        let hp = null;

        if (heroPlayer.Damage > heroII.Protected) {
            let coef = (heroPlayer.Damage - heroII.Protected) * 5;

            if (coef > 400) {
                coef = 400;
            }

            let percentCount = Math.floor((heroPlayer.Damage * coef) / 100);

            hp = heroII.Health - (heroPlayer.Damage + percentCount);

        } else if (heroPlayer.Damage < heroII.Protected) {
            let coef = (heroII.Protected - heroPlayer.Damage) * 2.5;
            if (coef > 70) {
                coef = 70;
            }

            let percentCount = Math.floor((heroPlayer.Damage * coef) / 100);

            hp = heroII.Health - (heroPlayer.Damage - percentCount);
        } else {
            hp= heroII.Health - heroPlayer.Damage;
        }

        // убиваем героя ИИ и переходим на его место
        if (hp <= 0) {
            checkKill = true;

           /*
            let pos = this.props.ability.castle.Position;

            if ((paramsHero[indexPlayer].Position.x >= (pos.x - 1)) && (paramsHero[indexPlayer].Position.x <= (pos.x + 1)) && (paramsHero[indexPlayer].Position.y >= (pos.y - 1)) && (paramsHero[indexPlayer].Position.y <= (pos.y + 1))) {        //guard

                if (!this.state.guard) {
                    console.log('сработало 2');

                    this.setState({
                        guard: true,
                    });
                    paramsHero[indexPlayer].Protected += this.state.guardCount;
                }

            } else if (this.state.guard) {
                this.setState({
                    guard: false,
                });

                paramsHero[indexPlayer].Protected -= this.state.guardCount;
            }   */

        } else {
            paramsHero[indexOpponent].Health = hp
        }

        this.props.animationHeroSetState(heroPlayer.HeroNum, 'attack');

        paramsHero[indexPlayer].Speed = 0;
        console.log('0');

        if (!checkKill) {
            this.props.heroPlayerAttackSetState(paramsHero, map, false);
        } else {
            let th = this;
            let time = this.props.backgroundHero.attack.length + 1;

            setTimeout(function () {
                paramsHero[indexOpponent].Health = hp;
                // переходим на место игрока (героя)
                map[heroPlayer.Position.x][heroPlayer.Position.y] = 0;
                map[heroII.Position.x][heroII.Position.y] = heroPlayer.HeroNum;

                paramsHero[indexPlayer].Position = heroII.Position;
                paramsHero[indexOpponent].HeroNum = -1;
                paramsHero[indexOpponent].Texture = "";
                paramsHero[indexOpponent].Position = {x: -1, y: -1};

                th.props.animationHeroSetState(heroPlayer.HeroNum, 'move');
                th.props.heroPlayerAttackSetState(paramsHero, map, false);

            }, time * this.state.timeAttack)
        }

        this.props.handleClickOutsideSetState('', false);
    };

    // сетка с доступными шагами
    divGridMove(num, speed, attack) {
        const divEl = [];

        if (attack && (Number(String(num)[0]) === 2)) {   // кликнули на btn атаки

            divEl.push(
                <div
                    key={'gridMode_' + 0}
                    className={'gridMode gridMode_opponents'}
                />);
            divEl.push(
                <div
                    key={'gridMode_' + 1}
                    className={'gridMode gridMode_opponentsUp'}
                    id={'gridMode_attack_' + num}
                    onClick={() => {
                        this.heroPlayerAttack(event)
                    }}
                />)

        } else if ((Number(String(num)[0]) === 2) || (speed <= 0)) {  // если выбрали героя противника или осталось 0 ходов
            divEl.push(
                <div
                    key={'gridMode_' + 1}
                    className={'gridMode'}
                    id={'gridMode_4'}
                    onClick={() => {
                        this.heroPlayerMove(event)
                    }}
                />)
        } else {   // если выбран игрок игрока

            for (let i = 0; i < 9; i++) {
                divEl.push(
                    <div
                        key={'gridMode_' + i}
                        className={'gridMode'}
                        id={'gridMode_' + i}
                        onClick={() => {
                            this.heroPlayerMove(event)
                        }}
                    />)
            }

           /* divEl.push(
                <div
                    key={'castleMode'}
                    className={'castleMode'}
                    id={'castleMode_' + 0}
                    style={{backgroundImage:`url(${wall})`}}
                />)*/
        }

        return divEl
    };

    // ход игрока
    heroPlayerMove = (event) => {
        let elemClick = document.getElementById(event.target.id).getBoundingClientRect();
        let rectMap = document.getElementById('map').getBoundingClientRect();

        let x = (elemClick.top - rectMap.top) / 100;
        let y = (elemClick.left - rectMap.left) / 100;

        let paramsHero = Object.assign([], this.props.paramsHero);
        let map = Object.assign([], this.props.map);

        for (let item of paramsHero) {
            if (item.HeroNum === this.props.choice_hero) {
                map[item.Position.x][item.Position.y] = 0;
                map[x][y] = item.HeroNum;

                item.Position = {x: x, y: y};
                item.Speed -= 1;
               /*
                let pos = this.props.ability.castle.Position;

                if ((x >= (pos.x - 1)) && (x <= (pos.x + 1)) && (y >= (pos.y - 1)) && (y <= (pos.y + 1))) {        //guard
                   if (!this.state.guard) {
                       console.log('сработало 3');

                       this.setState({
                           guard: true,
                       });
                       item.Protected += this.state.guardCount;
                   }

                } else if (this.state.guard) {
                    this.setState({
                        guard: false,
                    });

                    item.Protected -= this.state.guardCount;
                }
                      */
                break;
            }
        }

        this.props.animationHeroSetState(this.props.item.HeroNum, 'move');

        this.props.heroPlayerMoveSetState(paramsHero, map, null, false);
    };

    render() {
        const {item, choice_hero, hero_choice, paramsHero, attack, paramsChoiceHero} = this.props;

        return (
                <div
                    className={(choice_hero === item.HeroNum) ? 'hero' : 'hero blockGridContainer_zIndex'}
                    style={this.positionHero(item.Position)}
                >
                    <div
                        className={'heroBlock'}
                        onClick={()=> hero_choice(item)}
                    >
                        <div className={"hero_component " + ((item.Texture === "")?('hero_add_back'):('')) } style={this.state.styleMap}>
                            {(item.Texture !== "") && <div className={'hero_component_health'}>{item.Health}</div>
                            }

                            {(item.Texture !== "") && (this.state.guard) &&
                                <div className={'hero_component_guard_cont'}>
                                    <div style={{backgroundImage:`url(${guardBackground})`}} className={'hero_component_guard'} />
                                </div>

                            }
                        </div>
                    </div>
                    <div className={'blockGridContainer '}>
                        {
                            ((choice_hero === item.HeroNum) || (attack && this.checkPlaceII(item, paramsChoiceHero.Position))) && this.divGridMove(item.HeroNum, item.Speed, attack)
                        }
                    </div>

                </div>

        );
    }
}

export default Hero;