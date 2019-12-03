import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Picker, ActivityIndicator, Button} from 'react-native';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class AddSingleNassauScreen extends Component {
  constructor(props) {
    super(props);
    if(props.navigation.getParam('single')) {
        let single = props.navigation.getParam('single');
        this.state = {
            indexMemberA: null,
            indexMemberB: null,
            member_b: single.member_b,
            member_a: single.member_a,
            member_a_id: single.member_a_id.toString(),
            member_b_id: single.member_b_id.toString(),
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
            isLoading: true,
            members: [],
        };
    }else {
        this.state = {
            indexMemberA: null,
            indexMemberB: null,
            member_b: '',
            member_a: '',
            member_a_id: '',
            member_b_id: '',
            manually_adv: 0,
            front9: '',
            match: '',
            back9: '',
            carry: '',
            auto_press_every: '',
            medal: '',
            manually_adv: 0,
            manually_adv_strokes: '',
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

    componentDidMount(){
        let members = [];
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        db.listMembersByRoundId(valueRound.id).then(data => {
            console.log('=============== MEMBERS ====================');
            console.log(data);
            console.log('=============== MEMBERS ====================');
            if (this.props.navigation.getParam('single')) {
                let single = this.props.navigation.getParam('single');
                let indexMemberA = data.findIndex( element => element.nick_name == single.member_a);
                let indexMemberB = data.findIndex(element => element.nick_name == single.member_b);
                console.log('=======================  INDEX MEMBER A ====================');
                console.log(indexMemberA);
                this.setState({
                    indexMemberA,
                    indexMemberB,
                    members: data,
                    isLoading: false,
                });
            }else {
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
        /* db.singleSettingsById(1).then(result => {
            console.log('================= SINGLE NASSAU SETTINGS ==================');
            console.log(result);
            this.setState({
                front9: result.front_9.toString(),
                match: result.match.toString(),
                back9: result.back_9.toString(),
                carry: result.carry.toString(),
                auto_press_every: result.automatic_presses_every.toString(),
                medal: result.medal.toString(),
            });
            console.log('=================== END SINGLE NASSAU SETTINGS ============');
        }).catch(error =>console.log(error))
        */
    }

    saveSingleNassau= () => {
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        const { member_a, member_b, member_a_id, member_b_id, manually_adv, front9, match, back9, carry, auto_press_every, medal, manually_adv_strokes, adv_strokes }=this.state;
        let data= {
            round_id: valueRound.id,
            member_a_id: member_a_id,
            member_b_id: member_b_id, 
            member_a: member_a, 
            member_b: member_b, 
            automatic_press_every: auto_press_every, 
            front_9: front9, 
            back_9: back9, 
            match: match, 
            carry: carry, 
            medal: medal, 
            adv_strokes: adv_strokes, 
            manually_override_adv: manually_adv, 
            manually_adv_strokes: manually_adv_strokes, 
            id_sync: null, 
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        console.log('==================== BET SINGLE NASSAU DATA ====================');
        console.log(data);
        
        db.addBetSingleNassau(data).then(result => {
            console.log('======================= ADD SINGLE NASSAU ===================');
            console.log(result);
            console.log('======================= END ADD SINGLE NASSAU ===================');
            if (result.rowsAffected > 0) {
                this.props.navigation.goBack();
            }
        }).catch(err => console.log(err))
        
    }

    updateBetSingle() {
        let single = this.props.navigation.getParam('single');
        const { member_a, member_b, member_a_id, member_b_id, manually_adv, front9, match, back9, carry, auto_press_every, medal, manually_adv_strokes, adv_strokes } = this.state;
        let data={
            id: single.id,
            member_a_id: member_a_id,
            member_b_id: member_b_id,
            member_a: member_a,
            member_b: member_b,
            automatic_press_every: auto_press_every,
            front_9: front9,
            back_9: back9,
            match: match,
            carry: carry,
            medal: medal,
            adv_strokes: adv_strokes,
            manually_override_adv: manually_adv,
            manually_adv_strokes: manually_adv_strokes,
            id_sync: null,
            ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss')
        } 

        db.updateBetSingleNassau(data).then(result => {
            console.log('======================= UPDATE SINGLE NASSAU ===================');
            console.log(result);
            console.log('======================= UPDATE ADD SINGLE NASSAU ===================');
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
                        onChangeText={(text) => this.setState({ front9: text})}
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
                <Text style={{flex: 1, textAlign: 'right', marginRight: 3}}>AUTO PRESS EVERY: </Text>
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
        <View style={styles.simpleRowContainer}>
            <View style={{ width: '45%', alignItems: 'center' }}>
                        <Text style={styles.labelPlayer}> PLAYER A </Text>
            </View>
            <View style={{ width: '10%', alignItems: 'center' }}/>
            <View style={{ width: '45%', alignItems: 'center' }}>
                <Text style={styles.labelPlayer}> PLAYER B </Text>
            </View>
        </View>
        <View style={[styles.simpleRowContainer, { alignItems: 'center' }]}>
        <View style={{ width: '45%', alignItems: 'center' }}>
            <Picker
                selectedValue={this.state.indexMemberA}
                style={{ height: 50, width: 120 }}
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
                        return(<Picker label={item.nick_name} value={index} />)
                    })
                }
            </Picker>
        </View>
        <View style={{ width: '10%', alignItems: 'center' }}>
            <Text>VS</Text>
        </View>
        <View style={{ width: '45%', alignItems: 'center' }}>
            <Picker
                selectedValue={this.state.indexMemberB}
                style={{ height: 50, width: 120 }}
                onValueChange={(itemValue, itemIndex) =>{
                    console.log('============= INDEX ================');
                    console.log(this.state.members[itemValue]);
                    console.log('============= END INDEX ================');
                    let adv_strokes = this.state.members[this.state.indexMemberA].handicap - this.state.members[itemValue].handicap;
                    db.singleSettingsById(this.state.members[itemValue].player_id).then(result => {
                        console.log('================= SINGLE NASSAU SETTINGS ==================');
                        console.log(result);
                        this.setState({
                            indexMemberB: itemValue,
                            member_b: this.state.members[itemValue].nick_name,
                            member_b_id: this.state.members[itemValue].id,
                            front9: result.front_9.toString(),
                            match: result.match.toString(),
                            back9: result.back_9.toString(),
                            carry: result.carry.toString(),
                            auto_press_every: result.automatic_presses_every.toString(),
                            medal: result.medal.toString(),
                            adv_strokes: adv_strokes,
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
        </View>
        <View style={{
            flex: 1
        }}/>
            <Button
                title="Guardar"
                color='#3e2465'
                onPress={() => {
                    if (this.props.navigation.getParam('single')){
                        this.updateBetSingle();
                    }else {
                        this.saveSingleNassau();
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
        width: 140,
        paddingVertical: 3,
        paddingHorizontal: 10,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
