import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Screens} from './Screens';
import {TopVloggerScreen} from '../screens/TopVloggerScreen';
import GovtProjectScreen from '../screens/GovtProjectScreen';
import {CustomDrawerContent} from './CustomDrawerContent';
import {
  setDrawerMenuInHeader,
  setCommonDrawerScreenOptions,
  setHeaderTitle,
} from './ScreenOptions';
import Login from '../screens/Login';

const Stack = createStackNavigator();
const DefaultDrawer = createDrawerNavigator();
const drawerMenuInHeader = setDrawerMenuInHeader();
const commonDrawerScreenOptions = setCommonDrawerScreenOptions();

export const MainStackNavigator = (): JSX.Element => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={Screens.DefaultDrawer}
          component={DefaultDrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
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
          headerShown: false,
        }}
      />
    </DefaultDrawer.Navigator>
  );
};
