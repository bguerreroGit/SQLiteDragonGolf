import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class PlayersInRoundScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      members: [],
      notFound:
        'Sin jugadores.\nPorfavor seleccione (+) boton para agregar alguno.',
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Lista de Jugadores Ronda',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => {
            navigation.navigate('AddPlayersInRound', {
              onNavigateBack: this.handleOnNavigateBack,
            });
          }}
        />
      ),
    };
  };


  getMembers() {
    let members = [];
    let valueRound = this.props.navigation.dangerouslyGetParent().state.params.round;
    db.listMembersByRoundId(valueRound.id).then(data => {
      console.log('=============== MEMBERS ====================');
      console.log(data);
      console.log('=============== MEMBERS ====================');
        members = data;
        //Alert.alert(JSON.stringify(campos));
        this.setState({
          members,
          isLoading: false,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false,
        };
      });
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.player.nick_name}
      subtitle={'Handicap de campo: ' + item.handicap}
      leftIcon={{ name: 'check-circle' }}
      onLongPress={() => {
        Alert.alert(
          'Acciones',
          'Eliga una opción',
          [
            {
              text: 'Eliminar',
              onPress: () => this.deleteMember(item.id),
              style: 'cancel',
            },
            { text: 'Cancelar', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
      }}
      onPress={() => {
        this.props.navigation.navigate('ConfigureRound', { round: item });
      }}
      chevron
      bottomDivider
    />
  );

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getMembers();
    });
  }
  deleteMember(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteMember(id).then((result) => {
      console.log(result);
      this.getMembers();
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
      );
    }
    if (this.state.members.length === 0) {
      return (
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      );
    }
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.members}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  message: {
    padding: 16,
    fontSize: 18,
    color: 'red',
  },
});
