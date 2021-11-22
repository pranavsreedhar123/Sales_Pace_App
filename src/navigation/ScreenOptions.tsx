import * as React from 'react';

import {toggleNavigationDrawer} from './NavigationActions';
import {MenuBarIcon} from '../assets/MenuBarIcon';
import {ArrowBackIcon} from '../assets/ArrowBackIcon';
import {CustomButton} from '../components/buttons/CustomButton';
import {Theme} from '../styles/Theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {LabelButton} from '../components/buttons/LabelButton';
import {CommonStyles} from '../styles/CommonStyle';
import ArrowIcon, {ArrowDirectionEnum} from '../assets/ArrowIcon';

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

export const setHeaderLeft = (
  navigation: StackNavigationProp<Record<string, undefined>, string>,
  text: string,
  color: string,
  onPress: () => void,
): void => {
  navigation.setOptions({
    headerLeft: () => (
      <LabelButton
        style={[
          CommonStyles.marginHorizontal,
          {flexDirection: 'row', alignItems: 'center'},
        ]}
        text={text}
        color={color}
        icon={
          <ArrowIcon
            style={{marginRight: 5}}
            direction={ArrowDirectionEnum.LEFT}
            color={color}
            width={20}
          />
        }
        onPress={onPress}
      />
    ),
  });
};

export const setHeaderTitle = (title: string | undefined): string => `${title}`;
