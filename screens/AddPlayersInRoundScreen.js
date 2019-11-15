/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Switch, Alert, Text, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class AddPlayersInRoundScreen extends Component {
    constructor(props) {
        super(props);
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        this.state = {
            player_id: '',
            nick_name: '',
            photo: '',
            tee_id: '' ,
            round_id: valueRound.id,
            handicap: '',
            id_sync: null,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
            isLoading: false,
            players: [],
            tees: [],
        };
    }
    static navigationOptions = {
        title: 'Agregar Jugador a la ronda',
    };

    componentDidMount() {
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        console.log('======================= Ronda en add player: ============================');
        console.log(valueRound);
        console.log('======================= Ronda en add player: ============================');
        let tees=[];
        db.listTeeByCourseId(valueRound.course_id).then(data => {
                data.forEach(element => {
                    tees.push({
                        value: element.name,
                        id: element.id,
                        slope: element.slope,
                    })
                });
                console.log('======================= RESULTADO TEES: ============================');
                console.log(tees);
                this.setState({
                    tees: tees
                });
            })
            .catch(err => {
                console.log(err);
                this.setState = {
                    isLoading: false,
                };
            });
        let players = [];
        db.listPlayers().then(result => {
            console.log('======================= RESULTADO PLAYERS: ============================');
            console.log(result);
            result.forEach(element => {
                players.push({
                    value: element.name,
                    nick_name: element.nick_name,
                    photo: element.photo,
                    handicap: element.handicap,
                    id: element.id
                })
            });
            console.log('======================= RESULTADO PLAYERS VALUE: ============================');
            console.log(players);
            this.setState({
                players: players
            });
        }).catch(error => {
            console.log(error);
        })
    }

    updateTextInput = (text, field) => {
        const state = this.state;
        state[field] = text;
        this.setState(state);
    }

    calculeHandicapAndAdvStrokes= (value, index) => {
            let handicapCampo = ((this.state.handicap * this.state.tees[index].slope) / 113);
            let numberHole=null;
            let i=0;
            let adv=null;
            let holes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let advStrokes=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            console.log('==================== TEEE =================');
            console.log('Slope: ', this.state.tees[index].slope);
            console.log('Handicap con decimales: ', handicapCampo);
            console.log('Redondeado: ', handicapCampo.toFixed(0));                                        
            console.log('===================== END ===================');
        this.setState({
            tee_id: this.state.tees[index].id,
            handicap: handicapCampo.toFixed(0),
        }); /*
            auxHandicapCampo = handicapCampo.toFixed(0);
            while (auxHandicapCampo > 0) {
                advStrokes[i] = advStrokes[i] + 1;
                //console.log('Index: ' + i + ' Ventaja: '  +  advStrokes[i]);
                auxHandicapCampo = auxHandicapCampo - 1;
                i++;
                if (i == 18) {
                    i = 0;
                }
            }
            db.holesByTeeId(this.state.tees[index].id).then(result => {
                result.forEach(element => {
                    numberHole = parseInt(element.hole_number) - 1;
                    adv= parseInt(element.adv) - 1;
                    holes[numberHole]= advStrokes[adv];
                    console.log('Hole number: ' + element.hole_number + ' Advantage (handicap hoyo): ' + element.adv + '  Golpes de ventaja: ' + advStrokes[adv]);
                });
                console.log('=============== VETAJAS EN CADA HOYO =============================');
                console.log(holes);
                this.setState({
                    tee_id: this.state.tees[index].id,
                    handicap: handicapCampo,
                }); 
            }).catch(err => console.log(err))
            */
        }

    saveMember() {
        this.setState({
            isLoading: true,
        });
        let numberHole = null;
        let i = 0;
        let adv = null;
        let holes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let auxHandicapCampo = this.state.handicap;
        while (auxHandicapCampo > 0) {
            advStrokes[i] = advStrokes[i] + 1;
           /* console.log('Index: ' + i + ' Ventaja: '  +  advStrokes[i]);
            console.log('Handicap de campo: ', auxHandicapCampo); */
            auxHandicapCampo = auxHandicapCampo - 1;
            i++;
            if (i == 18) {
                i = 0;
            }
        }
        db.holesByTeeId(this.state.tee_id).then(result => {
            result.forEach(element => {
                numberHole = parseInt(element.hole_number) - 1;
                adv = parseInt(element.adv) - 1;
                holes[numberHole] = advStrokes[adv];
                console.log('Hole number: ' + element.hole_number + ' Advantage (handicap hoyo): ' + element.adv + '  Golpes de ventaja: ' + advStrokes[adv]);
            });

            let data = {
                player_id: this.state.player_id,
                nick_name: this.state.nick_name, 
                photo: this.state.photo,
                tee_id: this.state.tee_id,
                round_id: this.state.round_id,
                handicap: this.state.handicap,
                adv_h1: holes[0], 
                adv_h2: holes[1], 
                adv_h3: holes[2], 
                adv_h4: holes[3], 
                adv_h5: holes[4], 
                adv_h6: holes[5], 
                adv_h7: holes[6], 
                adv_h8: holes[7], 
                adv_h9: holes[8], 
                adv_h10: holes[9], 
                adv_h11: holes[10], 
                adv_h12: holes[11], 
                adv_h13: holes[12], 
                adv_h14: holes[13], 
                adv_h15: holes[14], 
                adv_h16: holes[15], 
                adv_h17: holes[16], 
                adv_h18: holes[17],
                id_sync: this.state.id_sync,
                ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            console.log('================== DATA ====================================');
            console.log(data);
            console.log('================== FINAL DE DATA ====================================');
            db.addMember(data).then((result) => {
                console.log('================== MEMBER ====================================');
                console.log(result);
                // Alert.alert('ID DE COURSE: ', result.insertId);
                console.log('================== FINAL DE MEMBER ====================================');
                //Alert.alert(JSON.stringify(result));

                this.setState({
                    isLoading: false,
                });
                this.props.navigation.goBack();
            }).catch((err) => {
                console.log(err);
                this.setState({
                    isLoading: false,
                });
            })
        }).catch(err => console.log(err))
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.subContainer, {
                    borderBottomWidth: 0,
                }]}>
                    <Dropdown
                        label='Player'
                        data={this.state.players}
                        onChangeText={(value, index) => {
                            this.setState({
                                player_id: this.state.players[index].id,
                                handicap: this.state.players[index].handicap,
                                nick_name: this.state.players[index].nick_name,
                                photo: this.state.players[index].photo,
                            });
                        }}
                    />
                </View>
                <View style={{ height: 20 }}/>
                <View style={[styles.subContainer, {
                    borderBottomWidth: 0,
                }]}>
                    <Dropdown
                        label='Tee'
                        data={this.state.tees}
                        onChangeText={this.calculeHandicapAndAdvStrokes}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Save'
                        onPress={() => this.saveMember()} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    subContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    },
    button: {
        marginBottom: 60,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
})