import React from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View, Alert, Dimensions } from 'react-native';

interface Props {
    children: React.ReactNode;
}

interface State {
    email: string;
    password: string;
}

class Login extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {email:"", password:""};
    }
    validate(email:string, password:string){
        if(email!=="pranavsreedhar2002@gmail.com" && password!=="password123") {
            Alert.alert("Incorrect Email or Password");   
        } else {
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source = {require('../images/SalesPace.png')} style={styles.logo}></Image>
                <View style={{
                    flexDirection:"row",
                    alignItems:"center",
                    marginHorizontal:0,
                    borderWidth:2,
                    marginTop:Dimensions.get('window').height/12,
                    paddingHorizontal:15,
                    borderColor:"#00716F",
                    borderRadius:23,
                    paddingVertical:2
                }}>
                    
                    <TextInput
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Email"
                        style={styles.input}
                        returnKeyLabel={"next"}
                        onChangeText={(text:string)=>this.setState({email:text})}
                    />
                </View>
                <View style={{
                    flexDirection:"row",
                    alignItems:"center",
                    marginHorizontal:0,
                    borderWidth:2,
                    marginTop:Dimensions.get('window').height/42,
                    paddingHorizontal:15,
                    borderColor:"#00716F",
                    borderRadius:23,
                    paddingVertical:2
                }}>
                    <TextInput
                        secureTextEntry
                        autoCapitalize="none"
                        placeholder="Password"
                        style={styles.input}
                        returnKeyLabel={"next"}
                        onChangeText={(text:string)=>this.setState({password:text})}
                    />
                </View>
                <View style={{
                    marginHorizontal:Dimensions.get('window').width/7,
                    alignItems:"center",
                    justifyContent:"center",
                    marginTop:Dimensions.get('window').height/25,
                    backgroundColor:"#00716F",
                    borderRadius:23,
                    paddingVertical:8
                }}>
                    <Text 
                        style={styles.text}
                        onPress={()=>this.validate(this.state.email,this.state.password)}>
                        Sign In
                    </Text>
                </View>
                <View style={{
                    marginHorizontal:Dimensions.get('window').width/7,
                    alignItems:"center",
                    justifyContent:"center",
                    marginTop:Dimensions.get('window').height/42,
                    backgroundColor:"#00716F",
                    borderRadius:23,
                    paddingVertical:8
                }}>
                    <Text 
                        style={styles.text}
                        onPress={()=>this.navigation.navigate("SignIn")}>
                        Sign Up
                    </Text>
                </View>
                <Image source = {require('../images/sg.png')} style={styles.tinyLogo}></Image>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
      padding: 50,
      marginTop: Dimensions.get('window').height/17,
      backgroundColor:"#FFF",
      height:"100%",
    },
    tinyLogo: {
      width: Dimensions.get('window').width/3,
      height: Dimensions.get('window').height/8,
      resizeMode:'contain',
      alignSelf:"center",
    },
    logo: {
      width: Dimensions.get('window').width/1.3,
      height: Dimensions.get('window').height/4,
      resizeMode:'contain',
      alignSelf:"center",
    },
    title: {
        fontSize: 30,
        fontWeight:'bold',
    },
    text: {
        fontSize: 20,
        color:"white"
    },
    input: {
        paddingHorizontal:10,
    },
    error:{
        borderWidth:2,
        borderColor:'red',
    }
});
export default Login;
