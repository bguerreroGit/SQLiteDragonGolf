/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import CampoScreen from './screens/CamposScreen';
import DetallesCampoScreen from './screens/DetallesCampoScreen';
import EditarCampoScreen from './screens/EditarCampoScreen';
import AddCampoScreen from './screens/AddCampoScreen';
import HolesScreen from './screens/HolesScreen';
import AddHoleScreen from './screens/AddHoleScreen';
import DetallesHoleScreen from './screens/DetallesHoleScreen';
import EditarHoleScreen from './screens/EditarHoleScreen';
import TeesScreen from "./screens/TeesScreen";
import AddTeeScreen from './screens/AddTeeScreen';
import DetallesTeeScreen from './screens/DetallesTeeScreen';
import EditarTeeScreen from './screens/EditarTeeScreen';
import CampoCompleteScreen from './screens/CampoCompleteScreen';
import AddCampoCompleteScreen from './screens/AddCampoCompleteScreen';
import AddTeeCompleteScreen from './screens/AddTeeCompleteScreen';
import TeesCompleteScreen from './screens/TeesCompleteScreen';
import ConfigureHolesScreen from './screens/ConfigureHolesScreen';
import PlayersScreen from './screens/PlayersScreen';
import AddPlayersScreen from './screens/AddPlayerScreen';
import ConfigurePlayersScreen from './screens/ConfigurePlayersScreen';
import EditPlayersScreen from './screens/EditPlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import RoundsScreen from "./screens/RoundsScreen";
import AddRoundScreen from './screens/AddRoundScreen';
import ConfigureRoundScreen from './screens/ConfigureRoundScreen';
import PlayersInRoundScreen from './screens/PlayersInRoundScreen';
import AddPlayersInRoundScreen from './screens/AddPlayersInRoundScreen';

const RoundPlayersStack = createStackNavigator(
  {
    PlayersInRound: {
      screen: PlayersInRoundScreen
    },
    AddPlayersInRound: {
      screen: AddPlayersInRoundScreen 
    }
  },
  {
    initialRouteName: 'PlayersInRound',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#777777',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const RoundBottom = createBottomTabNavigator({
  ConfigureRound: ConfigureRoundScreen,
  Players: RoundPlayersStack,
}, {
  initialRouteName: 'ConfigureRound',
  activeColor: '#f0edf6',
  inactiveColor: '#3e2465',
  shifting: false,
  barStyle: {
    backgroundColor: '#694fad',
  },
})


const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Players: PlayersScreen,
    AddPlayers: AddPlayersScreen,
    EditPlayer: EditPlayersScreen, 
    ConfigurePlayers: ConfigurePlayersScreen,
    Holes: HolesScreen,
    AddHole: AddHoleScreen,
    DetallesHole: DetallesHoleScreen,
    EditarHole: EditarHoleScreen,
    Campo: CampoScreen,
    CampoDetalles: DetallesCampoScreen,
    AddCampo: AddCampoScreen,
    EditarCampo: EditarCampoScreen,
    Tees: TeesScreen,
    DetallesTee: DetallesTeeScreen,
    EditarTee: EditarTeeScreen,
    CampoComplete: CampoCompleteScreen,
    AddCampoComplete: AddCampoCompleteScreen,
    AddTeeComplete: AddTeeCompleteScreen,
    TeesComplete: TeesCompleteScreen,
    ConfigureHoles: ConfigureHolesScreen,
    Settings: SettingsScreen,
    Rounds: RoundsScreen,
    AddRound: AddRoundScreen,
    ConfigureRound: {
      screen: RoundBottom,
      navigationOptions: {
       header: null
      }
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#777777',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

const RootContainer = createAppContainer(RootStack);

const App: () => React$Node = () => {
  return (
    <>
      <RootContainer style={styles.container}/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
/*Rounds: RoundsScreen,
    AddRound: AddRoundScreen,
    ConfigureRound: ConfigureRoundScreen, */