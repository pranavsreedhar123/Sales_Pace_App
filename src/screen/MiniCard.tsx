import React from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View, Alert, Dimensions } from 'react-native';

const MiniCard = (props: any)=>{
    return(
        <View style={{flexDirection:"row",margin:10}}>
            <Image
                source={{uri:props.thumbnail}}
                style={{
                    width:"45%",
                    height:100
                }}/>
            <View style={{paddingLeft:7,width:Dimensions.get("window").width/2}}>
                <Text style={{
                    fontSize:17,
                }}
                ellipsizeMode="tail"
                numberOfLines={2}
                >{props.channel}</Text>
                <Text style={{fontSize:13}}
                    ellipsizeMode="tail"
                    numberOfLines={2}>
                    <Text style={{fontSize:13, fontWeight:'bold'}}>Related video: </Text>
                    {props.title}
                </Text>
                <Text style={{fontSize:13}}> 
                    <Text style={{fontSize:13, fontWeight:'bold'}}>Subscribers: </Text>
                    {props.subscriberCount}
                </Text>
                <Text style={{fontSize:13}}>
                    <Text style={{fontSize:13, fontWeight:'bold'}}>Total Views: </Text> 
                    {props.viewCount}
                </Text> 
                
            </View>
        </View>
    )
    
}

export default MiniCard