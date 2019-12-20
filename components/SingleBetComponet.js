import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet} from 'react-native';
import Database from '../Database';
const db = new Database();

export default class SingleBetComponet extends Component {
  constructor(props) {
    super(props);
    this.state = {
        valuesFront9: [null, null, null, null, null, null, null, null, null],
        valuesBack9: [null, null, null, null, null, null, null, null, null],
    };
  }
    componentDidMount() {
        this.calculeScore();
    }
    componentDidUpdate() {
       // this.calculeScore();
    }
    async calculeScore() {
        let valuesFront9=[null, null, null, null, null, null, null ,null, null];
        let valuesBack9 = [null, null, null, null, null, null, null, null, null];
        let single=this.props.bet;
        let valueRound=this.props.round;
        let round = await db.roundById(valueRound.id);
        console.log('======================== SINGLE =====================');
        console.log(single);
        console.log('======================== END SINGLE =================');
        let member_a = await db.getMemberByIdWithHoles(single.member_a_id);
        let member_b = await db.getMemberByIdWithHoles(single.member_b_id);
        member_a = member_a[0];
        member_a.advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        member_b = member_b[0];
        member_b.advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        console.log('======================== MEMBER A =====================');
        console.log(member_a);
        console.log('======================== END MEMBER A =================');
        console.log('======================== MEMBER B =====================');
        console.log(member_b);
        console.log('======================== END MEMBER B =================');
        let strokes = 0;
        if (single.manually_override_adv == 1) {
            if (single.manually_adv_strokes > 0) {
                console.log('================= MANUAL Recibe golpes MEMBER A===================');
                strokes = single.manually_adv_strokes;
                member_a.advStrokes = this.distributeAdv(strokes);
            } else {
                console.log('================= MANUAL Recibe golpes MEMBER B===================');
                console.log(single.manually_adv_strokes * -1);
                strokes = single.manually_adv_strokes * -1;
                member_b.advStrokes = this.distributeAdv(strokes);
            }
        } else {
            if (single.adv_strokes > 0) {
                console.log('================= Recibe golpes MEMBER A===================');
                strokes = single.adv_strokes;
                member_a.advStrokes = this.distributeAdv(strokes);
            } else {
                console.log('================= Recibe golpes MEMBER B===================');
                console.log(single.adv_strokes * -1);
                strokes = single.adv_strokes * -1;
                member_b.advStrokes = this.distributeAdv(strokes);
            }
        }
        if (round.adv_b9_f9 == 1 && round.starting_hole > 1) {
            member_a.holes = this.swichAdvantage(member_a.holes);
            member_b.holes = this.swichAdvantage(member_b.holes);
        }
        let aFront9AndBack9 = this.getFront9AndBack9Holes(round.starting_hole, member_a.holes);
        let bFront9AndBack9 = this.getFront9AndBack9Holes(round.starting_hole, member_b.holes);
        member_a.front9 = aFront9AndBack9.front9;
        member_b.front9 = bFront9AndBack9.front9;
        member_a.back9 = aFront9AndBack9.back9;
        member_b.back9 = bFront9AndBack9.back9;
        let resultsFront9 = this.calculeBack9Presses(member_a.front9, member_a.advStrokes, member_b.front9, member_b.advStrokes);
        let front9Presses = resultsFront9.auxPressesArray;
        console.log('====== MATCH FRONT 9 =====================================================');
        console.log(resultsFront9.match);
        let resultsBack9 = this.calculeBack9Presses(member_a.back9, member_a.advStrokes, member_b.back9, member_b.advStrokes);
        let back9Presses = resultsBack9.auxPressesArray;
        console.log('====== MATCH BACK 9 =====================================================');
        console.log(resultsBack9.match);
        console.log('========================== FRONT 9 PRESSES ==================');
        console.log(front9Presses);
        let ultimateValue=null;
        for (let k = 0; k < front9Presses.length; k++) {
            for (let n = 0; n < front9Presses[k].length; n++) {
                if(front9Presses[k][n] !=null){
                    ultimateValue = front9Presses[k][n];
                }
            }
            valuesFront9[k]=ultimateValue;
        }
        ultimateValue=null;
        for (let k = 0; k < back9Presses.length; k++) {
            for (let n = 0; n < back9Presses[k].length; n++) {
                if (back9Presses[k][n] != null) {
                    ultimateValue = back9Presses[k][n];
                }
            }
            valuesBack9[k] = ultimateValue;
        }
        console.log('========================== VALUES FRONT 9 ==================');
        console.log(valuesFront9);
        let totalStrokesMemberA = this.getTotalStrokes(member_a.front9, member_a.advStrokes) + this.getTotalStrokes(member_a.back9, member_a.advStrokes);
        let totalStrokesMemberB = this.getTotalStrokes(member_b.front9, member_b.advStrokes) + this.getTotalStrokes(member_b.back9, member_b.advStrokes)
        console.log('======= TOTAL STROKES MEMEBER A =======================');
        console.log(totalStrokesMemberA);
        console.log('======= TOTAL STROKES MEMEBER B =======================');
        console.log(totalStrokesMemberB);
        console.log('======= TOTAL STROKES =======================');
        let totalBet=0;
        let totalMedal= totalStrokesMemberB - totalStrokesMemberA ;
        let totalMatch= resultsFront9.match + resultsBack9.match;
        valuesFront9.forEach(element => {
            if(element!=null){
                if(element<0){
                    totalBet -= single.front_9;
                }
                if(element>0){
                    totalBet += single.front_9;
                }
            }

        });
        
        if(valuesFront9[0]==0){
            valuesBack9.forEach(element => {
                console.log('total bet: ' + totalBet + ' valor item: ' + element);
                if (element != null) {
                    if (element < 0) {
                        totalBet -= single.carry;
                    }
                    if (element > 0) {
                        totalBet += single.carry;
                    }
                }

            });
        }else {
            valuesBack9.forEach(element => {
                console.log('total bet: ' + totalBet + ' valor item: ' + element);
                if (element != null) {
                    if (element < 0) {
                        totalBet -= single.back_9;
                    }
                    if (element > 0) {
                        totalBet += single.back_9;
                    }
                }

            });
            if (totalMatch > 0) {
                totalBet += single.match;
            }
            if (totalMatch < 0) {
                totalBet -= single.match;
            }
        }
        if(totalMedal>0){
            totalBet += single.medal;
        }
        if(totalMedal<0){
            totalBet -= single.medal;
        }
        console.log('=============  VALOR DINERO APUESTA ============');
        console.log(single.front_9);
        this.setState({
            totalBet,
            totalMatch,
            totalMedal,
            valuesFront9,
            valuesBack9,
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

    calculeBack9Presses(back9_a, advantage_a, back9_b, advantage_b) {
        const { bet } = this.props;
        let back9Presses = [null, null, null, null, null, null, null, null, null];
        let anterior = null;
        let strokes_a = 0;
        let match=0;
        let strokes_b = 0;
        let advIndex = 0;
        let auxPressesArray = [
            [null, null, null, null, null, null, null, null, null],
        ];
        let indexPress = 0;
        for (let index = 0; index < 9; index++) {
            if (back9_a[index].strokes == null) {
                console.log('============== GOLPES A ' + back9_a[index].strokes + ' hole: ' + back9_b[index].hole_number + '====================');
            } else {
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
                ///calculo del medal
                if (strokes_a < strokes_b) {
                    match += 1;
                }
                if (strokes_b < strokes_a) {
                    match -= 1;
                }
                ////// end calculo del match
                console.log('=================== STROKES JUGADOR B ===============');
                console.log(' -Golpes total: ' + strokes_b);
                if (auxPressesArray.length == 1) {
                    //auxPressesArray.push(back9Presses);
                    if (strokes_a < strokes_b) {
                        auxPressesArray[0][index] = 1;
                    } else if (strokes_b < strokes_a) {
                        auxPressesArray[0][index] = -1;
                    } else {
                        auxPressesArray[0][index] = 0;
                    }
                    if (auxPressesArray[0][index] != 0 && (auxPressesArray[0][index]) % bet.automatic_press_every == 0) {
                        console.log('========================== SE ABRE LA PRIMER PRESION ========================');
                        indexPress += 1;
                        back9Presses[index] = 0;
                        auxPressesArray.push(back9Presses);
                    }
                } else {
                    if (strokes_a < strokes_b) {
                        for (let j = 0; j <= indexPress; j++) {
                            auxPressesArray[j][index] = (auxPressesArray[j][anterior] + 1);
                            console.log('Valor:  ' + auxPressesArray[j][anterior] + ' nuevo valor: ' + auxPressesArray[j][index]);
                        }

                        if (auxPressesArray[indexPress][index] > 0 && (auxPressesArray[indexPress][index]) % bet.automatic_press_every == 0) {
                            console.log('========================== Se abre presion ========================');
                            indexPress += 1;
                            back9Presses[index] = 0;
                            auxPressesArray.push(back9Presses);
                        }

                    } else if (strokes_b < strokes_a) {
                        for (let j = 0; j <= indexPress; j++) {
                            auxPressesArray[j][index] = (auxPressesArray[j][anterior] - 1);
                            console.log('Valor:  ' + auxPressesArray[j][anterior] + ' nuevo valor: ' + auxPressesArray[j][index]);
                        }
                        if (auxPressesArray[indexPress][index] < 0 && (auxPressesArray[indexPress][index]) % bet.automatic_press_every == 0) {
                            console.log('=================== Se abre presion negativa =================');
                            indexPress += 1;
                            back9Presses[index] = 0;
                            auxPressesArray.push(back9Presses);
                        }
                    } else {
                        console.log('======================== SE EMPATAN =========================');
                        for (let j = 0; j <= indexPress; j++) {
                            auxPressesArray[j][index] = auxPressesArray[j][anterior];
                            console.log('Valor:  ' + auxPressesArray[j][anterior] + ' nuevo valor: ' + auxPressesArray[j][index]);
                        }
                    }
                }
                anterior = index;
            }

        }
        let result={
            auxPressesArray: auxPressesArray,
            match: match
        }
        return result;
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

    getTotalStrokes(holes, advStrokes) {
        let total = 0;
        let strokes = 0;
        holes.forEach(hole => {
            strokes = hole.strokes == undefined || hole.strokes == null ? 0 : hole.strokes - advStrokes[(hole.adv - 1)];
            total += strokes;
            //console.log('Hole: ', hole);
        });
        return total;
    }

    onPressBetSingle(bet) {
        Alert.alert(
            'Acciones',
            'Seleccione una',
            [
                { text: 'Review Results', onPress: () => this.props.navigation.navigate('SingleNassauScoreCard', { single: bet }) },
                { text: 'Edit Betting Options', onPress: () => this.props.navigation.navigate('AddSingleNassau', { single: bet }) },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: true },
        );
    }

  render() {
    const { bet, index }=this.props;
    const { valuesFront9, valuesBack9, totalBet, totalMatch, totalMedal }=this.state;
    return (
        <TouchableOpacity onPress={() => this.onPressBetSingle(bet)} style={{ borderBottomWidth: 0.3, borderBottomColor: 'gray' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.numberBetContainer}>
                        {index + 1}
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                        [{
                            bet.manually_override_adv == 1 ? 
                            bet.manually_adv_strokes : bet.adv_strokes
                        }]
                    </Text>
                    <Text style={{ marginLeft: 8, color: 'green', fontWeight: 'bold' }}>
                        {bet.member_a} vs {bet.member_b}
                    </Text>
                </View>
                <Text style={{ backgroundColor: 'lightgreen', fontWeight: 'bold', padding: 2, paddingLeft: 10 }}>
                    $ { totalBet }
                </Text>
            </View>
            <View style={{ marginHorizontal: 20 }}>
                <Text>
                    <Text style={styles.blueNumber}>${bet.front_9}</Text>
                    <Text style={styles.orangeText}>  F9: </Text>
                    <Text>{ valuesFront9[0] == null ? ' . ' : valuesFront9[0] == 0 ? ' = ' : ' ' + valuesFront9[0] + ' ' }</Text>
                    <Text>{ valuesFront9[1] == null ? ' . ' : valuesFront9[1] == 0 ? ' = ' : ' ' + valuesFront9[1] + ' ' }</Text>
                    <Text>{ valuesFront9[2] == null ? ' . ' : valuesFront9[2] == 0 ? ' = ' : ' ' + valuesFront9[2] + ' ' }</Text>
                    <Text>{ valuesFront9[3] == null ? ' . ' : valuesFront9[3] == 0 ? ' = ' : ' ' + valuesFront9[3] + ' ' }</Text>
                    <Text>{ valuesFront9[4] == null ? ' . ' : valuesFront9[4] == 0 ? ' = ' : ' ' + valuesFront9[4] + ' ' }</Text>
                    <Text>{ valuesFront9[5] == null ? ' . ' : valuesFront9[5] == 0 ? ' = ' : ' ' + valuesFront9[5] + ' ' }</Text>
                    <Text>{ valuesFront9[6] == null ? ' . ' : valuesFront9[6] == 0 ? ' = ' : ' ' + valuesFront9[6] + ' ' }</Text>
                    <Text>{ valuesFront9[7] == null ? ' . ' : valuesFront9[7] == 0 ? ' = ' : ' ' + valuesFront9[7] + ' ' }</Text>
                    <Text>{ valuesFront9[8] == null ? ' . ' : valuesFront9[8] == 0 ? ' = ' : ' ' + valuesFront9[8] + ' ' }</Text>
                </Text>
                <Text style={{ textAlign: 'right' }}>
                    <Text style={styles.blueNumber}>${bet.back_9}</Text>
                    <Text style={styles.orangeText}>  B9: </Text>
                    <Text>{valuesBack9[0] == null ? ' . ' : valuesBack9[0] == 0 ? ' = ' : ' ' + valuesBack9[0] + ' ' }</Text>
                    <Text>{valuesBack9[1] == null ? ' . ' : valuesBack9[1] == 0 ? ' = ' : ' ' + valuesBack9[1] + ' ' }</Text>
                    <Text>{valuesBack9[2] == null ? ' . ' : valuesBack9[2] == 0 ? ' = ' : ' ' + valuesBack9[2] + ' ' }</Text>
                    <Text>{valuesBack9[3] == null ? ' . ' : valuesBack9[3] == 0 ? ' = ' : ' ' + valuesBack9[3] + ' ' }</Text>
                    <Text>{valuesBack9[4] == null ? ' . ' : valuesBack9[4] == 0 ? ' = ' : ' ' + valuesBack9[4] + ' ' }</Text>
                    <Text>{valuesBack9[5] == null ? ' . ' : valuesBack9[5] == 0 ? ' = ' : ' ' + valuesBack9[5] + ' ' }</Text>
                    <Text>{valuesBack9[6] == null ? ' . ' : valuesBack9[6] == 0 ? ' = ' : ' ' + valuesBack9[6] + ' ' }</Text>
                    <Text>{valuesBack9[7] == null ? ' . ' : valuesBack9[7] == 0 ? ' = ' : ' ' + valuesBack9[7] + ' ' }</Text>
                    <Text>{valuesBack9[8] == null ? ' . ' : valuesBack9[8] == 0 ? ' = ' : ' ' + valuesBack9[8] + ' ' }</Text>
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>
                        <Text style={styles.blueNumber}>${bet.match}</Text>
                        <Text style={styles.orangeText}>  MATCH: </Text>
                        <Text> { totalMatch } </Text>
                    </Text>
                    <Text>
                        <Text style={styles.blueNumber}>${bet.medal}</Text>
                        <Text style={styles.orangeText}>  MEDAL: </Text>
                        <Text> { totalMedal } </Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    numberBetContainer: {
        backgroundColor: 'pink',
        width: 20,
        height: 20,
        textAlign: 'center',
        margin: 1,
    },
    blueNumber: {
        color: 'blue',
        fontWeight: 'bold'
    },
    orangeText: {
        color: 'orange'
    }
});
