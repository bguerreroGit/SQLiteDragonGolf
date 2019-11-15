import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ScoreCardScreen extends Component {
  constructor(props) {
    super(props);
      /*let valueRound = props.navigation.dangerouslyGetParent().state.params.round;
      console.log('################################# RONDA ###############################');
      console.log(props.navigation.dangerouslyGetParent().state.params.round);*/
    this.state = {
    };
  }
    static navigationOptions = ({ navigation }) => {
        let valueRound = navigation.dangerouslyGetParent().state.params.round;
        return {
            title: 'Score Card: ' + valueRound.name,
        };
    };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ padding: 5, backgroundColor: 'gray'}}>
            <View style={{flexDirection: 'row'}}>
            <View>
                <Text>Hole </Text>
                <Text>Par </Text>
            </View>
            <View style={{backgroundColor: 'white'}}>
                <Text>1 </Text>
                <Text>3 </Text>
            </View>
            </View>
        </View>
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
