import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class EditarCampoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            par: '',
            hole_number: '',
            adv: '',
            handicap: '',
            handicap_damas: '',
            course_id: '',
            id_sync: '',
            ultimate_sync: '',
            isLoading: false,
        };
    }
    static navigationOptions = {
        title: 'Editar Campo',
    };

    componentDidMount() {
        const { navigation } = this.props;
        db.holeById(navigation.getParam('id')).then((data) => {
            console.log(data);
            const hole = data;
            this.setState({
                id: hole.id,
                par: hole.par,
                hole_number: hole.hole_number,
                adv: hole.adv,
                handicap: hole.handicap,
                handicap_damas: hole.handicap_damas,
                course_id: hole.course_id,
                id_sync: hole.id_sync,
                ultimate_sync: hole.ultimate_sync,
                isLoading: false,
            });
        }).catch((err) => {
            console.log(err);
            this.setState = {
                isLoading: false
            }
        })
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    updateCourse() {
        this.setState({
            isLoading: true,
        });
        const { navigation } = this.props;
        let data = {
            par: this.state.par,
            hole_number: this.state.hole_number,
            adv: this.state.adv,
            handicap: this.state.handicap,
            handicap_damas: this.state.handicap_damas,
            course_id: this.state.course_id,
            id_sync: this.state.id_sync,
            ultimate_sync: this.state.ultimate_sync,
        };

        db.updateHole(this.state.id, data).then((result) => {
            console.log(result);
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
                        value={this.state.par.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'par')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Hole Number'}
                        value={this.state.hole_number.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'hole_number')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Adv'}
                        value={this.state.adv.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'adv')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Handicap'}
                        value={this.state.handicap.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'handicap')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Handicap Damas'}
                        value={this.state.handicap_damas.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'handicap_damas')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Course ID'}
                        value={this.state.course_id.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'course_id')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Id Sync'}
                        value={this.state.id_sync.toString()}
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
                        onPress={() => this.updateCourse()} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    subContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginBottom: 60,
    },
})