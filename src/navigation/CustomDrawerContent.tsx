import * as React from 'react';
import {CustomDrawerScreens} from './CustomDrawerScreens';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import {CustomDrawerScreen} from '../types/CustomDarwerScreen';
import {NavigationActions} from './NavigationActions';
import {CustomButton} from '../components/CustomButton';
import {Title} from '../components/Title';
import {List, ListItem} from 'native-base';
import {Screens} from './Screens';
import Icon from 'react-native-vector-icons/EvilIcons';
import {
  MainStackNavigator,
  NotLoggedInStackNavigator,
  DefaultDrawerNavigator,
} from './MainStackNavigator';
Icon.loadFont();
export const CustomDrawerContent = (): JSX.Element => {
  const screens = CustomDrawerScreens();

  return (
    <>
      <View style={{marginTop: 40, paddingHorizontal: 90}}>
        <Icon name="user" size={100} color="gray" />
      </View>
      <List>
        <ListItem style={{justifyContent: 'center'}}>
          <Text>Username</Text>
        </ListItem>
      </List>
      <ScrollView style={{paddingTop: 10}}>
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
      <List>
        <ListItem
          style={{
            justifyContent: 'center',
            backgroundColor: '#00716F',
            borderRadius: 23,
            marginHorizontal: 20,
            paddingHorizontal: 15,
            width: '90%',
            //width: '80%',
          }}
          onPress={() => {
            NavigationActions.navigateToScreen({
              screenName: Screens.LoginScreen,
            });
          }}
          // onPress={() => navigation.navigate('NotLoggedInStackNavigator')}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              width: '100%',
              paddingHorizontal: 80,
            }}>
            Logout
          </Text>
        </ListItem>
      </List>
      <Image
        source={require('../images/sg.png')}
        style={styles.tinyLogo}></Image>
    </>
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
const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
    padding: 5,
    backgroundColor: '#D0D0D0',
  },
  userLogo: {
    marginTop: Dimensions.get('window').height / 16,
    marginBottom: 0,
    //marginBottom: 20,
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 9,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  tinyLogo: {
    marginBottom: Dimensions.get('window').height / 26,
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 9,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logo: {
    width: Dimensions.get('window').width / 1.3,
    height: Dimensions.get('window').height / 4,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    paddingLeft: Dimensions.get('window').width / 29,
    marginLeft: Dimensions.get('window').width / 30,
    color: 'white',
    backgroundColor: 'blue',
    width: Dimensions.get('window').width * 0.2,
  },
  textButtonEnabled: {
    fontSize: 14,
    padding: 10,
    paddingTop: 10,
    fontWeight: 'bold',
    marginLeft: Dimensions.get('window').width / 100,
    color: 'white',
    backgroundColor: 'rgb(0, 0, 255)',
    width: Dimensions.get('window').width * 0.45,
    borderRadius: 5,
  },
  textButtonDisabled: {
    fontSize: 14,
    padding: 10,
    paddingTop: 10,
    fontWeight: 'bold',
    marginLeft: Dimensions.get('window').width / 100,
    color: 'white',
    backgroundColor: 'rgb(0, 0, 255)',
    width: Dimensions.get('window').width * 0.45,
    borderRadius: 5,
  },
  input: {
    width: '70%',
    borderColor: '#c6c8cc',
    borderWidth: 2,
    borderRadius: 25,
    padding: 5,
    marginRight: 20,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 10,
  },
  error: {
    borderWidth: 2,
    borderColor: 'red',
  },
  searchBox: {
    flexDirection: 'row',
    borderColor: '#cccccc',
    borderBottomWidth: 1,
  },
});
