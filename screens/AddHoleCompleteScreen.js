import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class AddHoleCompleteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            par: '',
            hole_number: '',
            adv: '',
            handicap: '',
            handicap_damas: '',
            course_id: props.navigation.state.params.courseId.toString(),
            id_sync: null,
            isLoading: false,
        };
    }
    static navigationOptions = {
        title: 'Agregar Hole',
    };

    updateTextInput = (text, field) => {
        const state = this.state;
        state[field] = text;
        this.setState(state);
    }
    saveHole() {
        this.setState({
            isLoading: true,
        });
        let data = {
            par: this.state.par,
            hole_number: this.state.hole_number,
            adv: this.state.adv,
            handicap: this.state.handicap,
            handicap_damas: this.state.handicap_damas,
            course_id: this.state.course_id,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        db.addHole(data).then((result) => {
            console.log(result);
            //Alert.alert(JSON.stringify(result));
            this.setState({
                isLoading: false,
            });
            this.props.navigation.state.params.onNavigateBack;
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
                        placeholder={'Par'}
                        value={this.state.par}
                        onChangeText={(text) => this.updateTextInput(text, 'par')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Hole Number'}
                        value={this.state.hole_number}
                        onChangeText={(text) => this.updateTextInput(text, 'hole_number')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Adv'}
                        value={this.state.adv}
                        onChangeText={(text) => this.updateTextInput(text, 'adv')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Handicap'}
                        value={this.state.handicap}
                        onChangeText={(text) => this.updateTextInput(text, 'handicap')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Handicap Damas'}
                        value={this.state.handicap_damas}
                        onChangeText={(text) => this.updateTextInput(text, 'handicap_damas')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Course ID'}
                        value={this.state.course_id}
                        onChangeText={(text) => this.updateTextInput(text, 'course_id')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Id Sync'}
                        value={this.state.id_sync}
                        onChangeText={(text) => this.updateTextInput(text, 'id_sync')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Ultimate Sync'}
                        value={this.state.ultimate_sync}
                        onChangeText={(text) => this.updateTextInput(text, 'ultimate_sync')}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Save'
                        onPress={() => this.saveHole()} />
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