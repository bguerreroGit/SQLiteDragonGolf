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

export default class TeesCompleteScreen extends Component {
    constructor(props) {
        super(props);
        const { courseId } = this.props.navigation.state.params;
        this.state = {
            isLoading: true,
            tees: [],
            holes: [],
            notFound:
                'Tees no encontrados.\nPorfavor seleccione (+) boton para agregar alguno.',
        };
        console.log('============================== COURSE ID =============================');
        console.log('course Id: ', courseId)
        console.log('============================== END COURSE ID =============================');
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Lista de Tees',
            headerRight: (
                <Button
                    buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
                    onPress={() => {
                        navigation.navigate('AddTeeComplete', {
                            courseId: navigation.state.params.courseId,
                        });
                    }}
                />
            ),
        };
    };

    getTees() {
        let tees = [];
        const {courseId}=this.props.navigation.state.params;
        db.listTeeByCourseId(courseId)
            .then(data => {
                tees = data;
                console.log('Tees********************');
                //Alert.alert(JSON.stringify(holes));
                this.setState({
                    tees,
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
            title={"Tee " + item.name}
            subtitle={"Color " + item.color}
            leftIcon={{ name: 'check-circle' }}
            onPress={() => {
                this.props.navigation.navigate('ConfigureHoles', {
                    tee: item,
                    courseId: this.props.navigation.state.params.courseId,
                });
            }}
            chevron
            bottomDivider
        />
    );

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getTees();
        });
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        if (this.state.tees.length === 0) {
            return (
                <View>
                    <Text style={styles.message}>{this.state.notFound}</Text>
                </View>
            );
        }
        return (
            <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.tees}
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
