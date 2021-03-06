import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Database from '../Database';
import moment from "moment";

const db = new Database();

class ScoreCardScreen extends Component {
    constructor(props) {
        super(props);
        /*let valueRound = props.navigation.dangerouslyGetParent().state.params.round;
        console.log('################################# RONDA ###############################');
        console.log(props.navigation.dangerouslyGetParent().state.params.round);*/
        this.state = {
            member_a: {},
            member_b: {},
            isLoading: true,
            members: [],
            round: null
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'SC Team Nassau',
        };
    };

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.calculeScore();
        });
    }

    async calculeScore() {
        let single = this.props.navigation.getParam('single');
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        let round = await db.roundById(valueRound.id);
        console.log('======================== SINGLE =====================');
        console.log(single);
        console.log('======================== END SINGLE =================');
        let member_a = await db.getMemberByIdWithHoles(single.member_a_id);
        let member_b = await db.getMemberByIdWithHoles(single.member_b_id);
        let member_c = await db.getMemberByIdWithHoles(single.member_c_id);
        let member_d = await db.getMemberByIdWithHoles(single.member_d_id);
        member_a = member_a[0];
        member_a.advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        member_b = member_b[0];
        member_b.advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        member_c = member_c[0];
        member_c.advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        member_d = member_d[0];
        member_d.advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let advStrokesOfPlayers = [0, 0, 0, 0];
        advStrokesOfPlayers[0] = (member_a.handicap - member_c.handicap) + (member_a.handicap - member_d.handicap);
        advStrokesOfPlayers[1] = (member_b.handicap - member_c.handicap) + (member_b.handicap - member_d.handicap);
        advStrokesOfPlayers[2] = (member_c.handicap - member_a.handicap) + (member_c.handicap - member_b.handicap);
        advStrokesOfPlayers[3] = (member_d.handicap - member_a.handicap) + (member_d.handicap - member_b.handicap);
        let promTeam_1 = (member_a.handicap + member_b.handicap) / 2;
        let promTeam_2 = (member_c.handicap + member_d.handicap) / 2;
        let strokes = (advStrokesOfPlayers[0] + advStrokesOfPlayers[1]) / 2;
        switch (single.who_gets_the_adv_strokes) {
            case 'Hi Hcp':
                console.log('======================== TEAM NASSAU HI HCP =====================');
                console.log(advStrokesOfPlayers);
                let maximo = Math.max(...advStrokesOfPlayers);
                console.log('Maximo: ', maximo);
                let maxIndex = advStrokesOfPlayers.indexOf(maximo);
                console.log('Maximo index: ', maxIndex);
                console.log('======================== END TEAM NASSAU HI HCP =================');
                if (maxIndex == 0) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_a.advStrokes = this.distributeAdv(strokes);
                }
                if (maxIndex == 1) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_b.advStrokes = this.distributeAdv(strokes);
                }
                if (maxIndex == 2) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_c.advStrokes = this.distributeAdv(strokes);
                }
                if (maxIndex == 3) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_d.advStrokes = this.distributeAdv(strokes);
                }
                break;
            case 'Low Hcp':
                console.log('======================== TEAM NASSAU LOW HCP =====================');
                console.log(advStrokesOfPlayers);
                let minimo = Math.min(...advStrokesOfPlayers);
                console.log('Minimo: ', minimo);
                let minIndex = advStrokesOfPlayers.indexOf(minimo);
                console.log('Minimo index: ', minIndex);
                console.log('======================== END TEAM NASSAU LOW HCP =================');
                if (minIndex == 0) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_a.advStrokes = this.distributeAdv(strokes);
                }
                if (minIndex == 1) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_b.advStrokes = this.distributeAdv(strokes);
                }
                if (minIndex == 2) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_c.advStrokes = this.distributeAdv(strokes);
                }
                if (minIndex == 3) {
                    if (single.manually_override_adv == 1) {
                        strokes = Math.abs(single.manually_adv_strokes);
                    } else {
                        strokes = Math.abs(single.adv_strokes);
                    }
                    member_d.advStrokes = this.distributeAdv(strokes);
                }
                break;
            case 'Each':
                if(member_a.handicap<=member_b.handicap){
                    if(member_c.handicap<=member_d.handicap){
                        strokes= member_a.handicap - member_c.handicap
                        if(strokes>0){
                            member_a.advStrokes = this.distributeAdv(strokes);
                        }else{
                            member_c.advStrokes = this.distributeAdv(strokes);
                        }
                    }else {
                        strokes = member_a.handicap - member_d.handicap 
                        if (strokes > 0) {
                            member_a.advStrokes = this.distributeAdv(strokes);
                        } else {
                            member_d.advStrokes = this.distributeAdv(strokes);
                        }
                    }
                }else{
                    if (member_c.handicap <= member_d.handicap) {
                        strokes = member_b.handicap - member_c.handicap
                        if (strokes > 0) {
                            member_b.advStrokes = this.distributeAdv(strokes);
                        } else {
                            member_c.advStrokes = this.distributeAdv(strokes);
                        }
                    } else {
                        strokes = member_b.handicap - member_d.handicap
                        if (strokes > 0) {
                            member_b.advStrokes = this.distributeAdv(strokes);
                        } else {
                            member_d.advStrokes = this.distributeAdv(strokes);
                        }
                    }
                }
                
                break;
            case 'Slid Hi':
                if (single.manually_override_adv == 1) {
                    strokes = Math.abs(single.manually_adv_strokes);
                } else {
                    strokes = Math.abs(single.adv_strokes);
                }
                if (promTeam_1 >= promTeam_2) {
                    if (member_a.handicap >= member_b.handicap) {
                        member_a.advStrokes = this.distributeAdv(strokes);
                    } else {
                        member_b.advStrokes = this.distributeAdv(strokes);
                    }
                } else {
                    if (member_c.handicap >= member_d.handicap) {
                        member_c.advStrokes = this.distributeAdv(strokes);
                    } else {
                        member_d.advStrokes = this.distributeAdv(strokes);
                    }
                }
                break;
            case 'Slid Low':
                if (single.manually_override_adv == 1) {
                    strokes = Math.abs(single.manually_adv_strokes);
                } else {
                    strokes = Math.abs(single.adv_strokes);
                }
                if (promTeam_1 <= promTeam_2) {
                    if (member_a.handicap <= member_b.handicap) {
                        member_a.advStrokes = this.distributeAdv(strokes);
                    } else {
                        member_b.advStrokes = this.distributeAdv(strokes);
                    }
                } else {
                    if (member_c.handicap <= member_d.handicap) {
                        member_c.advStrokes = this.distributeAdv(strokes);
                    } else {
                        member_d.advStrokes = this.distributeAdv(strokes);
                    }
                }
                break;
            default:
                break;
        }
        if (round.adv_b9_f9 == 1 && round.starting_hole > 1) {
            member_a.holes = this.swichAdvantage(member_a.holes);
            member_b.holes = this.swichAdvantage(member_b.holes);
            member_c.holes = this.swichAdvantage(member_c.holes);
            member_d.holes = this.swichAdvantage(member_d.holes);
        }
        let aFront9AndBack9 = this.getFront9AndBack9Holes(round.starting_hole, member_a.holes);
        let bFront9AndBack9 = this.getFront9AndBack9Holes(round.starting_hole, member_b.holes);
        let cFront9AndBack9 = this.getFront9AndBack9Holes(round.starting_hole, member_c.holes);
        let dFront9AndBack9 = this.getFront9AndBack9Holes(round.starting_hole, member_d.holes);
        member_a.front9 = aFront9AndBack9.front9;
        member_b.front9 = bFront9AndBack9.front9;
        member_a.back9 = aFront9AndBack9.back9;
        member_b.back9 = bFront9AndBack9.back9;
        member_c.front9 = cFront9AndBack9.front9;
        member_d.front9 = dFront9AndBack9.front9;
        member_c.back9 = cFront9AndBack9.back9;
        member_d.back9 = dFront9AndBack9.back9;
        let front9Presses = this.calculePresses(member_a.front9, member_a.advStrokes, member_b.front9, member_b.advStrokes, member_c.front9, member_c.advStrokes, member_d.front9, member_d.advStrokes, single);
        let back9Presses = this.calculePresses(member_a.back9, member_a.advStrokes, member_b.back9, member_b.advStrokes, member_c.back9, member_c.advStrokes, member_d.back9, member_d.advStrokes, single);
        
        this.setState({
            member_a: member_a,
            member_b: member_b,
            member_c: member_c,
            member_d: member_d,
            round: round,
            front9Presses,
            back9Presses,
            isLoading: false
        });
    }

    swichAdvantage(holes) {
        for (let j = 0; j < holes.length; j++) {
            if (holes[j].adv % 2 == 0) {
                holes[j].adv -= 1;
            } else {
                holes[j].adv += 1;
            }
        }
        return holes;
    }
    getFront9AndBack9Holes(starting_hole, holes) {
        let front9 = [];
        let back9 = [];
        let startIndexFont9 = null;
        let endIndexFont9 = null;
        let startIndexBack9 = null;
        let endIndexBack9 = null;
        if (starting_hole <= 10) {
            if (starting_hole == 10) {
                back9 = holes.slice(0, 9);
                console.log('====================== BACK 9 ===================');
                console.log(back9);
            } else {
                startIndexFont9 = starting_hole - 1;
                console.log('Inicio FRONT 9: ', startIndexFont9);
                endIndexFont9 = startIndexFont9 + 9;
                console.log('Fin FRONT 9: ', endIndexFont9);
                front9 = holes.slice(startIndexFont9, endIndexFont9);
                console.log(front9);
                startIndexBack9 = endIndexFont9;
                console.log('Inicio END 9: ', startIndexBack9);
                endIndexBack9 = 18;
                console.log('Fin FRONT 9: ', endIndexBack9);
                back9 = holes.slice(startIndexBack9, endIndexBack9);
                back9 = back9.concat(holes.slice(0, startIndexFont9));
                console.log(back9);
            }
        } else {
            startIndexFont9 = round.starting_hole - 1;
            console.log('Inicio FRONT 9: ', startIndexFont9);
            front9 = holes.slice(startIndexFont9, 18);
            endIndexFont9 = 9 - front9.length;
            console.log('Fin FRONT 9: ', endIndexFont9);
            front9 = front9.concat(holes.slice(0, endIndexFont9));
            console.log(front9);
            startIndexBack9 = endIndexFont9;
            console.log('Inicio END 9: ', startIndexBack9);
            endIndexBack9 = startIndexBack9 + 9;
            console.log('Fin FRONT 9: ', endIndexBack9);
            back9 = holes.slice(startIndexBack9, endIndexBack9);
            console.log(back9);
        }
        let front9AndBack9Object = {
            front9: front9,
            back9: back9
        }
        return front9AndBack9Object;
    }

    calculePresses(back9_a, advantage_a, back9_b, advantage_b, back9_c, advantage_c, back9_d, advantage_d, single) {
        let back9Presses = [null, null, null, null, null, null, null, null, null];
        let anterior = null;
        let strokes_a = 0;
        let strokes_b = 0;
        let strokes_c=0;
        let strokes_d=0;
        let advIndex = 0;
        let auxPressesArray = [
            [null, null, null, null, null, null, null, null, null],
        ];
        let isOpenPress= false;
        let indexPress = 0;
        for (let index = 0; index < 9; index++) {
            if (back9_a[index].strokes != null) {
                if (anterior == null) {
                    anterior = index
                }
                back9Presses = [null, null, null, null, null, null, null, null, null];
                advIndex = back9_a[index].adv - 1;
                strokes_a = back9_a[index].strokes - advantage_a[advIndex];
                console.log('Hole: ' + back9_b[index].hole_number);
                console.log('=================== STROKES JUGADOR A ===============');
                console.log(' -Golpes total: ' + strokes_a);
                advIndex = back9_b[index].adv - 1;
                strokes_b = back9_b[index].strokes - advantage_b[advIndex];
                console.log('=================== STROKES JUGADOR B ===============');
                console.log(' -Golpes total: ' + strokes_b);
                advIndex = back9_c[index].adv - 1;
                strokes_c = back9_c[index].strokes - advantage_c[advIndex];
                console.log('=================== STROKES JUGADOR C ===============');
                console.log(' -Golpes total: ' + strokes_c);
                advIndex = back9_d[index].adv - 1;
                strokes_d = back9_d[index].strokes - advantage_d[advIndex];
                console.log('=================== STROKES JUGADOR D ===============');
                console.log(' -Golpes total: ' + strokes_d);
                let minTeamOne= null;
                let minTeamTwo= null;
                let maxTeamOne= null;
                let maxTeamTwo= null;
                let auxAntValor=null;
                //Mayor y menor de los equipos
                if(strokes_a<=strokes_b){
                    minTeamOne=strokes_a;
                    maxTeamOne=strokes_b;
                }else{
                    minTeamOne = strokes_b;
                    maxTeamOne = strokes_a;
                }
                if(strokes_c<=strokes_d){
                    minTeamTwo = strokes_c;
                    maxTeamTwo = strokes_d;
                }else {
                    minTeamTwo = strokes_d;
                    maxTeamTwo = strokes_c;
                }

                    if (minTeamOne < minTeamTwo) {
                        for (let j = 0; j <= indexPress; j++) {
                            auxPressesArray[j][index] = auxPressesArray[j][anterior] + 1;
                            console.log('Gana min team 1 Valor:  ' + auxPressesArray[j][anterior] + ' nuevo valor: ' + auxPressesArray[j][index]);
                        }
                    } else if (minTeamTwo < minTeamOne) {
                        for (let j = 0; j <= indexPress; j++) {
                            auxPressesArray[j][index] = auxPressesArray[j][anterior] - 1;
                            console.log('pierde min team 1 Valor:  ' + auxPressesArray[j][anterior] + ' nuevo valor: ' + auxPressesArray[j][index]);
                        }
                    } else {
                        for (let j = 0; j <= indexPress; j++) {
                            auxPressesArray[j][index] = auxPressesArray[j][anterior] ;
                            console.log('Empatan min Valor:  ' + auxPressesArray[j][anterior] + ' nuevo valor: ' + auxPressesArray[j][index]);
                        }
                    }

                    if (auxPressesArray[indexPress][index] != 0 && (auxPressesArray[indexPress][index]) % single.automatic_press_every == 0) {
                        console.log('========================== Se abre presion ========================');
                        indexPress += 1;
                        isOpenPress=true;
                        back9Presses[index] = 0;
                        auxPressesArray.push(back9Presses);
                    }

                    if (maxTeamOne < maxTeamTwo) {
                        if(isOpenPress==true){
                            for (let j = 0; j <= indexPress - 1; j++) {
                                auxAntValor = auxPressesArray[j][index];
                                auxPressesArray[j][index] = auxPressesArray[j][index] + 1;
                                console.log('SUMA 1 Gana max team 1 Valor:  ' + auxAntValor + ' nuevo valor: ' + auxPressesArray[j][index]);
                            }
                        }else {
                            for (let j = 0; j <= indexPress; j++) {
                                auxPressesArray[j][index] = auxPressesArray[j][index] + 1;
                                console.log('Gana max team 1 Valor:  ' + auxPressesArray[j][index] + ' nuevo valor: ' + auxPressesArray[j][index]);
                            }
                        }
                    } else if (maxTeamTwo < maxTeamOne) {
                        if (isOpenPress == true) {
                            for (let j = 0; j <= indexPress - 1; j++) {
                                auxAntValor = auxPressesArray[j][index];
                                auxPressesArray[j][index] = auxPressesArray[j][index] - 1;
                                console.log(' Resta 1 pierde max team 1 Valor:  ' + auxAntValor + ' nuevo valor: ' + auxPressesArray[j][index]);
                                
                            }
                        } else {
                            for (let j = 0; j <= indexPress; j++) {
                                auxAntValor = auxPressesArray[j][index];
                                auxPressesArray[j][index] = auxPressesArray[j][index] - 1;
                                console.log(' Resta 1 pierde max team 1 Valor:  ' + auxAntValor + ' nuevo valor: ' + auxPressesArray[j][index]);
                            }
                        }
                    } else {
                        if (isOpenPress == true) {
                            for (let j = 0; j <= indexPress - 1; j++) {
                                auxPressesArray[j][index] = auxPressesArray[j][index];
                                console.log('Empatan max Valor:  ' + auxPressesArray[j][index] + ' nuevo valor: ' + auxPressesArray[j][index]);
                            }
                        } else {
                            for (let j = 0; j <= indexPress; j++) {
                                auxPressesArray[j][index] = auxPressesArray[j][index];
                                console.log('Empatan max Valor:  ' + auxPressesArray[j][index] + ' nuevo valor: ' + auxPressesArray[j][index]);
                            }
                        }
                    }
                    console.log('Valor del ultimo press: ' + auxPressesArray[indexPress][index]);
                    if (isOpenPress == false  && auxPressesArray[indexPress][index] != 0 && (auxPressesArray[indexPress][index]) % single.automatic_press_every == 0) {
                        console.log('========================== Se abre presion ========================');
                        indexPress += 1;
                        back9Presses[index] = 0;
                        auxPressesArray.push(back9Presses);
                    }
                console.log('================= PRESIONES ABIERTAS HOYO: ' + back9_b[index].hole_number + ' ====================');
                console.log(auxPressesArray);
                anterior = index;
                isOpenPress= false;
            }

        }
        console.log('====================== PRESIONES ====================================');
        console.log(auxPressesArray);
        return auxPressesArray;
    }

    distributeAdv(strokes) {
        let advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let i = 0;
        console.log('********* STROKES POR REPARTIR **********', strokes);
        while (strokes > 0) {
            advStrokes[i] = advStrokes[i] + 1;
            strokes = strokes - 1;
            i++;
            if (i == 18) {
                i = 0;
            }
        }

        return advStrokes;
    }

    getTotalStrokes(holes) {
        let total = 0;
        let strokes = 0;
        holes.forEach(hole => {
            strokes = hole.strokes == undefined || hole.strokes == null ? 0 : hole.strokes;
            total += strokes;
            //console.log('Hole: ', hole);
        });
        return total;
    }
    render() {
        const { member_a, member_b, member_c, member_d, front9Presses, back9Presses } = this.state;
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={{ padding: 5 }}>
                        <View>
                            <View style={{ flexDirection: 'row', backgroundColor: 'gray' }}>
                                <View style={{ width: 40 }}>
                                    <Text>Hole </Text>
                                    <Text>Adv </Text>
                                </View>
                                {
                                    member_a.front9.map(hole => {
                                        return (
                                            <View style={{ backgroundColor: 'white', width: 25, margin: 1 }}>
                                                <Text style={{ textAlign: 'center' }}>{hole.hole_number} </Text>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_a.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_a.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}>
                                                <Text>
                                                    {member_a.handicap}{"\n"}
                                                </Text>
                                                <Text>
                                                    {(member_a.handicap * this.state.round.hcp_adjustment).toFixed(0)}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        member_a.front9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_a.advStrokes[(hole.adv - 1)] == 0 ? null : member_a.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_a.front9, member_a.advStrokes)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_b.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_b.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}>
                                                <Text>
                                                    {member_b.handicap}{"\n"}
                                                </Text>
                                                <Text>
                                                    {(member_b.handicap * this.state.round.hcp_adjustment).toFixed(0)}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        member_b.front9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_b.advStrokes[(hole.adv - 1)] == 0 ? null : member_b.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_b.front9, member_b.advStrokes)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_c.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_c.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}>
                                                <Text>
                                                    {member_c.handicap}{"\n"}
                                                </Text>
                                                <Text>
                                                    {(member_c.handicap * this.state.round.hcp_adjustment).toFixed(0)}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        member_c.front9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_c.advStrokes[(hole.adv - 1)] == 0 ? null : member_c.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_c.front9, member_c.advStrokes)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_d.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_d.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}>
                                                <Text>
                                                    {member_d.handicap}{"\n"}
                                                </Text>
                                                <Text>
                                                    {(member_d.handicap * this.state.round.hcp_adjustment).toFixed(0)}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        member_d.front9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_d.advStrokes[(hole.adv - 1)] == 0 ? null : member_d.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_d.front9, member_d.advStrokes)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 25, width: '100%', backgroundColor: 'lightgray' }}>

                    </View>
                    <View style={{ flexDirection: 'row', padding: 5 }}>
                        <View style={{ width: 40, height: 80 }}>
                            <Text style={{ fontWeight: 'bold', paddingTop: 5 }}>22.5 </Text>
                        </View>
                        {
                            member_a.front9.map((hole, index) => {
                                let auxLastIndex = 0;
                                return (
                                    <View style={{ borderWidth: 1, borderColor: 'back', width: 25, height: 100, margin: 1 }}>
                                        {
                                            front9Presses.map((press, j) => {
                                                    let indexOfCero = null;
                                                    if (press[index] == null) {
                                                        return null;
                                                    }
                                                    if (press[index] == 0) {
                                                        indexOfCero = press.indexOf(0);
                                                        if (j > 0 && indexOfCero == index) {
                                                            return null
                                                        } else {
                                                            return (<Text style={{ fontSize: 8, textAlign: 'center' }}> = </Text>)
                                                        }
                                                    }    
                                                else if (press[index] < 0) {
                                                    return (<Text style={{ fontSize: 8, textAlign: 'center', color: 'red' }}>{press[index]}</Text>)
                                                } else {
                                                    return (<Text style={{ fontSize: 8, textAlign: 'center' }}>+{press[index]}</Text>)
                                                }
                                            })
                                        }
                                        <Text style={{ textAlign: 'center' }}> </Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                    <View style={{ padding: 5 }}>
                        <View>
                            <View style={{ flexDirection: 'row', backgroundColor: 'gray' }}>
                                <View style={{ width: 40 }}>
                                    <Text>Hole </Text>
                                    <Text>Par </Text>
                                </View>
                                {
                                    member_a.back9.map(hole => {
                                        return (
                                            <View style={{ backgroundColor: 'white', width: 25, margin: 1 }}>
                                                <Text style={{ textAlign: 'center' }}>{hole.hole_number} </Text>
                                                <Text style={{ textAlign: 'right' }}>{hole.par} </Text>
                                            </View>
                                        );
                                    })
                                }
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_a.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_a.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}> {(member_a.handicap * this.state.round.hcp_adjustment).toFixed(0)}</Text>
                                        </View>
                                    </View>
                                    {
                                        member_a.back9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_a.advStrokes[(hole.adv - 1)] == 0 ? null : member_a.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_a.back9, member_a.advStrokes)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_b.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_b.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}> {(member_b.handicap * this.state.round.hcp_adjustment).toFixed(0)}</Text>
                                        </View>
                                    </View>
                                    {
                                        member_b.back9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_b.advStrokes[(hole.adv - 1)] == 0 ? null : member_b.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_b.back9, member_b.advStrokes)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_c.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_c.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}>
                                                <Text>
                                                    {member_c.handicap}{"\n"}
                                                </Text>
                                                <Text>
                                                    {(member_c.handicap * this.state.round.hcp_adjustment).toFixed(0)}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        member_c.back9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_c.advStrokes[(hole.adv - 1)] == 0 ? null : member_b.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_c.back9, member_c.advStrokes)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: 40 }}>
                                        <Text>{member_d.nick_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{
                                                backgroundColor: member_d.tee.color,
                                                width: 5,
                                                height: 5
                                            }}></View>
                                            <Text style={{
                                                fontSize: 12
                                            }}>
                                                <Text>
                                                    {member_d.handicap}{"\n"}
                                                </Text>
                                                <Text>
                                                    {(member_d.handicap * this.state.round.hcp_adjustment).toFixed(0)}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        member_d.back9.map(hole => {
                                            return (
                                                <View style={{ margin: 1, width: 25 }}>
                                                    <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                                    <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                                        <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                                        <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{member_d.advStrokes[(hole.adv - 1)] == 0 ? null : member_d.advStrokes[(hole.adv - 1)]}</Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                    }
                                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(member_d.back9, member_d.advStrokes)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 25, width: '100%', backgroundColor: 'lightgray' }}>

                    </View>
                    <View style={{ flexDirection: 'row', padding: 5 }}>
                        <View style={{ width: 40, height: 80 }}>
                            <Text style={{ fontWeight: 'bold', paddingTop: 5 }}>22.5 </Text>
                        </View>
                        {
                            member_a.front9.map((hole, index) => {
                                let auxLastIndex = 0;
                                return (
                                    <View style={{ borderWidth: 1, borderColor: 'back', width: 25, height: 100, margin: 1 }}>
                                        {
                                            back9Presses.map((press, j) => {
                                                let indexOfCero=null;
                                                if (press[index] == null) {
                                                    return null;
                                                }
                                                if (press[index] == 0) {
                                                    indexOfCero=press.indexOf(0);
                                                    if(j>0 && indexOfCero==index){
                                                        return null
                                                    }else {
                                                        return (<Text style={{ fontSize: 8, textAlign: 'center' }}> = </Text>)
                                                    }
                                                }
                                                else if (press[index] < 0) {
                                                    return (<Text style={{ fontSize: 8, textAlign: 'center', color: 'red' }}>{press[index]}</Text>)
                                                } else {
                                                    return (<Text style={{ fontSize: 8, textAlign: 'center' }}>+{press[index]}</Text>)
                                                }
                                            })
                                        }
                                        <Text style={{ textAlign: 'center' }}> </Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default ScoreCardScreen;
