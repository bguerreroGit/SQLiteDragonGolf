import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Database from '../Database';
import moment from "moment";

const db = new Database();

class ScoreCardScreen extends Component {
  constructor(props) {
    super(props);
      /*let valueRound = props.navigation.dangerouslyGetParent().state.params.round;
      console.log('################################# RONDA ###############################');
      console.log(props.navigation.dangerouslyGetParent().state.params.round);*/
    this.state = {
      isLoading: true,
      members: [],
      round: null
    };
  }

    static navigationOptions = ({ navigation }) => {
        let valueRound = navigation.dangerouslyGetParent().state.params.round;
        return {
            title: 'Score Card: ' + valueRound.name,
        };
    };

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getMembers();
    });
  }
  async getMembers(){
    this.setState({
      isLoading: true
    });
    let i=0;
    let members=[];
    let front9=[];
    let back9=[];
    let startIndexFont9=null;
    let endIndexFont9=null;
    let startIndexBack9 = null;
    let endIndexBack9= null;
    let advStrokes = [];
    let auxHandicapCampo = null;
    let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
    let round= await db.roundById(valueRound.id);
    
    db.listMembersByRoundIdJOIN(valueRound.id).then(result => {
      console.log('============================================== RONDA ==================================');
      console.log(round);
      console.log('============================================== RONDA ==================================');
      //console.log(result);
      members=result;
      for (let index = 0; index < members.length; index++) {
        advStrokes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        i=0;
        front9=[];
        back9=[];
        auxHandicapCampo = members[index].handicap;
        auxHandicapCampo = (auxHandicapCampo * round.hcp_adjustment).toFixed(0);
        console.log('***** HANDICAP AJUSTADO: ', auxHandicapCampo);
        while (auxHandicapCampo > 0) {
          advStrokes[i] = advStrokes[i] + 1;
          auxHandicapCampo = auxHandicapCampo - 1;
          i++;
          if (i == 18) {
            i = 0;
          }
        }
        console.log('===================== ADVANTAGE STROKES ===================');
        console.log(advStrokes);
        members[index].advStrokes=advStrokes;
        console.log('============== MEMBERS ============');
        console.log(members[index]);
        console.log('================= FRONT 9 ================');
        if(round.starting_hole<=10){
          if (round.starting_hole == 10) {
            back9 = members[index].holes.slice(0, 9);
            console.log('====================== BACK 9 ===================');
            console.log(back9);
          } else {
            startIndexFont9 = round.starting_hole - 1;
            console.log('Inicio FRONT 9: ', startIndexFont9);
            endIndexFont9 = startIndexFont9 + 9;
            console.log('Fin FRONT 9: ', endIndexFont9);
            front9 = members[index].holes.slice(startIndexFont9, endIndexFont9);
            console.log(front9);
            startIndexBack9= endIndexFont9;
            console.log('Inicio END 9: ', startIndexBack9);
            endIndexBack9 = 18;
            console.log('Fin FRONT 9: ', endIndexBack9);
            back9 = members[index].holes.slice(startIndexBack9, endIndexBack9);
            back9 = back9.concat(members[index].holes.slice(0, startIndexFont9));
            console.log(back9);
          }
        }else {
            startIndexFont9 = round.starting_hole - 1;
            console.log('Inicio FRONT 9: ', startIndexFont9);
            front9 = members[index].holes.slice(startIndexFont9, 18);
            endIndexFont9= 9 - front9.length;
            console.log('Fin FRONT 9: ', endIndexFont9);
            front9 = front9.concat(members[index].holes.slice(0, endIndexFont9));
            console.log(front9);
            startIndexBack9 = endIndexFont9;
            console.log('Inicio END 9: ', startIndexBack9);
            endIndexBack9 = startIndexBack9 + 9;
            console.log('Fin FRONT 9: ', endIndexBack9);
            back9 = members[index].holes.slice(startIndexBack9, endIndexBack9);
            console.log(back9); 
        }
        members[index].front9=front9;
        members[index].back9=back9;
        
      }
     
      this.setState({
        members: members,
        round: round,
        isLoading: false
      });
    }).catch(err => console.log(err))
  }
  getTotalStrokes(holes, advStrokes){
    let total=0;
    let strokes=0;
    holes.forEach(hole => {
      strokes = hole.strokes == undefined || hole.strokes == null ? 0 : (hole.strokes - advStrokes[(hole.adv - 1)]);
      total += strokes;
      //console.log('Hole: ', hole);
    });
    return total;
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
        {
          this.state.members.map((item, index) => {
            return (
              <View>
                <View style={{ padding: 5 }}>
                  <View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'gray' }}>
                      <View style={{ width: 40}}>
                        <Text>Hole </Text>
                        <Text>Par </Text>
                      </View>
                      {
                        item.front9.map(hole => {
                          return (
                            <View style={{ backgroundColor: 'white', width: 25, margin: 1}}>
                              <Text style={{textAlign: 'center'}}>{hole.hole_number} </Text>
                              <Text style={{textAlign: 'right'}}>{hole.par} </Text>
                            </View>
                          );
                        })
                      }
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 40}}>
                          <Text>{item.nick_name}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                              backgroundColor: item.tee.color,
                              width: 5,
                              height: 5
                            }}></View>
                            <Text style={{
                              fontSize: 12
                            }}> {(item.handicap * this.state.round.hcp_adjustment).toFixed(0)}</Text>
                          </View>
                        </View>
                        {
                          item.front9.map(hole => {
                            return (
                              <View style={{ margin: 1, width: 25 }}>
                                <Text style={{fontSize: 8, color: 'gray', textAlign: 'center'}}>{hole.adv} </Text>
                                <View style={{borderWidth: 1, borderColor: 'back'}}>
                                  <Text style={{ textAlign:'center' }}>{hole.strokes}</Text>
                                  <Text style={{fontSize: 8, color: 'red', textAlign: 'right'}}>{item.advStrokes[(hole.adv - 1)]}</Text>
                                </View>
                              </View>
                            );
                          })
                        }
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                          <Text style={{fontWeight: 'bold'}}>{this.getTotalStrokes(item.front9, item.advStrokes)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ padding: 5 }}>
                  <View>
                    <View style={{ flexDirection: 'row', backgroundColor: 'gray' }}>
                      <View style={{ width: 40 }}>
                        <Text>Hole </Text>
                        <Text>Par </Text>
                      </View>
                      {
                        item.back9.map(hole => {
                          return (
                            <View style={{ backgroundColor: 'white', width: 25, margin: 1 }}>
                              <Text style={{ textAlign: 'center' }}>{hole.hole_number} </Text>
                              <Text style={{ textAlign: 'right' }}>{hole.par} </Text>
                            </View>
                          );
                        })
                      }
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 40 }}>
                          <Text>{item.nick_name}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                              backgroundColor: item.tee.color,
                              width: 5,
                              height: 5
                            }}></View>
                            <Text style={{
                              fontSize: 12
                            }}> {(item.handicap * this.state.round.hcp_adjustment).toFixed(0)}</Text>
                          </View>
                        </View>
                        {
                          item.back9.map(hole => {
                            return (
                              <View style={{ margin: 1, width: 25 }}>
                                <Text style={{ fontSize: 8, color: 'gray', textAlign: 'center' }}>{hole.adv} </Text>
                                <View style={{ borderWidth: 1, borderColor: 'back' }}>
                                  <Text style={{ textAlign: 'center' }}>{hole.strokes}</Text>
                                  <Text style={{ fontSize: 8, color: 'red', textAlign: 'right' }}>{item.advStrokes[(hole.adv - 1)]}</Text>
                                </View>
                              </View>
                            );
                          })
                        }
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                          <Text style={{ fontWeight: 'bold' }}>{this.getTotalStrokes(item.back9, item.advStrokes)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })

        }
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }    
});

export default ScoreCardScreen;
