import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Screens} from '../navigation/Screens';
import {NavigationActions} from '../navigation/NavigationActions';
import { SSO_OAuth_Get_ACCESS_TOKEN } from '../utils/Constant';
import { getAccessToken } from '../services/ssoLoginAPI';
Icon.loadFont();

export const Login = (): JSX.Element => {
  const [email, setEmail] = useState('1');
  const [password, setPassword] = useState('1');
  const [status,setStatus]=useState('');


  
  const validate = async (email: string, password: string) => {

    if (email == '1' && password == '1') {
      // alert("Correct UserName and Password.");
      NavigationActions.navigateToScreen({
        screenName: Screens.DefaultDrawer,
      });
    } else {
      try{
        const OauthDetails= await getAccessToken(email,password);
        
        
        console.log(typeof(OauthDetails),'khbkhvhv');
        // let OAuthDetailsJSON=JSON.parse(OauthDetails);
        console.log('ppppppppppppppppppppp',Object.keys(OauthDetails),OauthDetails['access_token'])
        if (OauthDetails.access_token!=undefined)
       {   NavigationActions.navigateToScreen({
            screenName: Screens.DefaultDrawer,
          });
        } else {
          console.log(OauthDetails,"pp");
          alert("Incorrect UserName and Password.");
          // ToastAndroid.showWithGravity(
          //   ' Incorrect UserName and Password.',
          //   ToastAndroid.LONG,
          //   ToastAndroid.CENTER,
          // );
     
        }
      }
      catch
      {
        (e: Error) => {
          console.log(e + 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
          alert("Incorrect UserName and Password.");
      
          // ToastAndroid.showWithGravity(
          //   ' Something went wrong.\n Please try again',
          //   ToastAndroid.SHORT,
          //   ToastAndroid.CENTER,
          // );
     
        };
      }
 
      OAuthAuthentication(email,password)
      // Alert.alert('Incorrect Email or Password');
    }


  };
  const OAuthAuthentication = async (email: string, password: string) => {
    // toggleModal();

  
  }
  
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
    padding: Dimensions.get('window').height / 15,
    //marginTop: Dimensions.get('window').height / 17,
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
