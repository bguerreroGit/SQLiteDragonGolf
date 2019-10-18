import React, { Component } from 'react';
import { Alert, ScrollView, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class DetallesCampoScreen extends Component {
    static navigationOptions = {
        title: 'Detalles del hole',
    };

    constructor() {
        super();
        this.state = {
            isLoading: true,
            hole: {},
            id: '',
        };
    }

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            const { navigation } = this.props;
            db.holeById(navigation.getParam('id')).then((data) => {
                console.log(data);
                let hole = data;
                this.setState({
                    hole,
                    isLoading: false,
                    id: hole.id
                });
            }).catch((err) => {
                console.log(err);
                this.setState = {
                    isLoading: false
                }
            })
        });
    }

    deleteHole(id) {
        const { navigation } = this.props;
        this.setState({
            isLoading: true
        });
        db.deleteHole(id).then((result) => {
            console.log(result);
            this.props.navigation.goBack();
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
            )
        }
        return (
            <ScrollView>
                <Card style={styles.container}>
                    <View style={styles.subContainer}>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole ID: {this.state.hole.id}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole PAR: {this.state.hole.par}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole Number: {this.state.hole.hole_number}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole ADV: {this.state.hole.adv}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole HANDICAP: {this.state.hole.handicap}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole HANDICAP DAMAS: {this.state.hole.handicap_damas}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole COURSE ID: {this.state.hole.course_id}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole ID SYNC: {this.state.hole.id_sync}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 16 }}>Hole ULTIMATE SYNC: {this.state.hole.ultimate_sync}</Text>
                        </View>
                    </View>
                    <View style={styles.detailButton}>
                        <Button
                            large
                            backgroundColor={'#CCCCCC'}
                            leftIcon={{ name: 'edit' }}
                            title='Edit'
                            onPress={() => {
                                this.props.navigation.navigate('EditarHole', {
                                    id: `${this.state.id}`,
                                });
                            }} />
                    </View>
                    <View style={styles.detailButton}>
                        <Button
                            large
                            backgroundColor={'#999999'}
                            color={'#FFFFFF'}
                            leftIcon={{ name: 'delete' }}
                            title='Delete'
                            onPress={() => this.deleteHole(this.state.id)} />
                    </View>
                </Card>
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
        paddingBottom: 20,
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
    detailButton: {
        marginTop: 10
    }
})