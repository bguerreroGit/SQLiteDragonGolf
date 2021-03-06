/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class CamposScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      campos: [],
      notFound:
        'Campos no encontrados.\nPorfavor seleccione (+) boton para agregar alguno.',
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Lista de Campos',
      headerRight: (
        <Button
          buttonStyle={{padding: 0, backgroundColor: 'transparent'}}
          icon={{name: 'add-circle', style: {marginRight: 0, fontSize: 28}}}
          onPress={() => {
            navigation.navigate('AddCampo', {
              onNavigateBack: this.handleOnNavigateBack,
            });
          }}
        />
      ),
    };
  };

  getCampos() {
    let campos = [];
    db.listCourse()
      .then(data => {
        campos = data;
        console.log('Campos********************');
        //Alert.alert(JSON.stringify(campos));
        this.setState({
          campos,
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

  renderItem = ({item}) => (
    <ListItem
      title={item.short_name}
      subtitle={item.name}
      leftIcon={{ name: 'check-circle'}}
      onPress={() => {
        this.props.navigation.navigate('CampoDetalles', {
          id: `${item.id}`,
        });
      }}
      chevron
      bottomDivider
    />
  );

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getCampos();
    });
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );;
    }
    if (this.state.campos.length === 0) {
      return (
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      );;
    }
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.campos}
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

