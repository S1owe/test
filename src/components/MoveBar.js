import React, { Component } from "react";

import '../styles/MoveBar.scss';

import attackBackground from  '../img/background/attackBackground.png';
import guardBackground from '../img/background/guard.png';

class MoveBar extends Component {
    constructor (props) {
        super (props);
        this.state = {
            castle: false,
            showBtnNextMove: true,
            timerTime: 120, // s
        }
    }

    componentDidMount() {
        this.audioBackground = new Audio('../src/music/lvl.mp3');
        this.audioBackground.load();

        this.playAudio();
        this.timer()
    }

    playAudio() {
        const audioPromise = this.audioBackground.play();
        if (audioPromise !== undefined) {
            audioPromise
                .then(_ => {
                    // autoplay started  
                    this.audioBackground.loop = true;
                    this.audioBackground.play();
                })
                .catch(err => {
                    // catch dom exception
                    console.info(err)
                })
        }
    }

    timerCount = (timer) => {
        let m = Math.floor(timer / 60);
        let s = timer - (m * 60);

        if (m === 0) {
            m = '00'
        } else if (m < 10) {
            m = '0' + m;
        }

        if (s === 0) {
            s = '00'
        } else if (s < 10) {
            s = '0' + s;
        }

        return (m + ':' + s )
    };

    timer = () => {

        let th = this;

        let timer = setInterval(function () {
            if (th.state.timerTime > 0) {
                th.setState({
                    timerTime: th.state.timerTime - 1
                })
            } else {
                clearInterval(timer);

                th.nextMove();
            }


        }, 1000)

    };

    // следующий ход
    // ход противника
    nextMove = () => {
      //  this.audio.load();
     //   this.audio.play();

        this.setState({
            showBtnNextMove: false,
        });

        this.props.handleClickOutsideSetState('', false);

        let th = this;

        let newMass = [];
        let maxSpeed = 0;

        this.props.paramsHero.filter((el) => String(el.HeroNum)[0] === "2").map((opponent, index) => {
            newMass.push(opponent);
            if (opponent.Speed > maxSpeed) {
                maxSpeed = opponent.Speed;
            }
        });
        if (newMass.length > 0) {
            myLoop(newMass[0], 0);
        }

        let setTime = 0;

        function myLoop (opponent, ind) {           //  create a loop function
            setTimeout(function () {

                // opponent - герой ИИ
                let speed = opponent.Speed;
                let iOpponent = null;

                for (let i = 0; i < th.props.paramsHero.length; i++) {
                    if (th.props.paramsHero[i].HeroNum === opponent.HeroNum) {
                        iOpponent = i;
                        break;
                    }
                }

                myLoop2(speed);

                function myLoop2 (speed) {           //  create a loop function
                    setTimeout(function () {

                        let checkForBraik = false;
                        for (let i = -1; i < 2; i++) {
                            for (let j = -1; j < 2; j++) {

                                let masXlenght = th.props.map.length;
                                let masYlenght = th.props.map[0].length;

                                if (((opponent.Position.x + i) >= 0) && ((opponent.Position.x + i) < masXlenght) && ((opponent.Position.y + j) >= 0) && ((opponent.Position.y + j) < masYlenght)) {

                                    let elMass = th.props.map[opponent.Position.x + i][opponent.Position.y + j];

                                    if ((elMass) && (String(elMass)[0] === "1")) {   // если найден герой игрока

                                        let paramsHero = Object.assign([], th.props.paramsHero);
                                        let map = Object.assign([], th.props.map);

                                        let indexMassII = null;

                                        for (let i = 0; i < paramsHero.length; i++) {
                                            if (paramsHero[i].HeroNum === opponent.HeroNum) {
                                                paramsHero[i].Speed = 0;       // задаем парамерт скорости = 0 для ИИ
                                                speed = 0;
                                                indexMassII = i;
                                                break;
                                            }
                                        }

                                        paramsHero.map((hero, j) => {

                                            if (hero.HeroNum === elMass) {  //герой игрока, которого атакуют

                                                let checkKill = false;
                                                let hp = null;

                                                if (opponent.Damage > hero.Protected) {
                                                    let coef = (opponent.Damage - hero.Protected) * 5;

                                                    if (coef > 400) {
                                                        coef = 400;
                                                    }

                                                    let percentCount = Math.floor((opponent.Damage * coef) / 100);

                                                    hp = hero.Health - (opponent.Damage + percentCount);

                                                } else if (opponent.Damage < hero.Protected) {
                                                    let coef = (hero.Protected - opponent.Damage) * 2.5;
                                                    if (coef > 70) {
                                                        coef = 70;
                                                    }

                                                    let percentCount = Math.floor((opponent.Damage * coef) / 100);

                                                    hp = hero.Health - (opponent.Damage - percentCount);
                                                } else {
                                                    hp = hero.Health - opponent.Damage;
                                                }

                                                // убиваем героя ИИ и переходим на его место
                                                if (hp <= 0) {
                                                    checkKill = true;
                                                    // переходим на место игрока (героя)
                                                    map[paramsHero[indexMassII].Position.x][paramsHero[indexMassII].Position.y] = 0;
                                                    map[paramsHero[j].Position.x][paramsHero[j].Position.y] = opponent.HeroNum;
                                                    
                                                } else {
                                                    hero.Health = hp
                                                }

                                                th.props.animationHeroSetState(opponent.HeroNum, 'attack');

                                                // убиваем героя игрока и переходим на его место
                                                if (!checkKill) {
                                                    th.props.nextMoveSetState(paramsHero, map);
                                                } else {

                                                    setTimeout(function () {

                                                        paramsHero[indexMassII].Position = paramsHero[j].Position;
                                                        paramsHero[j].HeroNum = -1;
                                                        paramsHero[j].Texture = "";
                                                        paramsHero[j].Position = {x: -1, y: -1};

                                                        th.props.animationHeroSetState(opponent.HeroNum, 'move');
                                                        th.props.nextMoveSetState(paramsHero, map);

                                                    }, 450)
                                                }



                                            }
                                        });

                                      //  th.props.nextMoveSetState(paramsHero, map);

                                        checkForBraik = true;
                                        break;

                                    }
                                }

                            }

                            if (checkForBraik) {
                                break;
                            }
                        }

                        // если ИИ рядом не нашел героя игрока
                        if (!checkForBraik) {

                            let paramsHero = Object.assign([], th.props.paramsHero);
                            let map = Object.assign([], th.props.map);

                            let position = {};
                            let hp = Infinity;

                            for (let i = 0; i < th.props.paramsHero.length; i++) {  // находим героя игрока с мин. hp
                                if ((th.props.paramsHero[i].Health < hp) && (String(th.props.paramsHero[i].HeroNum)[0] === "1"))  {
                                    hp = th.props.paramsHero[i].Health;
                                    position = th.props.paramsHero[i].Position; // запоминаем его индекс нахождения в массиве
                                }
                            }

                            let koef_pos_x = position.x - opponent.Position.x;
                            let koef_pos_y = position.y - opponent.Position.y;

                            if (koef_pos_x < -1) {
                                koef_pos_x = -1
                            } else if (koef_pos_x > 1) {
                                koef_pos_x = 1
                            }

                            if (koef_pos_y < -1) {
                                koef_pos_y = -1
                            } else if (koef_pos_y > 1) {
                                koef_pos_y = 1
                            }

                            let new_pos_x = opponent.Position.x + koef_pos_x;
                            let new_pos_y = opponent.Position.y + koef_pos_y;

                            // если данная клетка поля свободна
                            if (th.props.map[new_pos_x][new_pos_y] === 0) {

                                map[new_pos_x][new_pos_y] = opponent.HeroNum;
                                map[opponent.Position.x][opponent.Position.y] = 0;

                                paramsHero[iOpponent].Position = {x: new_pos_x, y: new_pos_y};
                                paramsHero[iOpponent].Speed -= 1;
                                speed -= 1;

                            } else {

                                if (koef_pos_x === 0) {  // если занята строка таблицы
                                    for (let r = -1; r < 2; r = r + 2) {  // -1 // 1
                                        if (th.props.map[opponent.Position.x + r][new_pos_y] === 0) {
                                            map[opponent.Position.x + r][new_pos_y] = opponent.HeroNum;
                                            map[opponent.Position.x][opponent.Position.y] = 0;

                                            paramsHero[iOpponent].Position = {x: opponent.Position.x + r, y: new_pos_y};

                                            break;
                                        }
                                    }
                                } else if (koef_pos_y === 0) {  // если занят столбец табл.
                                    for (let r = -1; r < 2; r = r + 2) {  // -1 // 1
                                        if (th.props.map[new_pos_x][opponent.Position.y + r] === 0) {
                                            map[new_pos_x][opponent.Position.y + r] = opponent.HeroNum;
                                            map[opponent.Position.x][opponent.Position.y] = 0;

                                            paramsHero[iOpponent].Position = {x: new_pos_x, y: opponent.Position.y + r};

                                            break;
                                        }
                                    }
                                } else { // по диагонали

                                    if (th.props.map[new_pos_x][opponent.Position.y] === 0) {

                                        map[new_pos_x][opponent.Position.y] = opponent.HeroNum;
                                        map[opponent.Position.x][opponent.Position.y] = 0;

                                        paramsHero[iOpponent].Position = {x: new_pos_x, y: opponent.Position.y};
                                    } else if (th.props.map[opponent.Position.x][new_pos_y] === 0) {
                                        map[opponent.Position.x][new_pos_y] = opponent.HeroNum;
                                        map[opponent.Position.x][opponent.Position.y] = 0;

                                        paramsHero[iOpponent].Position = {x: opponent.Position.x, y: new_pos_y};
                                    }


                                }
                                // delete
                                paramsHero[iOpponent].Speed -= 1;
                                speed -= 1;
                            }
                            th.props.animationHeroSetState(opponent.HeroNum, 'move');
                            th.props.nextMoveSetState(paramsHero, map);

                        }

                        if (speed > 0) {
                            myLoop2(speed);
                            setTime += 500;
                        }

                    }, 500)}

                if (newMass[ind + 1]) {
                    myLoop(newMass[ind + 1], ind + 1);
                } else {
                    setTimeout(() => {
                        // восстановление очков перемещения

                        let paramsHero = Object.assign([], th.props.paramsHero);

                        paramsHero.map((hero, j) => {
                            hero.Speed = hero.startSpeed
                        });

                        th.props.nextMoveSetState(paramsHero, 'default');

                        th.setState({
                            showBtnNextMove: true,
                            timerTime: 120, // s
                        });
                        
                        th.timer();

                    }, ((maxSpeed * 500) + 500))
                }


            }, setTime)}



    };

    castleBuild = () => {

        this.setState({
           castle: true,
        });

        this.props.abilityCastle(true);
    };

    render() {
        const {styleInfoHeroBg, choice_hero, paramsChoiceHero} = this.props;

        const attack_background = {
            backgroundImage: `url(${attackBackground})`,
        };

        const guard_background = {
            backgroundImage: `url(${guardBackground})`,
        };

        return (
            <div className="info_container">
                <div className="info_btn_container">
                    {(this.state.showBtnNextMove) &&
                        <div className={'info_btn_cont'}>
                            <div className="btn_Move" onClick={() => this.nextMove()}>Следующий ход</div>

                            <div className="timer_container">
                                {this.timerCount(this.state.timerTime)}
                            </div>
                        </div>
                    }

                </div>

                {(choice_hero !== null) &&
                <div className="info_hero_container">
                    <div className="info_hero_logo" style={styleInfoHeroBg}>

                    </div>
                    <div className="info_hero_params_container">
                        <div className="info_hero_params_row">
                            <div className="info_hero_params">
                                <div className={"info_hero_params_text"}>Защита:</div> {paramsChoiceHero.Protected}</div>
                            <div className="info_hero_params">
                                <div className={"info_hero_params_text"}>Урон:</div> {paramsChoiceHero.Damage}</div>
                        </div>
                        <div className="info_hero_params_row">
                            <div className="info_hero_params">
                                <div className={"info_hero_params_text"}>Здоровье:</div> {paramsChoiceHero.Health}</div>
                            <div className="info_hero_params">
                                <div className={"info_hero_params_text"}>Скорость:</div> {paramsChoiceHero.Speed}</div>
                        </div>
                    </div>

                    {(String(choice_hero)[0] === "1") &&
                    <div className={"move_btn_container"}>

                        {(String(choice_hero).slice(0, 2) === "12") && (!this.state.castle) &&  <div className={"btn_component"} onClick={() => this.castleBuild()}>
                            <div className="attack_btn" style={guard_background}>

                            </div>
                        </div>}

                        <div className={"btn_component"} onClick={() => this.props.attackMove()}>
                            <div className="attack_btn" style={attack_background}>

                            </div>
                        </div>
                    </div>
                    }
                </div>
                }

            </div>
        );
    }
}

export default MoveBar;