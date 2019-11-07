/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Switch, Alert, Text, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class AddRoundScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            course_id: '',
            hcp_adjustment: '',
            online_key: '',
            starting_hole: '',
            adv_b9_f9: 0,
            id_sync: null,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
            isLoading: false,
            courses: [],
        };
    }
    static navigationOptions = {
        title: 'Agregar Ronda',
    };

    componentDidMount() {
        let courses=[];
        db.listCourse().then(result => {
            console.log('======================= RESULTADO: ============================');
            console.log(result);
            result.forEach(element => {
                courses.push({
                    value: element.name,
                    id: element.id
                })
            });
            console.log('======================= RESULTADO: ============================');
            console.log(courses);
            this.setState({
                courses: courses
            });
        }).catch(error => {
            console.log(error);
        })
    }

    updateTextInput = (text, field) => {
        const state = this.state;
        state[field] = text;
        this.setState(state);
    }
    saveRound() {
        this.setState({
            isLoading: true,
        });
        let data = {
            name: this.state.name,
            course_id: this.state.course_id,
            hcp_adjustment: this.state.hcp_adjustment,
            online_key: this.state.online_key,
            starting_hole: this.state.starting_hole,
            adv_b9_f9: this.state.adv_b9_f9,
            id_sync: this.state.id_sync,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        console.log('================== DATA ====================================');
        console.log(data);
        console.log('================== FINAL DE DATA ====================================');

        db.addRound(data).then((result) => {
            console.log('================== COURSE ====================================');
            console.log(result);
            // Alert.alert('ID DE COURSE: ', result.insertId);
            console.log('================== FINAL DE COURSE ====================================');
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
    }

    toggleSwitch = (value) => {
        let sw= value == true ? 1 : 0;
        this.setState({
            adv_b9_f9: sw
        });
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
                <View style={[styles.subContainer, {
                    borderBottomWidth: 0,
                    }]}>
                    <Dropdown
                        label='Campo'
                        data={this.state.courses}
                        onChangeText={(value, index) => {
                            this.setState({
                                course_id: this.state.courses[index].id
                            });
                        }}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Handicap auto adjustment'}
                        value={this.state.hcp_adjustment}
                        onChangeText={(text) => this.updateTextInput(text, 'hcp_adjustment')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Online key'}
                        value={this.state.online_key}
                        onChangeText={(text) => this.updateTextInput(text, 'online_key')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        placeholder={'Starting Hole'}
                        value={this.state.starting_hole}
                        onChangeText={(text) => this.updateTextInput(text, 'starting_hole')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>
                            Switch Adv B9/F9
                        </Text>
                        <Switch
                            onValueChange={(value) => this.toggleSwitch(value)}
                            value={this.state.adv_b9_f9 == 1 ? true : false} />
                    </View>
                </View>
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Save'
                        onPress={() => this.saveRound()} />
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