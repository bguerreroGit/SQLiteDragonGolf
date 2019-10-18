import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class AddCampoScreen extends Component {
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
    title: 'Agregar Campo',
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  }
  saveCampo() {
    this.setState({
      isLoading: true,
    });
    let data = {
      name: this.state.name,
      short_name: this.state.short_name,
      address: this.state.address,
      city: this.state.city,
      country: this.state.country,
      id_sync: this.state.id_sync,
      ultimate_sync: this.state.ultimate_sync,
    };

    db.addCourse(data).then((result) => {
      console.log('================== COURSE ====================================');
      console.log(result);
      console.log('ID DE COURSE: ',result.rows.insertId);
      console.log('================== FINAL DE COURSE ====================================');
      //Alert.alert(JSON.stringify(result));
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
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Id Sync'}
            value={this.state.id_sync}
            onChangeText={(text) => this.updateTextInput(text, 'id_sync')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
            placeholder={'Ultimate Sync'}
            value={this.state.ultimate_sync}
            onChangeText={(text) => this.updateTextInput(text, 'ultimate_sync')}
          />
        </View>
        <View style={styles.button}>
          <Button
            large
            leftIcon={{ name: 'save' }}
            title='Save'
            onPress={() => this.saveCampo()} />
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