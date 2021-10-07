import * as React from 'react';

import {toggleNavigationDrawer} from './NavigationActions';
import {MenuBarIcon} from '../assets/MenuBarIcon';
import {ArrowBackIcon} from '../assets/ArrowBackIcon';
import {CustomButton} from '../components/buttons/CustomButton';
import {Theme} from '../styles/Theme';

export const setCommonDrawerScreenOptions = () => {
  return {
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTitleStyle: {
      color: '#F15D22',
      alignItems: 'center',
      fontSize: 22,
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
