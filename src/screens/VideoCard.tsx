import React from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';

const openYouTubeURL = async (youtube_url: string) => {
  await Linking.openURL(youtube_url);

  // .catch(()=>{console.log("ERROR")});
};

const VideoCard = (props: any) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'YouTube URL',
        url: 'https://www.youtube.com/watch?v=' + props.videoId,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={{flexDirection: 'row', margin: 5, backgroundColor: '#ebebe6'}}>
      {/* <TouchableOpacity
        onPress={() =>
          openYouTubeURL('https://www.youtube.com/watch?v=' + props.videoId)
        }> */}
      <Image
        source={{uri: props.thumbnail}}
        style={{
          width: '35%',
          height: 100,
        }}
      />
      {/* </TouchableOpacity> */}

      <View
        style={{
          flexDirection: 'row',
          width: Dimensions.get('window').width / 2,
          marginLeft: 5,
        }}>
        <View style={{flexDirection: 'column', marginBottom: 10}}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            {props.title}
          </Text>

          <Text style={{fontSize: 13}} ellipsizeMode="tail" numberOfLines={2}>
            <Text style={{fontSize: 13, fontWeight: 'bold'}}>
              Description:{' '}
            </Text>
            {props.description}
          </Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <TouchableOpacity
            onPress={() =>
              openYouTubeURL('https://www.youtube.com/watch?v=' + props.videoId)
            }>
            <Icon
              raised
              style={{padding: 0}}
              size={15}
              name="play"
              color="red"
              type="font-awesome"
              //onPress={() => fetchYTVideos()}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onShare()}>
            <Icon
              raised
              style={{padding: 0}}
              size={15}
              name="share-alt"
              color="#005A9C"
              type="font-awesome"
              //onPress={() => fetchYTVideos()}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* <Icon
          raised
          style={{padding: 0}}
          size={15}
          name="share-alt"
          color="#005A9C"
          type="font-awesome"
          //onPress={() => fetchYTVideos()}
        /> */}
    </View>
  );
};

export default VideoCard;
