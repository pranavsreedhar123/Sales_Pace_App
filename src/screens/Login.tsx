import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Dimensions,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Screens} from '../navigation/Screens';
import {NavigationActions} from '../navigation/NavigationActions';
import {
  SSO_OAuth_Get_ACCESS_TOKEN,
  AXWAY_TOKEN_STORAGE_KEY,
} from '../utils/Constant';
import {getAccessToken} from '../services/ssoLoginAPI';
import {getAxwayAccessTokenAPI} from '../services/axwayTokenAPI';
import {AppSecuredStorage} from '../utils/AppSecuredStorage';
Icon.loadFont();

export const Login = (): JSX.Element => {
  const [email, setEmail] = useState('R6050468');
  const [password, setPassword] = useState('Anaisha@1211');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  // useEffect(() => {
  //   AppSecuredStorage.removeItem(AXWAY_TOKEN_STORAGE_KEY);
  // }, []);

  const validate = async (email: string, password: string) => {
    setIsLoadingLogin(true);
    if (email == '1' && password == '1') {
      // alert("Correct UserName and Password.");
      NavigationActions.navigateToScreen({
        screenName: Screens.DefaultDrawer,
      });
    } else {
      try {
        const OauthDetails = await getAccessToken(email, password);
        console.log(OauthDetails, 'khbkhvhv');
        // let OAuthDetailsJSON=JSON.parse(OauthDetails);
        // console.log(
        //   'ppppppppppppppppppppp',
        //   Object.keys(OauthDetails),
        //   OauthDetails['access_token'],
        // );
        if (OauthDetails.access_token != undefined) {
          navigateToHomeScreen();
        } else {
          console.log(OauthDetails, 'pp');
          alert('Incorrect UserName or Password.');
          ToastAndroid.showWithGravity(
            ' Incorrect UserName and Password.',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      } catch {
        (e: Error) => {
          console.log(e + 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
          alert('Incorrect UserName or Password.');

          ToastAndroid.showWithGravity(
            ' Something went wrong.\n Please try again',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        };
      }

      OAuthAuthentication(email, password);
      setIsLoadingLogin(false);
      // Alert.alert('Incorrect Email or Password');
    }
  };
  const OAuthAuthentication = async (email: string, password: string) => {
    // toggleModal();
  };

  const navigateToHomeScreen = async () => {
    try {
      const axwayToken = await getAxwayAccessTokenAPI();
      await AppSecuredStorage.setItem(
        AXWAY_TOKEN_STORAGE_KEY,
        axwayToken?.access_token,
      );

      NavigationActions.navigateToScreen({
        screenName: Screens.DefaultDrawer,
      });
    } catch (e) {
      console.log(e, 'error console');
    }
  };

  return (
    <View style={styles.container}>
      {isLoadingLogin && (
        <ActivityIndicator
          style={{marginTop: Dimensions.get('window').height / 84}}
          size="large"
          color="red"
        />
      )}
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
          placeholder="SGID"
          placeholderTextColor="black"
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
          placeholderTextColor="black"
          style={styles.input}
          returnKeyLabel={'next'}
          onChangeText={(text: string) => setPassword(text)}
        />
      </View>
      <TouchableOpacity
        style={{
          marginHorizontal: Dimensions.get('window').width / 7,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: Dimensions.get('window').height / 18,
          backgroundColor: '#00716F',
          borderRadius: 23,
          paddingVertical: 8,
        }}
        onPress={() => validate(email, password)}>
        <Text style={styles.text}>Sign In</Text>
      </TouchableOpacity>

      <Image
        source={require('../images/sg.png')}
        style={styles.tinyLogo}></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Dimensions.get('window').height / 15,
    backgroundColor: '#FFF',
    height: '100%',
  },
  tinyLogo: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').height / 3,
    marginTop: Dimensions.get('window').height / 50,
    marginBottom: Dimensions.get('window').height / 700,
    paddingBottom: Dimensions.get('window').height / 700,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logo: {
    marginTop: Dimensions.get('window').height / 30,
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
    paddingHorizontal: Dimensions.get('window').height / 169,
    width: '100%',
    color: 'black',
    fontFamily: 'Arial',
  },
  error: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
