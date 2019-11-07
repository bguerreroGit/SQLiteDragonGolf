import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Database from '../Database';
import moment from "moment";

const db = new Database();

export default class HomeScreen extends Component {
  
  static navigationOptions = {
        title: 'Inicio',
    };

  constructor(props) {
    super(props);
    this.state = {
     user: {},
    };
    //this.saveUser();
  }
  componentDidMount(){
    db.userById(1).then((result) => {
      console.log('================= USER =============================');
      console.log(result);
      console.log('================= END USER =============================');
      this.setState({
        user: result,
      });
    }).catch( error => {
      console.log(error);
    })
  }
  saveUser(){
    let user = {
      name: 'Baltazar',
      last_name: 'Guerrero',
      email: 'b@gmail.com',
      nick_name: 'BALTA',
      cellphone: '444 333 48 07',
      language: 'en',
      handicap: 20,
      ghin_number: 'R36464',
      photo: 'photo.png',
      general_settings_id: null,
      single_nassau_wagers_id: null,
      team_nassau_wagers_id: null,
      extra_bets_id: null,
      stableford_settings_id: null,
      id_sync: null,
      ultimate_sync: null,
    };
    db.addUser(user).then((result) => {
      console.log('================== USER ====================================');
      console.log(result);
      console.log('ID DE USER: ', result.insertId);
      console.log('================== FINAL DE USER ====================================');
      this.setState({
        userId: result.insertId,
      });
    }).catch(error => {
      console.log(error);
    })
  }

  render() {
    return (
      <View>
        <Text> HomeScreen </Text>
        <Button
          title="Courses"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('Campo')}
        />
        <View style={{ height: 20}}/>
        <Button
          title="Holes"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('Holes')}
        />
        <View style={{ height: 20 }} />
        <Button
          title="Tees"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('Tees')}
        />
        <View style={{ height: 20 }} />
        <Button
          title="Courses Complete Process"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('CampoComplete')}
        />
        <View style={{ height: 20 }} />
        <Button
          title="Players"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('Players')}
        />
        <View style={{ height: 20 }} />
        <Button
          title="Settings"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('Settings', { user: this.state.user})}
        />
        <View style={{ height: 20 }} />
        <Button
          title="Rounds"
          color="#0000ff"
          onPress={() => this.props.navigation.navigate('Rounds')}
        />
      </View>
    );
  }
}
