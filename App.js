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