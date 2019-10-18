/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class ConfigureHolesScreen extends Component {
    constructor(props) {
        super(props);
        const { tee, courseId } = props.navigation.state.params;
        let holes = [];
        for (var i = 0; i < 18; i++) {
            holes.push({
                par: '5',
                hole_number: (i + 1).toString(),
                adv: '1',
                handicap: '8',
                handicap_damas: '10',
                course_id: courseId,
                yards: '145',
                id_sync: null,
                ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
            });
        }
        this.state = {
           holes,
           tee,
           courseId: courseId, 
           haveHoles: false,
           isLoading: false,
        };
        console.log('======================= PROPS CONFIGURE HOLES ===========================');
        console.log('Tee id: ', tee);
        console.log('Course id: ',courseId);
        console.log('======================= END PROPS CONFIGURE HOLES ===========================');
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Configure Holes'
        };
    };

  componentDidMount() {
      const { courseId } = this.props.navigation.state.params;
      db.holesByCourseId(courseId).then((result) => {
          console.log('============================== HOLES POR CAMPO ======================= ');
          console.log(result);
          console.log('longuitud del arreglo ', result.length);
          console.log('============================== END HOLES POR CAMPO ======================= ');
          if (result.length == 18) {
              this.setState({
                  holes: result,
                  haveHoles: true,
              });
          }
      }).catch((err) => {
          console.log(err);
          this.setState({
              isLoading: false,
          });
      }) 
  }
    updateTextInput = (text, field, index) => {
        const holes = this.state.holes;
        const tee=this.state.tee;
        holes[index][field] = text;
        holes[index]['ultimate_sync'] = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setState({
            holes,
        });
    }
    updateTextInputYards = (text, hole) => {
        const tee = this.state.tee;
        tee[hole] = text;
        this.setState({
            tee,
        });
    }

    saveHolesAndTee() {
        const { holes, course_id }=this.state;
        if(this.state.haveHoles=false){
            db.add18Holes(holes).then((result) => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            })
        }else {
            db.update18Holes(holes, course_id).then((result) => {
                console.log('======================== Resultado update tee ====================');
                console.log(result);
                console.log('======================== END Resultado update tee ====================');
            }).catch(error => {
                console.log(error);
            })
        }
        const tee=this.state.tee;
        tee['ultimate_sync']=moment().format('YYYY-MM-DD HH:mm:ss');
        db.updateYardsInTee(tee).then((resultado) => {
            console.log('======================== Resultado update tee ====================');
            console.log(resultado);
            console.log('======================== END Resultado update tee ====================');
            if (resultado.rowsAffected> 0){
                Alert.alert('Cambio exitoso', 'Todo se ha guaradado de manera correcta');
                this.props.navigation.goBack();
            }
        }).catch( error => {
            console.log(error);
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
            <View style={{flex: 1, marginBottom: 20}}>
                <View style={{flex: 1, flexDirection: 'row', height: 30, borderBottomColor: '#000000', borderBottomWidth: 2}}>
                    <View style={{width: '15%'}}>
                        <Text>
                            HOLE
                        </Text>
                    </View>
                    <View style={{ width: '15%' }}>
                        <Text>
                            PAR
                        </Text>
                    </View>
                    <View style={{ width: '15%' }}>
                        <Text>
                            ADV
                        </Text>
                    </View>
                    <View style={{ width: '15%' }}>
                        <Text>
                            HCP
                        </Text>
                    </View>
                    <View style={{ width: '15%' }}>
                        <Text>
                            HCP D
                        </Text>
                    </View>
                    <View style={{ width: '15%' }}>
                        <Text>
                            YDS
                        </Text>
                    </View>
                </View>
                {
                    this.state.holes.map((hole, index) => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', height: 40, borderBottomColor: '#000000', borderBottomWidth: 2 }}>
                                        <View style={{ width: '15%' }}>
                                            <Text>
                                                {hole.hole_number}
                                            </Text>
                                        </View>
                                        <View style={{ width: '15%' }}>
                                            <TextInput
                                                style={{ height: 35, width: 40, borderWidth: 1, borderColor: 'red' }}
                                                keyboardType={'numeric'}
                                                onChangeText={(text) => this.updateTextInput(text, 'par', index)}
                                                value={this.state.holes[index].par.toString()}
                                            />
                                        </View>
                                        <View style={{ width: '15%' }}>
                                            <TextInput
                                                style={{ height: 35, width: 40, borderWidth: 1, borderColor: 'red' }}
                                                keyboardType={'numeric'}
                                                onChangeText={(text) => this.updateTextInput(text, 'adv', index)}
                                                value={this.state.holes[index].adv.toString()}
                                            />
                                        </View>
                                        <View style={{ width: '15%' }}>
                                            <TextInput
                                                style={{ height: 35, width: 40, borderWidth: 1, borderColor: 'red' }}
                                                keyboardType={'numeric'}
                                                onChangeText={(text) => this.updateTextInput(text, 'handicap', index)}
                                                value={this.state.holes[index].handicap.toString()}
                                            />
                                        </View>
                                        <View style={{ width: '15%' }}>
                                            <TextInput
                                                style={{ height: 35, width: 40, borderWidth: 1, borderColor: 'red' }}
                                                keyboardType={'numeric'}
                                                onChangeText={(text) => this.updateTextInput(text, 'handicap_damas', index)}
                                                value={this.state.holes[index].handicap_damas.toString()}
                                            />
                                        </View>
                                        <View style={{ width: '15%' }}>
                                            <TextInput
                                                style={{ height: 35, width: 40, borderWidth: 1, borderColor: 'red' }}
                                                keyboardType={'numeric'}
                                                onChangeText={(text) => this.updateTextInputYards(text, 'hole_' + hole.hole_number)}
                                                value={this.state.tee['hole_' + hole.hole_number] == null ? '' : this.state.tee['hole_' + hole.hole_number].toString()}
                                            />
                                        </View>
                                    </View> 
                                )
                  })
                }
            </View>
               
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Save'
                        onPress={() => this.saveHolesAndTee()} />
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
