import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Picker, ActivityIndicator, Button, FlatList } from 'react-native';
import Database from '../Database';
import { ButtonGroup, ListItem, CheckBox } from 'react-native-elements';
import ItemRabbitBetPlayer from '../components/ItemRabbitBetPlayer';

import moment from "moment";

const db = new Database();

export default class AddRabbitBetScreen extends Component {
  constructor(props) {
    super(props);
    this.buttons = ['every 6', 'every 9'];
    this.state = {
        isLoading: true,
        indexButtons: 0,
        option:'every 6',
        price_r1: 0,
        price_r2: 0,
        price_r3: 0,
        members: [],
        players: []
    };
  }

    componentDidMount(){
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        db.listMembersByRoundId(valueRound.id).then(data => {
            this.setState({
                members: data,
                isLoading: false,
            });
        })
        .catch(err => {
                console.log(err);
                this.setState = {
                    isLoading: false,
                };
            });
    }
    updateIndex = (selectedIndex) => {
        this.setState({
            indexButtons: selectedIndex,
            option: this.buttons[selectedIndex],
        });
    }
    updateRabbitBet(){

    }
    addPlayer= (playerId) =>{
        let players=this.state.players;
        players.push(playerId);
        this.setState({
            players
        });
    }
    removePlayer = (playerId) => {
        let players = this.state.players.filter(element => element != playerId);
        this.setState({
            players
        });
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, index }) => (
        <ItemRabbitBetPlayer item={item} addPlayer={this.addPlayer} removePlayer={this.removePlayer}/>        
    )
    saveRabbitBet(){
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        const { option, price_r1, price_r2, price_r3 }=this.state;
        let data={
            option, 
            price_r1, 
            price_r2, 
            price_r3, 
            id_sync: null, 
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        let rabbitPlayers=[];
        db.addBetRabbit(data).then(result =>{
            this.state.players.forEach(player => {
                rabbitPlayers.push({
                    round_id: valueRound.id,
                    bet_rabbit_id: result.insertId,
                    member_id: player,
                    id_sync: null,
                    ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            })
            db.addRabbitPlayer(rabbitPlayers).then(resultado => {
                console.log('===================== RESULTADO AGREGAR JUGADORES AL RABBIT ==================');
                console.log(resultado);
            }).catch(err => {
                console.log(err);
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
        );
    }
    return (
      <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={[styles.inputContainer, { marginLeft: 0 }]}>
                    <Text>R1 $ </Text>
                    <TextInput
                        style={[styles.input, { width: 60 }]}
                        placeholder={'R1'}
                        value={this.state.price_r1.toString()}
                        onChangeText={(text) => this.setState({ price_r1: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>R2 $ </Text>
                    <TextInput
                        style={[styles.input, { width: 60 }]}
                        placeholder={'R2'}
                        value={this.state.price_r2.toString()}
                        onChangeText={(text) => this.setState({ price_r2: text })}
                    />
                </View>
                {
                    this.state.option == 'every 6' ? <View style={styles.inputContainer}>
                        <Text>R3 $ </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'R3'}
                            value={this.state.price_r3.toString()}
                            onChangeText={(text) => this.setState({ price_r3: text })}
                        />
                    </View> : null
                }
            </View>
            <ButtonGroup
                selectedButtonStyle={{ backgroundColor: '#000000' }}
                onPress={this.updateIndex}
                selectedIndex={this.state.indexButtons}
                buttons={this.buttons}
                containerStyle={{ height: 30 }}
            />
            <View style={{ flex: 1 }}>
                <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.members}
                    renderItem={this.renderItem}
                    extraData={this.state.newMembers}
                />
            </View>
            <Button
                title="Guardar"
                color='#3e2465'
                onPress={() => {
                    if (this.props.navigation.getParam('rabbit')) {
                        this.updateRabbitBet();
                    } else {
                        this.saveRabbitBet();
                    }
                }}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 30,
    },
    rowContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    input: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        textAlign: 'center',
        borderRadius: 4
    },
    advStrokesContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textAdvStrokes: {
        backgroundColor: 'lightgray',
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 3,
        width: 50
    },
    simpleRowContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
});