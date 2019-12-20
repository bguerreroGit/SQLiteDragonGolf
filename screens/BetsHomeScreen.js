import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, ScrollView } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../Database';
import SingleBetComponet from '../components/SingleBetComponet';
import TeamBetComponent from '../components/TeamBetComponet';

const db = new Database();

class BetsHomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            betsSingleNassau: [],
            betsTeamNassau: [],
        };
    }

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.getBets();
        });
    }
   
    getBets() {
        let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
        this.setState({
            isLoading: true
        });
        db.listBetsSingleNassau(valueRound.id).then(result => {
            this.setState({
                betsSingleNassau: result,
            });
        }).catch(err => console.log(err));
        db.listBetsTeamNassau(valueRound.id).then( result => {
            console.log('==================== LISTA BETS TEAM NASSAU ==================');
            console.log(result);
            this.setState({
                betsTeamNassau: result,
                isLoading: false
            });
        });
    }

    getNickNameOfMember= async (id) =>{
        let member= await db.getNickNameMember(id);
        console.log('============================ MEMBER ========================');
        console.log(member);
        return 'hola';
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <ListItem
                        title={'Rabbit Bets'}
                        bottomDivider
                        rightElement={<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                title='clean'
                                buttonStyle={{
                                    backgroundColor: '#694fad',
                                    marginRight: 5
                                }}
                            />
                            <Button
                                title='add'
                                buttonStyle={{
                                    backgroundColor: '#694fad'
                                }}
                                onPress={() => this.props.navigation.navigate('AddRabbitBet')}
                            />

                        </View>}
                        chevron
                    />
                    {
                        this.state.isLoading == false ?
                            <Text>Contenido</Text> : null
                    }
                </View>
                <View>
                    <ListItem
                        title={'Nassau Individual'}
                        bottomDivider
                        rightElement={<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button
                            title='+P'
                            buttonStyle={{
                                backgroundColor: '#694fad',
                                marginRight: 5
                            }}
                        />
                        <Button 
                            title='clean'
                            buttonStyle={{
                                backgroundColor: '#694fad',
                                marginRight: 5
                            }}
                        />
                        <Button
                            title='add'
                            buttonStyle={{
                                backgroundColor: '#694fad'
                            }}
                            onPress={() => this.props.navigation.navigate('AddSingleNassau')}
                        />

                        </View>}
                        chevron
                    />
                    {
                        this.state.isLoading==false ? 
                            <FlatList
                                data={this.state.betsSingleNassau}
                                renderItem={({ item, index }) => (
                                    <SingleBetComponet
                                        bet={item}
                                        index={index}
                                        navigation={this.props.navigation}
                                        round={this.props.navigation.dangerouslyGetParent().state.params.round}
                                    />
                                )}
                                keyExtractor={item => item.id}
                            /> : null
                    }
                    
                </View>
                <View>
                    <ListItem
                        title={'Nassau Pairings'}
                        bottomDivider
                        rightElement={<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                title='+P'
                                buttonStyle={{
                                    backgroundColor: '#694fad',
                                    marginRight: 5
                                }}
                            />
                            <Button
                                title='clean'
                                buttonStyle={{
                                    backgroundColor: '#694fad',
                                    marginRight: 5
                                }}
                            />
                            <Button
                                title='add'
                                buttonStyle={{
                                    backgroundColor: '#694fad'
                                }}
                                onPress={() => this.props.navigation.navigate('AddTeamNassau')}
                            />

                        </View>}
                        chevron
                    />
                    {
                        this.state.isLoading == false ?
                            <FlatList
                                data={this.state.betsTeamNassau}
                                renderItem={({ item, index }) => (
                                    <TeamBetComponent
                                        bet={item}
                                        index={index}
                                        navigation={this.props.navigation}
                                        round={this.props.navigation.dangerouslyGetParent().state.params.round}
                                    />
                                )}
                                keyExtractor={item => item.id}
                            /> : null
                    }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
export default BetsHomeScreen;