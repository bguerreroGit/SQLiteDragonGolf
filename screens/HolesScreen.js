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

export default class HolesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            holes: [],
            notFound:
                'Holes no encontrados.\nPorfavor seleccione (+) boton para agregar alguno.',
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Lista de Hoyos',
            headerRight: (
                <Button
                    buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
                    onPress={() => {
                        navigation.navigate('AddHole', {
                            onNavigateBack: this.handleOnNavigateBack,
                        });
                    }}
                />
            ),
        };
    };

    getHoles() {
        let holes = [];
        db.listHole()
            .then(data => {
                holes = data;
                console.log('Hoyos********************');
                //Alert.alert(JSON.stringify(holes));
                this.setState({
                    holes,
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
            title={"Es el hoyo " + item.hole_number}
            subtitle={"Es par " + item.par}
            leftIcon={{ name: 'check-circle' }}
            onPress={() => {
                this.props.navigation.navigate('DetallesHole', {
                    id: `${item.id}`,
                });
            }}
            chevron
            bottomDivider
        />
    );

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getHoles();
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
        if (this.state.holes.length === 0) {
            return (
                <View>
                    <Text style={styles.message}>{this.state.notFound}</Text>
                </View>
            );;
        }
        return (
            <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.holes}
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
