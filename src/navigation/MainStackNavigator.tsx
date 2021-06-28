import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Screens} from './Screens';
import {TopVloggerScreen} from '../screens/TopVloggerScreen';
import {Login} from '../screens/Login';

const Stack = createStackNavigator();

export const MainStackNavigator = (): JSX.Element => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={Screens.TopVloggerScreen}
          component={TopVloggerScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
};
