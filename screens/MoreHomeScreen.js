import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

class MoreHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
            <ListItem
                title={'Score Card'}
                subtitle={'Resumen del juego'}
                leftIcon={{
                    name: 'file-table',
                    type: 'material-community',
                    color: '#3e2465'
                }}
                onPress={() => this.props.navigation.navigate('ScoreCard')}
                bottomDivider
                chevron
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
export default MoreHomeScreen;
