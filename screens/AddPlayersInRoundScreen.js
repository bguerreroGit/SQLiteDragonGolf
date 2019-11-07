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
                    short_name: element.nick_name,
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
    saveMember() {
        this.setState({
            isLoading: true,
        });
        let data = {
            player_id: this.state.player_id,
            tee_id: this.state.tee_id,
            round_id: this.state.round_id,
            handicap: this.state.handicap,
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
                        onChangeText={(value, index) => {
                            let handicapCampo = ((this.state.handicap * this.state.tees[index].slope) / 113);
                            console.log('==================== TEEE =================');
                            console.log('Slope: ', this.state.tees[index].slope);
                            console.log('Handicap con decimales: ', handicapCampo);
                            console.log('Redondeado: ', handicapCampo.toFixed(0));                                        
                            console.log('===================== END ===================');
                            this.setState({
                                tee_id: this.state.tees[index].id,
                                handicap: handicapCampo.toFixed(0),
                            }); 
                        }}
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