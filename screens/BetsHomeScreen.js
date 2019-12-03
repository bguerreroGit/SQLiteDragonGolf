import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../Database';
import SingleBetComponet from '../components/SingleBetComponet';
const db = new Database();

class BetsHomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            betsSingleNassau: []
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
                isLoading: false
            });
        }).catch(err => console.log(err));
    }

    getNickNameOfMember= async (id) =>{
        let member= await db.getNickNameMember(id);
        console.log('============================ MEMBER ========================');
        console.log(member);
        return 'hola';
    }
    render() {
        return (
            <View style={styles.container}>
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
export default BetsHomeScreen;