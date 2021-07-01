import * as React from 'react';
import {CustomDrawerScreens} from './CustomDrawerScreens';
import {ScrollView, View} from 'react-native';
import {CustomDrawerScreen} from '../types/CustomDarwerScreen';
import {NavigationActions} from './NavigationActions';
import {CustomButton} from '../components/CustomButton';
import {Title} from '../components/Title';

export const CustomDrawerContent = (): JSX.Element => {
  const screens = CustomDrawerScreens();

  return (
    <ScrollView>
      {screens.map((screen: CustomDrawerScreen, index: number) => (
        <CustomButton
          key={index}
          backgroundColorOnTouch={'grey'}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            NavigationActions.navigateToScreen({
              screenName: screen.name,
            });
          }}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View
              style={{
                width: '22%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {screen.icon}
            </View>
            <MenuItemText text={screen.displayName} />
          </View>
        </CustomButton>
      ))}
    </ScrollView>
  );
};

const MenuItemText = ({text}: {text: string}): JSX.Element => {
  return (
    <Title
      h2
      style={{
        color: 'grey',
        marginTop: -1,
      }}>
      {text}
    </Title>
  );
};
