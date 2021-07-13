import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
//import {createSwitchNavigator} from '@react-navigation'
import {Screens} from './Screens';
import {Login} from '../screens/Login';
import {TopVloggerScreen} from '../screens/TopVloggerScreen';
import GovtProjectScreen from '../screens/GovtProjectScreen';
import {CustomDrawerContent} from './CustomDrawerContent';
import { AuthContext, LoginContext, useAuth } from '../components/auth-context';
import {
  setDrawerMenuInHeader,
  setCommonDrawerScreenOptions,
  setHeaderTitle,
} from './ScreenOptions';

const Stack = createStackNavigator();
const DefaultDrawer = createDrawerNavigator();
const drawerMenuInHeader = setDrawerMenuInHeader();
const commonDrawerScreenOptions = setCommonDrawerScreenOptions();

export const MainStackNavigator = (): JSX.Element => {
  // const {loggedIn} = useAuth();
  const loggedIn = true;
  return loggedIn ? <LoggedInStackNavigator /> : <NotLoggedInStackNavigator />;
};
export const LoggedInStackNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName={Screens.LoginScreen}>
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
export const NotLoggedInStackNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Screens.LoginScreen}
        component={Login}
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
        name={Screens.GovtProjectScreen}
        component={GovtProjectScreen}
        options={{
          ...commonDrawerScreenOptions,
          ...drawerMenuInHeader,
          headerTitle: setHeaderTitle('All Tenders'),
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
    </DefaultDrawer.Navigator>
  );
};
