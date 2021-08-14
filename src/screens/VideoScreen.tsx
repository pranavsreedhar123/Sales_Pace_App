import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  Modal,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';
import VideoCard from './VideoCard';
import {Helpers} from '../utils/Helpers';
import {YT_CHANNEL_DATA} from '../utils/Constant';
import {YTChannelItem, YTVideoItem} from '../types/YTChannel';
import {
  getYTChannelsStatsticsAPI,
  getYouTubeChannelsAPI,
  getYTChannelsSnippetAPI,
  getYouTubeVideosAPI,
} from '../services/youTubeAPIs';
import {useEffect} from 'react';
import {Picker} from 'native-base';
import {Picker as SelectPicker} from '@react-native-picker/picker';
import {TouchableOpacity} from 'react-native';
import {pick} from 'lodash';
export const VideoScreen = (): JSX.Element => {
  const [channel, setChannel] = useState('Saint-Gobain Glass');
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('Search video by');
  const [query, setQuery] = useState('');
  const [linkStatus, setLinkStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState(false);
  const [link, setLink] = useState('');
  const [miniCardData, setMiniCardData] = useState<YTChannelItem[]>([]);
  const fetchYTVideos = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      let YouTubeVideos = await getYouTubeVideosAPI(
        'UCewFSOTzBXhH3A8hWezvTng',
        query,
      );
      if (channel === 'Saint-Gobain Gyproc') {
        YouTubeVideos = await getYouTubeVideosAPI(
          'UCFK6xXDAhAL7KOpU_Zh06Sg',
          query,
        );
      } else if (channel === 'Saint-Gobain Weber') {
        YouTubeVideos = await getYouTubeVideosAPI(
          'UCkD1GzyS-LREFkBJqKU1dqw',
          query,
        );
      }
      setIsLoading(false);
      let tempDataArray: YTVideoItem[] = YouTubeVideos?.items.map(
        (yTVideoData: YTVideoItem) => {
          return {
            etag: yTVideoData.etag,
            id: yTVideoData.id,
            videoId: yTVideoData.id.videoId,
            kind: yTVideoData.kind,
            snippet: yTVideoData.snippet,
            channelId: yTVideoData.snippet?.channelId,
            title: yTVideoData.snippet?.title,
            description: yTVideoData.snippet?.description,
            thumbnail: yTVideoData.snippet?.thumbnails?.medium.url,
          };
        },
      );
      setSearchText('Search video by ' + channel);
      //setSearchStatus(true);
      //tempDataArray.length && getYTVideos(tempDataArray);
      setMiniCardData(tempDataArray);
    } catch (error) {
      console.error(error);
    }
  };

  if (Platform.OS === 'ios') {
    useEffect(() => {
      fetchYTVideos();
    }, []);
  } else if (Platform.OS === 'android') {
    useEffect(() => {
      fetchYTVideos();
    }, [channel]);
  }

  return (
    <>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          {Platform.OS === 'android' && (
            <View style={{flexDirection: 'row'}}>
              <View style={styles.androidPicker}>
                <Picker
                  selectedValue={channel}
                  mode="dropdown"
                  onValueChange={value => {
                    setChannel(value);
                    //fetchYTVideos();
                    setSearchStatus(false);
                  }}>
                  <Picker.Item
                    label="Saint-Gobain Glass"
                    value="Saint-Gobain Glass"
                  />
                  <Picker.Item
                    label="Saint-Gobain Gyproc"
                    value="Saint-Gobain Gyproc"
                  />
                  <Picker.Item
                    label="Saint-Gobain Weber"
                    value="Saint-Gobain Weber"
                  />
                </Picker>
              </View>
              {/* <Icon
                raised
                style={{paddingTop: 5}}
                size={19}
                name="search"
                color="#005A9C"
                type="font-awesome"
                onPress={() => fetchYTVideos()}
              /> */}
            </View>
          )}
          {Platform.OS === 'ios' && (
            <View style={styles.searchBox}>
              <Text style={styles.input}>{channel}</Text>

              <Icon
                raised
                style={{padding: 0}}
                size={19}
                name="caret-down"
                color="#005A9C"
                type="font-awesome"
                onPress={() => setVisible(true)}
              />

              <View
                style={{
                  alignItems: 'flex-start',
                  paddingLeft: 0,
                }}>
                {/* <Icon
                raised
                style={{padding: 0}}
                size={19}
                name="search"
                color="#005A9C"
                type="font-awesome"
                onPress={() => fetchYTVideos()}
              /> */}
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
            }}></View>

          <View style={styles.searchBox}>
            <TextInput
              style={styles.link}
              placeholder={searchText}
              placeholderTextColor="black"
              autoCapitalize="none"
              onChangeText={text => setQuery(text)}
            />
            <Icon
              raised
              style={{padding: 0}}
              size={15}
              name="search"
              color="#005A9C"
              type="font-awesome"
              onPress={() => fetchYTVideos()}
            />
          </View>
        </View>

        {isLoading && (
          <ActivityIndicator
            style={{marginTop: Dimensions.get('window').height / 84}}
            size="large"
            color="red"
          />
        )}
        {/* FLATLIST WHICH TAKES TWO DATA SOURCES: THE CHANNELS (FilterData) + SUBSCRIBERS/VIEW COUNT (subView) returns MINICARD OBJECT*/}
        {!linkStatus && (
          <FlatList
            data={miniCardData}
            //initialNumToRender={5}
            keyExtractor={item => {
              return item.id.videoId;
            }}
            renderItem={({item}) => {
              return (
                <VideoCard
                  title={item.snippet.title}
                  description={item.snippet.description}
                  thumbnail={item.snippet.thumbnails.high.url}
                  videoId={item.id.videoId}
                />
              );
            }}
          />
        )}
        {linkStatus && <View></View>}
        {/* <Image
          source={require('../images/sg.png')}
          style={styles.tinyLogo}></Image> */}
        {Platform.OS === 'ios' && (
          <Modal animated transparent visible={visible} animationType="fade">
            <View style={styles.modalView}>
              <View style={styles.pickerContainer}>
                <View style={styles.header}>
                  {/* <Icon name="close" style={{padding: 0}} size={15} type="font-awesome"/> */}
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    Choose Channel
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setVisible(false);
                      fetchYTVideos();
                    }}>
                    <Icon
                      name="check"
                      style={{paddingBottom: 5}}
                      size={25}
                      type="font-awesome"
                      color="green"
                    />
                  </TouchableOpacity>
                </View>
                <SelectPicker
                  selectedValue={channel}
                  onValueChange={value => {
                    setChannel(value);
                    setSearchStatus(false);
                  }}>
                  <SelectPicker.Item
                    label="Saint-Gobain Glass"
                    value="Saint-Gobain Glass"
                  />
                  <SelectPicker.Item
                    label="Saint-Gobain Gyproc"
                    value="Saint-Gobain Gyproc"
                  />
                  <SelectPicker.Item
                    label="Saint-Gobain Weber"
                    value="Saint-Gobain Weber"
                  />
                </SelectPicker>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   padding: 50,
  //   paddingHorizontal: 15,
  //   paddingRight: 0,
  //   paddingBottom: 10,
  //   flexDirection: 'row',
  //   marginTop: Dimensions.get('window').height / 17,
  //   width: Dimensions.get('window').width,
  //   backgroundColor: '#FFF',
  //   height: '11%',
  // },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
    padding: 5,
    backgroundColor: '#D0D0D0',
  },
  tinyLogo: {
    width: Dimensions.get('window').width / 5,
    height: Dimensions.get('window').height / 10,
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
    backgroundColor: '#005A9C',

    //backgroundColor: 'rgb(0, 0, 255)',
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
    backgroundColor: 'grey',
    //backgroundColor: 'rgb(0, 0, 255)',
    width: Dimensions.get('window').width * 0.45,
    borderRadius: 5,
  },
  input: {
    width: '70%',
    borderColor: '#005A9C',
    borderWidth: 2,
    borderRadius: 20,
    padding: 5,
    marginRight: 8,
    //backgroundColor: '#e6e6e6',
    paddingHorizontal: 5,
    height: 40,
    marginTop: 10,
    fontSize: 20,
  },
  androidPicker: {
    width: '70%',
    borderColor: '#005A9C',
    borderWidth: 2,
    // borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 5,
    paddingBottom: 50,
    height: 30,
    marginTop: 10,
    fontSize: 20,
  },
  link: {
    width: '70%',
    borderColor: '#005A9C',
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 5,
    marginRight: 8,
    //backgroundColor: '#e6e6e6',
    paddingHorizontal: 5,
    height: 30,
    marginTop: 10,
    fontSize: 12,
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
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    //height: 200,
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    justifyContent: 'space-between',
    paddingLeft: 140,
    height: 40,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
});
