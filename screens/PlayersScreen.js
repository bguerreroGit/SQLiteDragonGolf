/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class PlayersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            campos: [],
            notFound:
                'Jugadores no encontrados.\nPorfavor seleccione (+) boton para agregar alguno.',
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Lista de Jugadores',
            headerRight: (
                <Button
                    buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
                    onPress={() => {
                        navigation.navigate('AddPlayers', {
                            onNavigateBack: this.handleOnNavigateBack,
                        });
                    }}
                />
            ),
        };
    };

    getPlayers() {
        let players = [];
        db.listPlayers()
            .then(data => {
                players = data;
                console.log('============================ PLAYERS ********************');
                console.log(players);
                console.log('=========================== END PLAYERS =====================');
                this.setState({
                    players,
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

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item }) => (
        <ListItem
            title={item.name}
            subtitle={item.nick_name}
            leftIcon={{ name: 'check-circle' }}
            onPress={() => {
                Alert.alert(
                  'Acciones',
                  'Eliga una opción',
                  [
                    {
                      text: 'Eliminar',
                      onPress: () => this.deletePlayer(item.id),
                      style: 'cancel',
                    },
                    { text: 'Cancelar', onPress: () => console.log('OK Pressed') },
                  ],
                  { cancelable: false },
                );
              }}
            chevron
            bottomDivider
        />
    );
    deletePlayer(id) {
        const { navigation } = this.props;
        this.setState({
          isLoading: true
        });
        db.deletePlayer(id).then((result) => {
          console.log(result);
          this.getPlayers();
        }).catch((err) => {
          console.log(err);
          this.setState = {
            isLoading: false
          }
        })
      }
    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getPlayers();
        });
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );;
        }
        if (this.state.players.length === 0) {
            return (
                <View>
                    <Text style={styles.message}>{this.state.notFound}</Text>
                </View>
            );;
        }
        return (
            <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.players}
                renderItem={this.renderItem}
            />
        );
    }
}

const styles = StyleSheet.create({
    message: {
        padding: 16,
        fontSize: 18,
        color: 'red',
    },
});
