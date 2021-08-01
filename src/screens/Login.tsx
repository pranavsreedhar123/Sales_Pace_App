import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Screens} from '../navigation/Screens';
import {NavigationActions} from '../navigation/NavigationActions';
Icon.loadFont();

export const Login = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const validate = (email: string, password: string) => {
    if (email == 'test@saint-gobain.com' && password == '12345') {
      NavigationActions.navigateToScreen({
        screenName: Screens.DefaultDrawer,
      });
    } else {
      Alert.alert('Incorrect Email or Password');
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/SalesPace.png')}
        style={styles.logo}></Image>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 0,
          borderWidth: 2,
          marginTop: Dimensions.get('window').height / 14,
          paddingHorizontal: 15,
          borderColor: '#00716F',
          borderRadius: 23,
          paddingVertical: 2,
        }}>
        <Icon name="mail" size={20} color="black" />
        <TextInput
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email"
          style={styles.input}
          returnKeyLabel={'next'}
          onChangeText={(text: string) => setEmail(text)}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 0,
          borderWidth: 2,
          marginTop: Dimensions.get('window').height / 42,
          paddingHorizontal: 15,
          borderColor: '#00716F',
          borderRadius: 23,
          paddingVertical: 2,
        }}>
        <Icon name="lock" size={20} color="black" />
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          placeholder="Password"
          style={styles.input}
          returnKeyLabel={'next'}
          onChangeText={(text: string) => setPassword(text)}
        />
      </View>
      <View
        style={{
          marginHorizontal: Dimensions.get('window').width / 7,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: Dimensions.get('window').height / 18,
          backgroundColor: '#00716F',
          borderRadius: 23,
          paddingVertical: 8,
        }}>
        <Text style={styles.text} onPress={() => validate(email, password)}>
          Sign In
        </Text>
      </View>
      {/* <View
        style={{
          marginHorizontal: Dimensions.get('window').width / 7,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: Dimensions.get('window').height / 42,
          backgroundColor: '#00716F',
          borderRadius: 23,
          paddingVertical: 8,
        }}>
        <Text
          style={styles.text}
          onPress={() => this.navigation.navigate('SignIn')}>
          Sign Up
        </Text>
      </View> */}
      <Image
        source={require('../images/sg.png')}
        style={styles.tinyLogo}></Image>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 50,
    //marginTop: Dimensions.get('window').height / 17,
    backgroundColor: '#FFF',
    height: '100%',
  },
  tinyLogo: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').height / 3,
    marginTop: Dimensions.get('window').height / 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logo: {
    marginTop: 25,
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
    fontSize: 20,
    color: 'white',
  },
  input: {
    paddingHorizontal: 5,
    width: '100%',
  },
  error: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
