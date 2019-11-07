import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class EditarCampoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      short_name: '',
      address: '',
      city: '',
      country: '',
      id_sync: '',
      ultimate_sync: '',
      isLoading: false,
    };
  }
    static navigationOptions = {
        title: 'Editar Campo',
    };

  componentDidMount() {
    const { navigation } = this.props;
    db.courseById(navigation.getParam('id')).then((data) => {
      console.log(data);
      const campo = data;
      this.setState({
        id: campo.id,
        name: campo.name,
        short_name: campo.short_name,
        address: campo.address,
        city: campo.city,
        country: campo.country,
        id_sync: campo.id_sync,
        ultimate_sync: campo.ultimate_sync,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  updateCourse() {
    this.setState({
      isLoading: true,
    });
    const {navigation} = this.props;
    let data = {
      name: this.state.name,
      short_name: this.state.short_name,
      address: this.state.address,
      city: this.state.city,
      country: this.state.country,
      id_sync: this.state.id_sync,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    db.updateCourse(this.state.id, data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      this.props.navigation.state.params.onNavigateBack;
      this.props.navigation.goBack();
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    })
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
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Name'}
            value={this.state.name}
            onChangeText={(text) => this.updateTextInput(text, 'name')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Short Name'}
            value={this.state.short_name}
            onChangeText={(text) => this.updateTextInput(text, 'short_name')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Address'}
            value={this.state.address}
            onChangeText={(text) => this.updateTextInput(text, 'address')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'City'}
            value={this.state.city}
            onChangeText={(text) => this.updateTextInput(text, 'city')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Country'}
            value={this.state.country}
            onChangeText={(text) => this.updateTextInput(text, 'country')}
          />
        </View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{ name: 'save' }}
            title='Save'
            onPress={() => this.updateCourse()} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginBottom: 60,
  },
})