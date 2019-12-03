import React, { PureComponent } from 'react';
import { Switch, View, Text, StyleSheet, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { ButtonGroup, Header, Icon } from 'react-native-elements';
import Database from '../Database';
import moment from "moment";

const db = new Database();

class ConfigureRoundScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.buttons = ['100%', '95%', '90%', '85%', '80%'];
    console.log('Props: ', props.navigation.state.params);
    const { id, name, hcp_adjustment, online_key, starting_hole, adv_b9_f9 } =props.navigation.state.params.round;
    let element=(hcp_adjustment*100) + '%';
    console.log('================= ELEMENT =============');
    console.log(element);

    this.state = {
      id: id,
      name: name,
      hcp_adjustment: hcp_adjustment,
      online_key: online_key,
      starting_hole: starting_hole,
      adv_b9_f9: adv_b9_f9,
      id_sync: null,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
      isLoading: false,
      selectedIndex: this.buttons.indexOf(element),
      startingHoleIndex: 0,
    };
   
  }

  

  updateNameRound(text) {
    this.setState({
      name: text
    });
    let data = {
      id: this.state.id,
      name: text,
      course_id: this.state.course_id,
      hcp_adjustment: this.state.hcp_adjustment,
      online_key: this.state.online_key,
      starting_hole: this.state.starting_hole,
      adv_b9_f9: this.state.adv_b9_f9,
      id_sync: this.state.id_sync,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    db.updateRound(data).then((result) => {
      console.log('Result: ', result);
    }).catch( error => {
      console.log(error);
    })
  }
  updateOnlineKeyRound(text){
    this.setState({
      online_key: text
    });
    let data = {
      id: this.state.id,
      name: this.state.name,
      course_id: this.state.course_id,
      hcp_adjustment: this.state.hcp_adjustment,
      online_key: text,
      starting_hole: this.state.starting_hole,
      adv_b9_f9: this.state.adv_b9_f9,
      id_sync: this.state.id_sync,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    db.updateRound(data).then((result) => {
      console.log('Result: ', result);
    }).catch(error => {
      console.log(error);
    })
  }

  updateStartingHole= (selectedIndex) => {
    let starting_hole = parseInt(this.state.starting_hole);
    if(selectedIndex==1){
      if(starting_hole<18){
          starting_hole += 1;
      } else {
        if (starting_hole == 18) {
          starting_hole = 1;
        }
      }
    }else {
      if(starting_hole>1){
        if(starting_hole==1){
          starting_hole=1;
        }else {
          starting_hole -= 1;
        }
      }else {
        if (starting_hole == 1) {
          starting_hole = 18;
        }
      }
    }

    this.setState({
      starting_hole,
      startingHoleIndex: selectedIndex
    })

    let data = {
      id: this.state.id,
      name: this.state.name,
      course_id: this.state.course_id,
      hcp_adjustment: this.state.hcp_adjustment,
      online_key: this.state.online_key,
      starting_hole: starting_hole,
      adv_b9_f9: this.state.adv_b9_f9,
      id_sync: this.state.id_sync,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    console.log('================= DATA =================');
    console.log(data);
    db.updateRound(data).then((result) => {
      console.log('Result: ', result);
    }).catch(error => {
      console.log(error);
    })
  }

  updateIndex= (selectedIndex) => {
    let porcentaje = this.buttons[selectedIndex];
    let hcp_adjustment= porcentaje.split('%')[0];
    console.log('HCP ADJUSTMENT: ', (hcp_adjustment/100));
    this.setState({ 
      selectedIndex,
      hcp_adjustment: (hcp_adjustment / 100) });
    let data = {
      id: this.state.id,
      name: this.state.name,
      course_id: this.state.course_id,
      hcp_adjustment: (hcp_adjustment/100),
      online_key: this.state.online_key,
      starting_hole: this.state.starting_hole,
      adv_b9_f9: this.state.adv_b9_f9,
      id_sync: this.state.id_sync,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    db.updateRound(data).then((result) => {
      console.log('Result: ', result);
    }).catch(error => {
      console.log(error);
    }) 
  }

  toggleSwitch = (value) => {
    let sw = value == true ? 1 : 0;
    this.setState({
      adv_b9_f9: sw
    });
    let data = {
      id: this.state.id,
      name: this.state.name,
      course_id: this.state.course_id,
      hcp_adjustment: this.state.hcp_adjustment,
      online_key: this.state.online_key,
      starting_hole: this.state.starting_hole,
      adv_b9_f9: sw,
      id_sync: this.state.id_sync,
      ultimate_sync: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    db.updateRound(data).then((result) => {
      console.log('Result: ', result);
    }).catch(error => {
      console.log(error);
    }) 
  }

  render() {
    const startingButtons = [' - ', ' + '];
    const { selectedIndex } = this.state
    return (
      <View style={styles.container}>
        <Header
          placement="center"
          containerStyle={{
            paddingTop: 0,
            height: 60
          }}
          backgroundColor='#694fad'
          leftComponent={
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Rounds')}>
              <Icon 
                name={'arrow-circle-left'}
                type={'font-awesome'}
                size={28}
                color={'#fff'}
              />
            </TouchableOpacity>}
          centerComponent={{ text: 'Configurar Ronda', style: { fontWeight: 'bold', fontSize: 20, color: '#fff' } }}
          
        />
        <View style={styles.body}>
          <Text>Nombre </Text>
          <TextInput
            style={styles.input}
            placeholder={'Name'}
            value={this.state.name}
            onChangeText={(text) => this.updateNameRound(text)}
          />
          <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
            <Text>Online Key: </Text>
            <TextInput
              style={[styles.input, { width: 220 }]}
              placeholder={'Online key'}
              value={this.state.online_key}
              onChangeText={(text) => this.updateOnlineKeyRound(text)}
            />
          </View>
          <Text>Handicao Adjustment</Text>
          <ButtonGroup
            selectedButtonStyle={{ backgroundColor: '#000000' }}
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={this.buttons}
            containerStyle={{ height: 30 }}
          />
          <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
            <Text>Starting Hole: </Text>
            <ButtonGroup
              selectedButtonStyle={{ backgroundColor: '#000000' }}
              onPress={this.updateStartingHole}
              selectedIndex={this.state.startingHoleIndex}
              buttons={startingButtons}
              containerStyle={{ height: 30, width: 120 }}
            />
            <Text>{this.state.starting_hole}</Text>
          </View>
          {
            this.state.starting_hole > 1 ? <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
              <Text>Switch Adv B9/F9: </Text>
              <Switch
                onValueChange={(value) => this.toggleSwitch(value)}
                value={this.state.adv_b9_f9 == 1 ? true : false} />
            </View> : null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 4
  }
});
export default ConfigureRoundScreen;
