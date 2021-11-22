import React from 'react';
import {Image, Text, View, Dimensions} from 'react-native';

const MiniCard = (props: any) => {
  return (
    <View
      style={{flexDirection: 'row', margin: 10, backgroundColor: '#ebebe6'}}>
      <Image
        source={{uri: props.thumbnail}}
        style={{
          width: '45%',
          height: 100,
        }}
      />
      <View style={{paddingLeft: 7, width: Dimensions.get('window').width / 2}}>
        <Text
          style={{
            fontSize: 17,
          }}
          ellipsizeMode="tail"
          numberOfLines={2}>
          {props.channel}
        </Text>
        <Text style={{fontSize: 13}} ellipsizeMode="tail" numberOfLines={2}>
          <Text style={{fontSize: 13, fontWeight: 'bold'}}>
            Related Videos:{' '}
          </Text>
          {props.title}
        </Text>
        <Text style={{fontSize: 13, fontWeight: 'bold'}}>
          Subscribers:
          <Text
            style={{color: props.isFilteredBySubscribers ? 'red' : 'black'}}>
            {' '}
            {props.subscriberCount}
          </Text>
        </Text>
        <Text style={{fontSize: 13, fontWeight: 'bold'}}>
          Total Views:
          <Text
            style={{
              color: props.isFilteredByViews ? 'red' : 'black',
              fontWeight: 'bold',
            }}>
            {' '}
            {props.viewCount}{' '}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default MiniCard;
