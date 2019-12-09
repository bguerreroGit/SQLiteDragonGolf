import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Picker, ActivityIndicator, Button } from 'react-native';
import Database from '../Database';
import { ButtonGroup } from 'react-native-elements';
import moment from "moment";

const db = new Database();

export default class AddSingleNassauScreen extends Component {
    constructor(props) {
        super(props);
        this.buttons = ['Hi Hcp', 'Low Hcp', 'Each', 'Slid Hi', 'Slid Low'];
        if (props.navigation.getParam('single')) {
            let single = props.navigation.getParam('single');
            let indexButtons = this.buttons.indexOf(single.who_gets_the_adv_strokes);
            this.state = {
                indexMemberA: null,
                indexMemberB: null,
                indexMemberC: null,
                indexMemberD: null,
                indexButtons,
                member_b: single.member_b,
                member_a: single.member_a,
                member_c: single.member_c,
                member_d: single.member_d,
                member_a_id: single.member_a_id.toString(),
                member_b_id: single.member_b_id.toString(),
                member_c_id: single.member_c_id,
                member_d_id: single.member_d_id,
                manually_adv: single.manually_adv,
                front9: single.front_9.toString(),
                match: single.match.toString(),
                back9: single.back_9.toString(),
                carry: single.carry.toString(),
                auto_press_every: single.automatic_press_every.toString(),
                medal: single.medal.toString(),
                manually_adv: single.manually_override_adv.toString(),
                manually_adv_strokes: single.manually_adv_strokes.toString(),
                adv_strokes: single.adv_strokes.toString(),
                who_gets_the_adv_strokes: single.who_gets_the_adv_strokes,
                isLoading: true,
                members: [],
            };
        } else {
            this.state = {
                indexMemberA: null,
                indexMemberB: null,
                indexMemberC: null,
                indexMemberD: null,
                indexButtons: 2,
                member_b: '',
                member_a: '',
                member_c: '',
                member_d: '',
                member_a_id: '',
                member_b_id: '',
                member_c_id: '',
                member_d_id: '',
                manually_adv: 0,
                front9: '',
                match: '',
                back9: '',
                carry: '',
                auto_press_every: '',
                medal: '',
                manually_adv: 0,
                manually_adv_strokes: '',
                who_gets_the_adv_strokes: 'Each',
                adv_strokes: '0.0',
                isLoading: true,
                members: [],
            };
        }

    }

    toggleSwitch = (value) => {
        let sw = value == true ? 1 : 0;
        this.setState({
            manually_adv: sw
        });
    }

    componentDidMount() {
        let members = [];
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        db.listMembersByRoundId(valueRound.id).then(data => {
            console.log('=============== MEMBERS ====================');
            console.log(data);
            console.log('=============== MEMBERS ====================');
            if (this.props.navigation.getParam('single')) {
                let single = this.props.navigation.getParam('single');
                let indexMemberA = data.findIndex(element => element.nick_name == single.member_a);
                let indexMemberB = data.findIndex(element => element.nick_name == single.member_b);
                let indexMemberC = data.findIndex(element => element.nick_name == single.member_c)
                console.log('=======================  INDEX MEMBER A ====================');
                console.log(indexMemberA);
                this.setState({
                    indexMemberA,
                    indexMemberB,
                    indexMemberC,
                    members: data,
                    isLoading: false,
                });
            } else {
                this.setState({
                    members: data,
                    isLoading: false,
                });
            }
        })
            .catch(err => {
                console.log(err);
                this.setState = {
                    isLoading: false,
                };
            });
    }

    updateIndex= (selectedIndex) => {
        this.setState({
            indexButtons: selectedIndex,
            who_gets_the_adv_strokes: this.buttons[selectedIndex],
        });
    }

    saveTeamNassau = () => {
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        const { member_a, member_b, member_c, member_d, member_a_id, member_b_id, member_c_id, member_d_id, manually_adv, front9, match, back9, carry, auto_press_every, medal, manually_adv_strokes, adv_strokes, who_gets_the_adv_strokes } = this.state;
        let data = {
            round_id: valueRound.id,
            member_a_id: member_a_id,
            member_b_id: member_b_id,
            member_c_id: member_c_id,
            member_d_id: member_d_id,
            member_a: member_a,
            member_b: member_b,
            member_c: member_c,
            member_d: member_d,
            automatic_press_every: auto_press_every,
            front_9: front9,
            back_9: back9,
            match: match,
            carry: carry,
            medal: medal,
            adv_strokes: adv_strokes,
            manually_override_adv: manually_adv,
            manually_adv_strokes: manually_adv_strokes,
            who_gets_the_adv_strokes: who_gets_the_adv_strokes,
            id_sync: null,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        console.log('==================== BET TEAM NASSAU DATA ====================');
        console.log(data);

        db.addBetTeamNassau(data).then(result => {
            console.log('======================= ADD TEAM NASSAU ===================');
            console.log(result);
            console.log('======================= END ADD TEAM NASSAU ===================');
            if (result.rowsAffected > 0) {
                //this.props.navigation.goBack();
            }
        }).catch(err => console.log(err))

    }

    updateBetSingle() {
        let single = this.props.navigation.getParam('single');
        const { member_a, member_b, member_c, member_d, member_a_id, member_b_id, member_c_id, member_d_id, manually_adv, front9, match, back9, carry, auto_press_every, medal, manually_adv_strokes, adv_strokes, who_gets_the_adv_strokes } = this.state;
        let data = {
            id: single.id,
            member_a_id: member_a_id,
            member_b_id: member_b_id,
            member_c_id: member_c_id,
            member_d_id: member_d_id,
            member_a: member_a,
            member_b: member_b,
            member_c: member_c,
            member_d: member_d,
            automatic_press_every: auto_press_every,
            front_9: front9,
            back_9: back9,
            match: match,
            carry: carry,
            medal: medal,
            adv_strokes: adv_strokes,
            manually_override_adv: manually_adv,
            manually_adv_strokes: manually_adv_strokes,
            who_gets_the_adv_strokes: who_gets_the_adv_strokes,
            id_sync: null,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        db.updateBetTeamNassau(data).then(result => {
            console.log('======================= UPDATE TEAM NASSAU ===================');
            console.log(result);
            console.log('======================= UPDATE TEAM NASSAU ===================');
            if (result.rowsAffected > 0) {
                this.props.navigation.goBack();
            }
        }).catch(err => console.log(err))
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text>FRONT NINE $ </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'front 9'}
                            value={this.state.front9}
                            onChangeText={(text) => this.setState({ front9: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>MATCH $ </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'match'}
                            value={this.state.match}
                            onChangeText={(text) => this.setState({ match: text })}
                        />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text>BACK NINE $ </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'back 9'}
                            value={this.state.back9}
                            onChangeText={(text) => this.setState({ back9: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>CARRY $ </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'carry'}
                            value={this.state.carry}
                            onChangeText={(text) => this.setState({ carry: text })}
                        />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={{ flex: 1, textAlign: 'right', marginRight: 3 }}>AUTO PRESS EVERY: </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'press'}
                            value={this.state.auto_press_every}
                            onChangeText={(text) => this.setState({ auto_press_every: text })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>MEDAL $ </Text>
                        <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'medal'}
                            value={this.state.medal}
                            onChangeText={(text) => this.setState({ medal: text })}
                        />
                    </View>
                </View>
                <View style={{
                    alignItems: 'flex-end',
                    marginBottom: 15
                }}>
                    <View style={styles.advStrokesContainer}>
                        <Text>Advantage Strokes:  </Text>
                        <Text style={styles.textAdvStrokes}>{this.state.adv_strokes}</Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginBottom: 15,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={styles.simpleRowContainer}>
                        <Text>Manually Override Advantage</Text>
                        <Switch
                            onValueChange={(value) => this.toggleSwitch(value)}
                            value={this.state.manually_adv == 1 ? true : false} />
                    </View>
                    {
                        this.state.manually_adv == 1 ? <TextInput
                            style={[styles.input, { width: 60 }]}
                            placeholder={'strokes'}
                            value={this.state.manually_adv_strokes}
                            onChangeText={(text) => this.setState({ manually_adv_strokes: text })}
                        /> : null
                    }

                </View>
                <ButtonGroup
                    selectedButtonStyle={{ backgroundColor: '#000000' }}
                    onPress={this.updateIndex}
                    selectedIndex={this.state.indexButtons}
                    buttons={this.buttons}
                    containerStyle={{ height: 30 }}
                />
                <View style={styles.simpleRowContainer}>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                        <Text style={styles.labelPlayer}> PLAYER </Text>
                    </View>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                        <Text style={styles.labelPlayer}> PLAYER </Text>
                    </View>
                    <View style={{ width: '10%', alignItems: 'center' }} />
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                        <Text style={styles.labelPlayer}> PLAYER </Text>
                    </View>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                        <Text style={styles.labelPlayer}> PLAYER </Text>
                    </View>
                </View>
                <View style={[styles.simpleRowContainer, { alignItems: 'center' }]}>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                    <Text>{this.state.member_a}</Text>
                        <Picker
                            selectedValue={this.state.indexMemberA}
                            style={{ height: 50, width: 60 }}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log('============= INDEX ================');
                                console.log(this.state.members[itemValue]);
                                console.log('============= END INDEX ================');
                                this.setState({
                                    member_a_id: this.state.members[itemValue].id,
                                    member_a: this.state.members[itemValue].nick_name,
                                    indexMemberA: itemValue
                                });
                            }}>
                            <Picker label={'----'} value={null} />
                            {
                                this.state.members.map((item, index) => {
                                    return (<Picker label={item.nick_name} value={index} />)
                                })
                            }
                        </Picker>
                    </View>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                        <Text>{this.state.member_b}</Text>
                        <Picker
                            selectedValue={this.state.indexMemberB}
                            style={{ height: 50, width: 60 }}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log('============= INDEX ================');
                                console.log(this.state.members[itemValue]);
                                console.log('============= END INDEX ================');
                                this.setState({
                                    member_b_id: this.state.members[itemValue].id,
                                    member_b: this.state.members[itemValue].nick_name,
                                    indexMemberB: itemValue
                                });
                            }}>
                            <Picker label={'----'} value={null} />
                            {
                                this.state.members.map((item, index) => {
                                    return (<Picker label={item.nick_name} value={index} />)
                                })
                            }
                        </Picker>
                    </View>
                    <View style={{ width: '10%', alignItems: 'center' }}>
                        <Text>VS</Text>
                    </View>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                    <Text>{this.state.member_c}</Text>
                        <Picker
                            selectedValue={this.state.indexMemberC}
                            style={{ height: 50, width: 60 }}
                            onValueChange={(itemValue, itemIndex) => {
                                db.singleSettingsById(this.state.members[itemValue].player_id).then(result => {
                                    console.log('================= SINGLE NASSAU SETTINGS ==================');
                                    console.log(result);
                                    this.setState({
                                        indexMemberC: itemValue,
                                        member_c: this.state.members[itemValue].nick_name,
                                        member_c_id: this.state.members[itemValue].id,
                                    });
                                    console.log('=================== END SINGLE NASSAU SETTINGS ============');
                                }).catch(error => console.log(error))
                            }}>
                            <Picker label={'----'} value={null} />
                            {
                                this.state.members.map((item, index) => {
                                    return (<Picker label={item.nick_name} value={index} />)
                                })
                            }
                        </Picker>
                    </View>
                    <View style={{ width: '22.5%', alignItems: 'center' }}>
                    <Text>{this.state.member_d}</Text>
                        <Picker
                            selectedValue={this.state.indexMemberD}
                            style={{ height: 50, width: 60 }}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log('============= DATA MEMBER A ================');
                                console.log(this.state.members[this.state.indexMemberA].handicap);
                                console.log('============= DATA MEMBER B ================');
                                console.log(this.state.members[this.state.indexMemberB].handicap);
                                console.log('============= DATA MEMBER C ================');
                                console.log(this.state.members[this.state.indexMemberC].handicap);
                                console.log('============= DATA MEMBER D ================');
                                console.log(this.state.members[itemValue].handicap);
                                let adv_strokes = this.state.members[this.state.indexMemberA].handicap - this.state.members[this.state.indexMemberC].handicap;
                                console.log('======================= FIRS STROKES =============');
                                console.log(adv_strokes);
                                adv_strokes += this.state.members[this.state.indexMemberA].handicap - this.state.members[itemValue].handicap;
                                console.log('======================= SECOND STROKES =============');
                                console.log(adv_strokes);
                                adv_strokes += this.state.members[this.state.indexMemberB].handicap - this.state.members[this.state.indexMemberC].handicap;
                                console.log('======================= THIRD STROKES =============');
                                adv_strokes += this.state.members[this.state.indexMemberB].handicap - this.state.members[itemValue].handicap;
                                console.log('======================= FOUR STROKES =============');
                                console.log(adv_strokes);
                                adv_strokes= adv_strokes/2
                                    this.setState({
                                        indexMemberD: itemValue,
                                        member_d: this.state.members[itemValue].nick_name,
                                        member_d_id: this.state.members[itemValue].id,
                                        adv_strokes: adv_strokes.toFixed(0),
                                    });
                                    console.log('=================== END SINGLE NASSAU SETTINGS ============');
                            }}>
                            <Picker label={'----'} value={null} />
                            {
                                this.state.members.map((item, index) => {
                                    return (<Picker label={item.nick_name} value={index} />)
                                })
                            }
                        </Picker>
                    </View>
                </View>
                <View style={{
                    flex: 1
                }} />
                <Button
                    title="Guardar"
                    color='#3e2465'
                    onPress={() => {
                        if (this.props.navigation.getParam('single')) {
                            this.updateBetSingle();
                        } else {
                            this.saveTeamNassau();
                        }
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 30,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    inputContainer: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    input: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        textAlign: 'center',
        borderRadius: 4
    },
    advStrokesContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textAdvStrokes: {
        backgroundColor: 'lightgray',
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius: 3,
        width: 50
    },
    simpleRowContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    labelPlayer: {
        backgroundColor: 'black',
        paddingVertical: 3,
        paddingHorizontal: 2,
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
