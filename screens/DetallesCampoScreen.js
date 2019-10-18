import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../Database';

const db = new Database();

export default class DetallesCampoScreen extends Component {
  static navigationOptions = {
    title: 'Detalles del campo',
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      campo: {},
      id: '',
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      db.courseById(navigation.getParam('id')).then((data) => {
        console.log(data);
          let campo = data;
        this.setState({
          campo,
          isLoading: false,
          id: campo.id
        });
      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      })
    });
  }

  deleteCourse(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteCourse(id).then((result) => {
      console.log(result);
      this.props.navigation.goBack();
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
      )
    }
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Text style={{ fontSize: 16 }}>Campo ID: {this.state.campo.id}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo Name: {this.state.campo.name}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo SHORT NAME: {this.state.campo.short_name}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo ADDRESS: {this.state.campo.address}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo CITY: {this.state.campo.city}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo COUNTRY: {this.state.campo.country}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo ID SYNC: {this.state.campo.id_sync}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Campo ULTIMATE SYNC: {this.state.campo.ultimate_sync}</Text>
            </View>
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#CCCCCC'}
              leftIcon={{ name: 'edit' }}
              title='Edit'
              onPress={() => {
                this.props.navigation.navigate('EditarCampo', {
                  id: `${this.state.id}`,
                });
              }} />
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{ name: 'delete' }}
              title='Delete'
              onPress={() => this.deleteCourse(this.state.id)} />
          </View>
        </Card>
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
    paddingBottom: 20,
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
  detailButton: {
    marginTop: 10
  }
})