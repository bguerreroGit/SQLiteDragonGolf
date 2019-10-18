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
    };
    db.listHoleTee()
      .then(data => {
        console.log('Campos********************', data);
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false,
        };
      });
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
      </View>
    );
  }
}
