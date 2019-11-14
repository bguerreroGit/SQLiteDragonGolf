import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { ButtonGroup, Button } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

class ScoreHoleTwelveScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: null,
            score: '',
            isLoading: true,
            members: []
        };
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Hole 12',
            headerRight: (
                <Button
                    buttonStyle={{ padding: 0, backgroundColor: 'transparent', marginRight: 15 }}
                    title='Hole 13'
                    onPress={() => {
                        navigation.navigate('Hole_13', {
                            onNavigateBack: this.handleOnNavigateBack,
                        });
                    }}
                />
            ),
        };
    };

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getMembers();
        });
    }
    getMembers() {
        let members = [];
        this.setState({
            isLoading: true
        });
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        db.listMembersByRoundIdHole(12, valueRound.id).then(data => {
            console.log('=============== MEMBERS Score====================');
            console.log(data);
            members = data;
            console.log('=============== MEMBERS Score====================');
            this.setState({
                members: data,
                isLoading: false,
            });
        })
            .catch(err => {
                console.log(err);
                this.setState = {
                    members,
                    isLoading: false,
                };
            });
    }

    updateScoreText = (text, index) => {
        const members = this.state.members;
        members[index].strokes_h12 = text;
        members[index].ultimate_sync = moment().format('YYYY-MM-DD HH:mm:ss');
        db.updateScoreMemberInHole(12, members[index]).then(result => {
            console.log('Resultado Score hole 12: ', result);
        });
        this.setState({
            members,
        });
    }

    updateScore = (selectedIndex, index) => {
        let score = 0;
        const members = this.state.members;
        if (members[index].strokes_h12 !== '') {
            score = parseInt(members[index].strokes_h12);
        }
        if (selectedIndex == 0 && score > 0) {
            score -= 1;
        }
        if (selectedIndex == 1) {
            score = members[index].hole.par;
            //console.log('HOLE: ', members[index].hole);
        }
        if (selectedIndex == 2) {
            score += 1;
        }
        members[index].strokes_h12 = score.toString();
        members[index].selectedIndex = selectedIndex;
        db.updateScoreMemberInHole(12, members[index]).then(result => {
            console.log('Resultado Score hole 12: ', result);
        });
        this.setState({
            members
        });
    }


    render() {
        const buttons = ['BIRDIE', 'PAR', 'BOGY'];
        const { members } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {
                    this.state.isLoading == true ? <View style={styles.activity}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View> :
                        members.map((member, index) => {
                            return (
                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}
                                >
                                    <Text>{member.player.nick_name} </Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={'Score'}
                                        value={this.state.members[index].strokes_h12}
                                        onChangeText={(text) => this.updateScoreText(text, index)}
                                    />
                                    <ButtonGroup
                                        selectedButtonStyle={{ backgroundColor: '#000000' }}
                                        onPress={(selectedIndex) => this.updateScore(selectedIndex, index)}
                                        selectedIndex={this.state.members[index].selectedIndex}
                                        buttons={buttons}
                                        containerStyle={{ height: 40, width: 160 }}
                                    />
                                </View>
                            )
                        })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        width: 50,
        textAlign: 'center'
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
});

export default ScoreHoleTwelveScreen;