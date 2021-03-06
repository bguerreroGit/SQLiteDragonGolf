/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Switch, Alert, Text, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class AddPlayersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            player: {
                name: 'Jugador',
                last_name: 'Apellido',
                email: 'j@gmail.com',
                cellphone: '444 333 4807',
                ghin_number: 'T327347',
                nick_name: 'J1', 
                handicap: '26', 
                strokes: '4',
                photo: '1355665.jpg',
                general_settings_id: null,
                advantage_settings_id: null,
                single_nassau_wagers_id: null,
                extra_bets_id: null,
                team_nassau_wagers_id: null,
                best_ball_teams_id: null,
                id_sync: '2',
                ultimate_sync: '',
            },
            general_settings: {
                rabbit_1_6: '100', 
                rabbit_7_12: '100', 
                rabbit_13_18: '100', 
                medal_play_f9: '100',
                medal_play_b9: '100',
                medal_play_18: '100',
                skins: '100', 
                skins_carry_over: 0, 
                lowed_adv_on_f9: 0, 
                id_sync: '', 
                ultimate_sync: '', 
            },
            single_nassau_wagers: {
                automatic_presses_every: '2', 
                front_9: '100',
                back_9: '100',
                match: '100',
                medal: '200',
                total_18: '',
                carry: '200',
                id_sync: '', 
                ultimate_sync: '',
            },
            team_nassau_wagers: {
                automatic_presses_every: '2',
                front_9: '100', 
                back_9: '100', 
                total_18: '',
                match: '100', 
                carry: '100', 
                medal: '100', 
                who_gets_the_adv_strokes: 'Hi Hcp',
                id_sync: '', 
                ultimate_sync: '',
            },
            isLoading: false,
        };
    }
    static navigationOptions = {
        title: 'Agregar Jugador',
    };

    updateTextInput = (text, field) => {
        const state = this.state;
        state.player[field] = text;
        state.player.ultimate_sync = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState(state);
    }
    updateGenSettTextInput = (text, field) => {
        const state = this.state;
        state.general_settings[field] = text;
        state.general_settings.ultimate_sync = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState(state);
    }
    updateSingSettTextInput = (text, field) => {
        const state = this.state;
        state.single_nassau_wagers[field] = text;
        state.single_nassau_wagers.ultimate_sync = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState(state);
    }
    updateTeamSettTextInput = (text, field) => {
        const state = this.state;
        state.team_nassau_wagers[field] = text;
        state.team_nassau_wagers.ultimate_sync = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState(state);
    }
    toggleSwitch = (value, field) => {
        const state = this.state;
        state.general_settings[field] = value==true ? 1 : 0;
        state.general_settings.ultimate_sync = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState(state);
    }
    savePlayer() {
        this.setState({
            isLoading: true,
        });
        let player = this.state.player;
        let dataGeneralSetting=this.state.general_settings;
        let single=this.state.single_nassau_wagers;
        let team=this.state.team_nassau_wagers;

        db.addGeneralSettings(dataGeneralSetting).then((result) => {
            console.log('================== GENERAL SETTING ====================================');
            console.log(result);
            console.log('ID DE GENERAL SETTING: ', result.insertId);
            console.log('================== FINAL DE GENERAL SETTING ====================================');
            player.general_settings_id = result.insertId;
            db.addSingleNassauSettings(single).then((result) => {
                console.log('================== SINGLE SETTING ====================================');
                console.log(result);
                console.log('ID DE SINGLE SETTING: ', result.insertId);
                console.log('================== FINAL DE SINGLE SETTING ====================================');
                player.single_nassau_wagers_id=result.insertId; 
                db.addTeamNassauSettings(team).then((resultado) => {
                    console.log('=================TEAM ====================================');
                    console.log(resultado);
                    console.log('ID DE TEAM: ', resultado.insertId);
                    console.log('================== FINAL TEAM ====================================');
                    //Alert.alert(JSON.stringify(result));
                    player.team_nassau_wagers_id=resultado.insertId;
                    db.addPlayers(player).then((resultado) => {
                        console.log('================== PLAYER ====================================');
                        console.log(resultado);
                        console.log('ID DE PLAYER: ', resultado.insertId);
                        console.log('================== FINAL DE PLAYER ====================================');
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
                }).catch((err) => {
                    console.log(err);
                    this.setState({
                        isLoading: false,
                    });
                })   
            }).catch(error => {
                console.log(error);
            })

        }).catch(err => {
            console.log(err);
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
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Name'}
                        value={this.state.player.name}
                        onChangeText={(text) => this.updateTextInput(text, 'name')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Last Name'}
                        value={this.state.player.last_name}
                        onChangeText={(text) => this.updateTextInput(text, 'last_name')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Email'}
                        value={this.state.player.email}
                        onChangeText={(text) => this.updateTextInput(text, 'email')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Cellphone'}
                        value={this.state.player.cellphone}
                        onChangeText={(text) => this.updateTextInput(text, 'cellphone')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Ghin Number'}
                        value={this.state.player.ghin_number}
                        onChangeText={(text) => this.updateTextInput(text, 'ghin_number')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Nick Name'}
                        value={this.state.player.nick_name}
                        onChangeText={(text) => this.updateTextInput(text, 'nick_name')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Handicap'}
                        value={this.state.player.handicap}
                        onChangeText={(text) => this.updateTextInput(text, 'handicap')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Strokes for this player'}
                        value={this.state.player.strokes}
                        onChangeText={(text) => this.updateTextInput(text, 'strokes')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Photo'}
                        value={this.state.player.photo}
                        onChangeText={(text) => this.updateTextInput(text, 'photo')}
                    />
                </View>
                <View style={styles.seccionContainer}>
                    <Text>General Settings</Text>
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Rabbit 1 - 6'}
                        value={this.state.general_settings.rabbit_1_6}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'rabbit_1_6')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Rabbit 7 - 12'}
                        value={this.state.general_settings.rabbit_7_12}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'rabbit_7_12')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Rabbit 13 - 18'}
                        value={this.state.general_settings.rabbit_13_18}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'rabbit_13_18')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Rabbit Medal Plays F9'}
                        value={ this.state.general_settings.medal_play_f9 }
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'medal_play_f9')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Medal Play B9'}
                        value={this.state.general_settings.medal_play_b9}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'medal_play_b9')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Medal Play 18'}
                        value={this.state.general_settings.medal_play_18}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'medal_play_18')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Skins'}
                        value={this.state.general_settings.skins}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateGenSettTextInput(text, 'skins')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>
                            Skins Carry Over
                        </Text>
                        <Switch
                            onValueChange={(value) => this.toggleSwitch(value, 'skins_carry_over')}
                            value={this.state.general_settings.skins_carry_over == 1 ? true : false} />
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>
                            Lowed Adv On F9
                        </Text>
                        <Switch
                            onValueChange={(value) => this.toggleSwitch(value, 'lowed_adv_on_f9')}
                            value={this.state.general_settings.lowed_adv_on_f9 == 1 ? true : false} />
                    </View>
                </View>
                <View style={styles.seccionContainer}>
                    <Text>Single Nassau Wagers</Text>
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Automatic Presses Every'}
                        value={this.state.single_nassau_wagers.automatic_presses_every}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateSingSettTextInput(text, 'automatic_presses_every')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Front 9'}
                        value={this.state.single_nassau_wagers.front_9}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateSingSettTextInput(text, 'front_9')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Back 9'}
                        value={this.state.single_nassau_wagers.back_9}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateSingSettTextInput(text, 'back_9')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Match'}
                        value={this.state.single_nassau_wagers.match}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateSingSettTextInput(text, 'match')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Carry'}
                        value={this.state.single_nassau_wagers.carry}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateSingSettTextInput(text, 'carry')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Medal'}
                        value={this.state.single_nassau_wagers.medal}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateSingSettTextInput(text, 'medal')}
                    />
                </View>
                <View style={styles.seccionContainer}>
                    <Text>Team Nassau Wagers</Text>
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Automatic Presses Every'}
                        value={this.state.team_nassau_wagers.automatic_presses_every}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'automatic_presses_every')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Front 9'}
                        value={this.state.team_nassau_wagers.front_9}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'front_9')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Back 9'}
                        value={this.state.team_nassau_wagers.back_9}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'back_9')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Match'}
                        value={this.state.team_nassau_wagers.match}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'match')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Carry'}
                        value={this.state.team_nassau_wagers.carry}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'carry')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Medal'}
                        value={this.state.team_nassau_wagers.medal}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'medal')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Who Gets the Adv Strokes'}
                        value={this.state.team_nassau_wagers.who_gets_the_adv_strokes}
                        keyboardType={'numeric'}
                        onChangeText={(text) => this.updateTeamSettTextInput(text, 'who_gets_the_adv_strokes')}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Save'
                        onPress={() => this.savePlayer()} />
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
    seccionContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 5,
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