/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Alert
} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class RoundsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            rounds: [],
            notFound:
                'Rondas no encontrados.\nPorfavor seleccione (+) boton para agregar alguno.',
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Lista de Rondas',
            headerRight: (
                <Button
                    buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
                    onPress={() => {
                        navigation.navigate('AddRound', {
                            onNavigateBack: this.handleOnNavigateBack,
                        });
                    }}
                />
            ),
        };
    };
    
    getRounds() {
        let rounds = [];
        db.listRounds()
            .then(data => {
                rounds = data;
                console.log('***************** Rounds ********************');
                //Alert.alert(JSON.stringify(campos));
                this.setState({
                    rounds,
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
            title={item.name + ' -> ' + item.date}
            subtitle={item.online_key}
            leftIcon={{ name: 'check-circle' }}
            onLongPress={() => {
                Alert.alert(
                    'Acciones',
                    'Eliga una opción',
                    [
                        {
                            text: 'Eliminar',
                            onPress: () => this.deleteRound(item.id),
                            style: 'cancel',
                        },
                        { text: 'Cancelar', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            }}
            onPress={() => {
                this.props.navigation.navigate('ConfigureRound', { round: item });
            }}
            chevron
            bottomDivider
        />
    );

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getRounds();
        });
    }
    deleteRound(id) {
        const { navigation } = this.props;
        this.setState({
            isLoading: true
        });
        db.deleteRound(id).then((result) => {
            console.log(result);
            this.getRounds();
        }).catch((err) => {
            console.log(err);
            this.setState = {
                isLoading: false
            }
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
        if (this.state.rounds.length === 0) {
            return (
                <View>
                    <Text style={styles.message}>{this.state.notFound}</Text>
                </View>
            );
        }
        return (
            <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.rounds}
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
