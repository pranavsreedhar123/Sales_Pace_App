import * as React from 'react';
import {CustomButton} from '../components/CustomButton';
import {toggleNavigationDrawer} from './NavigationActions';
import {MenuBarIcon} from '../assets/MenuBarIcon';
import {ArrowBackIcon} from '../assets/ArrowBackIcon';
// import {Icon} from 'react-native-vector-icons';

export const setCommonDrawerScreenOptions = () => {
  return {
    headerStyle: {
      backgroundColor: '#D0D0D0',
    },
    headerTitleStyle: {
      color: '#005A9C',
      alignItems: 'center',
    },
    headerBackTitleVisible: false,
    headerTintColor: '#fff',
    headerShown: true,
    headerBackImage: () => (
      <ArrowBackIcon style={{marginHorizontal: 15, marginTop: 10}} />
    ),
  };
};

export const setDrawerMenuInHeader = () => {
  return {
    headerLeft: () => (
      <CustomButton
        onPress={toggleNavigationDrawer}
        style={{
          width: 50,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        backgroundColorOnTouch={'grey'}>
        <MenuBarIcon style={{marginTop: -5}} />

        {/* <Icon name="rocket" size={30} color="#900" /> */}
      </CustomButton>
    ),
  };
};

export const setHeaderTitle = (title: string | undefined): string => `${title}`;
