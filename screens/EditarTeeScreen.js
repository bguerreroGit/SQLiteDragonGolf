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
            name: '',
            color: '',
            rating: '',
            slope: '',
            course_id: '',
            id_sync: '',
            ultimate_sync: '',
            isLoading: false,
        };
    }
    static navigationOptions = {
        title: 'Editar Tee',
    };

    componentDidMount() {
        const { navigation } = this.props;
        db.teeById(navigation.getParam('id')).then((data) => {
            console.log(data);
            const tee = data;
            this.setState({
                id: tee.id,
                name: tee.name,
                color: tee.color,
                rating: tee.rating,
                slope: tee.slope,
                course_id: tee.course_id,
                id_sync: tee.id_sync,
                ultimate_sync: tee.ultimate_sync,
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

    updateTee() {
        this.setState({
            isLoading: true,
        });
        const { navigation } = this.props;
        let data = {
            name: this.state.name,
            color: this.state.color,
            rating: this.state.rating,
            slope: this.state.slope,
            course_id: this.state.course_id,
            id_sync: this.state.id_sync,
            ultimate_sync: this.state.ultimate_sync,
        };

        db.updateTee(this.state.id, data).then((result) => {
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
                        value={this.state.rating.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'rating')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Slope'}
                        value={this.state.slope.toString()}
                        onChangeText={(text) => this.updateTextInput(text, 'slope')}
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
                        onPress={() => this.updateTee()} />
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