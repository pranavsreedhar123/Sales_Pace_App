import React, {useState} from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
  //Share,
  Platform,
} from 'react-native';
import Share from 'react-native-share';
import {Icon} from 'react-native-elements';

const openYouTubeURL = async (youtube_url: string) => {
  await Linking.openURL(youtube_url);

  // .catch(()=>{console.log("ERROR")});
};

const VideoCard = (props: any) => {
  const url = 'https://www.youtube.com/watch?v=' + props.videoId;
  const title = 'YouTube URL';
  const message = "Here's the YouTube URL: ";
  const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
  // const shareOptions = Platform.select({
  //   ios: {
  //     activityItemSources: [
  //       {
  //         // For sharing url with custom title.
  //         placeholderItem: {type: 'url', content: url},
  //         item: {
  //           default: {type: 'url', content: url},
  //         },
  //         subject: {
  //           default: title,

  //         },
  //         linkMetadata: {originalUrl: url},
  //       },
  //       {
  //         // For sharing text.
  //         //placeholderItem: {type: 'text', content: message},
  //         item: {
  //           default: {type: 'text', content: message},
  //           message: null, // Specify no text to share via Messages app.
  //         },
  //         linkMetadata: {
  //           // For showing app icon on share preview.
  //           //title: message,
  //         },
  //       },
  //       {
  //         // For using custom icon instead of default text icon at share preview when sharing with message.
  //         // placeholderItem: {
  //         //   type: 'url',
  //         //   content: icon,
  //         // },
  //         item: {
  //           default: {
  //             type: 'text',
  //             content: `${message} ${url} ${'. Please check it out!'}`,
  //           },
  //         },
  //         linkMetadata: {
  //           title: message,
  //           icon: icon,
  //         },
  //       },
  //     ],
  //   },
  //   default: {
  //     title,
  //     subject: title,
  //     message: `${message} ${url}`,
  //   },
  // });

  const onShare = async () => {
    try {
      const shareResponse = await Share.open({
        title: "Here's the YouTube URL",
        message: 'YouTube URL:',
        subject: "Here's the YouTube URL",
        url: 'https://www.youtube.com/watch?v=' + props.videoId,
      });
    } catch (error) {
      if (error.message === 'User did not share') {
        console.log(error.message);
      } else {
        Alert.alert(error.message);
      }
    }
  };

  // let link: string = '';
  // // const [link, setLink] = useState('');
  // if (Platform.OS === 'android') {
  //   link = 'https://www.youtube.com/watch?v=' + props.videoId;
  // } else if (Platform.OS === 'ios') {
  //   link = 'YouTube URL';
  // }
  // const onShare = async () => {
  //   try {
  //     const result = await Share.share(
  //       {
  //         message: link,
  //         url: 'https://www.youtube.com/watch?v=' + props.videoId,
  //         title: 'YouTube ',
  //       },
  //       {
  //         subject: "Here's the YouTube link to the video",
  //         dialogTitle: 'YouTube URL',
  //       },
  //     );
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error) {
  //     Alert.alert(error.message);
  //   }
  // };
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
