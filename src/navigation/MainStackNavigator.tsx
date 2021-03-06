import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
//import {createSwitchNavigator} from '@react-navigation'
import {Screens} from './Screens';
import {TopVloggerScreen} from '../screens/TopVloggerScreen';
import GovtProjectScreen from '../screens/GovtProjectScreen';
import {VideoScreen} from '../screens/VideoScreen';
import {CustomDrawerContent} from './CustomDrawerContent';
import {
  setDrawerMenuInHeader,
  setCommonDrawerScreenOptions,
  setHeaderTitle,
} from './ScreenOptions';

import TradeFairScreen from '../screens/TradeFairScreen';
import {Login} from '../screens/Login';
import {GovtProjectScreenDetails} from '../screens/GovtProjectScreenDetails';
import HomeScreen from '../screens/HomeScreen';
import TenderGroups from '../screens/TenderGroups';
import TradeFairGroups from '../screens/TradeFairGroups';
import {TradeFairScreenDetails} from '../screens/TradeFairScreenDetails';

const Stack = createStackNavigator();
const DefaultDrawer = createDrawerNavigator();
const drawerMenuInHeader = setDrawerMenuInHeader();
const commonDrawerScreenOptions = setCommonDrawerScreenOptions();

export const MainStackNavigator = (): JSX.Element => {
  //const loggedIn = useAuth();
  //Alert.alert('' + loggedIn);
  const loggedIn = false;
  return loggedIn ? <LoggedInStackNavigator /> : <NotLoggedInStackNavigator />;
};
export const NotLoggedInStackNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name={Screens.LoginScreen}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Screens.DefaultDrawer}
        component={DefaultDrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export const LoggedInStackNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Screens.DefaultDrawer}
        component={DefaultDrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export const DefaultDrawerNavigator = (): JSX.Element => {
  return (
    <DefaultDrawer.Navigator drawerContent={() => <CustomDrawerContent />}>
      <DefaultDrawer.Screen
        name={Screens.HomeScreen}
        component={HomeScreen}
        options={{
          ...commonDrawerScreenOptions,
          ...drawerMenuInHeader,
          headerTitle: setHeaderTitle('Home'),
        }}
      />
      <DefaultDrawer.Screen
        name={Screens.TenderGroups}
        component={TenderGroups}
        options={{
          ...commonDrawerScreenOptions,
        }}
      />
      <DefaultDrawer.Screen
        name={Screens.TradeFairGroups}
        component={TradeFairGroups}
        options={{
          ...commonDrawerScreenOptions,
        }}
      />
      <DefaultDrawer.Screen
        name={Screens.GovtProjectScreen}
        component={GovtProjectScreen}
        options={{
          ...commonDrawerScreenOptions,
          ...drawerMenuInHeader,
          headerTitle: setHeaderTitle('All Tenders'),
        }}
        initialParams={{tendersList: []}}
      />
      <DefaultDrawer.Screen
        name={Screens.GovtProjectScreenDetails}
        component={GovtProjectScreenDetails}
        options={{
          ...commonDrawerScreenOptions,
          headerShown: false,
        }}
      />
      <DefaultDrawer.Screen
        name={Screens.TradeFairScreen}
        component={TradeFairScreen}
        options={{
          ...commonDrawerScreenOptions,
          ...drawerMenuInHeader,
          headerTitle: setHeaderTitle('Trade Fairs'),
        }}
        initialParams={{tradeFairsList: []}}
      />
      <DefaultDrawer.Screen
        name={Screens.TradeFairScreenDetails}
        component={TradeFairScreenDetails}
        options={{
          ...commonDrawerScreenOptions,
          headerShown: false,
        }}
      />
      <DefaultDrawer.Screen
        name={Screens.TopVloggerScreen}
        component={TopVloggerScreen}
        options={{
          ...commonDrawerScreenOptions,
          ...drawerMenuInHeader,
          headerTitle: setHeaderTitle('Top VLoggers'),
        }}
      />
      <DefaultDrawer.Screen
        name={Screens.VideoScreen}
        component={VideoScreen}
        options={{
          ...commonDrawerScreenOptions,
          ...drawerMenuInHeader,
          headerTitle: setHeaderTitle('Video'),
        }}
      />
    </DefaultDrawer.Navigator>
  );
};
