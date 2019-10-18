/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class AddTeeCompleteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            color: '',
            rating: '',
            slope: '',
            holes: [],
            course_id: props.navigation.state.params.courseId.toString(),
            id_sync: null,
            isLoading: false,
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Tees Complete'
        };
    };

    componentDidMount(){
    }

    updateTextInput = (text, field) => {
        const state = this.state;
        state[field] = text;
        this.setState(state);
    }
    saveTee() {
        this.setState({
            isLoading: true,
        });
        let data = {
            name: this.state.name,
            color: this.state.color,
            rating: this.state.rating,
            slope: this.state.slope,
            course_id: this.state.course_id,
            id_sync: this.state.id_sync,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        db.addTee(data).then((result) => {
            console.log('========================= ADD TEE ======================');
            console.log(result);
            console.log('========================= END ADD TEE ======================');
            Alert.alert(
                'Guardado Exitoso',
                'El tee se ha guradado de manera correcta',
            );
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
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Name'}
                        value={this.state.name}
                        onChangeText={(text) => this.updateTextInput(text, 'name')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Color'}
                        value={this.state.color}
                        onChangeText={(text) => this.updateTextInput(text, 'color')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Rating'}
                        value={this.state.rating}
                        onChangeText={(text) => this.updateTextInput(text, 'rating')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Slope'}
                        value={this.state.slope}
                        onChangeText={(text) => this.updateTextInput(text, 'slope')}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Save'
                        onPress={() => this.saveTee()} />
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