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
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import MiniCard from './MiniCard';
import {Helpers} from '../utils/Helpers';
import {YT_CHANNEL_DATA} from '../utils/Constant';
import {YTChannelItem} from '../types/YTChannel';
import {
  getYTChannelsStatsticsAPI,
  getYouTubeChannelsAPI,
  getYTChannelsSnippetAPI,
} from '../services/youTubeAPIs';
Icon.loadFont();
Icon1.loadFont();

export const TopVloggerScreen = (): JSX.Element => {
  const [videoSearchText, setVideoSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortedBySubscribersData, setSortedBySubscribersData] = useState<
    YTChannelItem[]
  >([]);
  const [sortedByViewsData, setSortedByViewsData] = useState<YTChannelItem[]>(
    [],
  );
  const [miniCardData, setMiniCardData] = useState<YTChannelItem[]>([]);
  const [filterStatus, setFilterStatus] = useState(false);
  const [filterOptionStatus, setFilterOptionStatus] = useState(false);
  const [isFilteredBySubscribers, setIsFilteredBySubscribers] = useState(false);
  const [isFilteredByViews, setIsFilteredByViews] = useState(false);

  const fetchYTChannels = async () => {
    Keyboard.dismiss();
    setFilterStatus(false);
    setFilterOptionStatus(false);
    setIsLoading(true);
    try {
      let YouTubeChannels = await getYouTubeChannelsAPI(videoSearchText);

      setIsLoading(false);
      let tempDataArray: YTChannelItem[] = YouTubeChannels?.items.map(
        (yTChannelData: YTChannelItem) => {
          return {
            etag: yTChannelData.etag,
            id: yTChannelData.id,
            videoId: yTChannelData.id.videoId,
            kind: yTChannelData.kind,
            snippet: yTChannelData.snippet,
            channelId: yTChannelData.snippet?.channelId,
          };
        },
      );
      tempDataArray.length && filterYTChannels(tempDataArray);
    } catch (error) {
      console.error(error);
    }
    setFilterStatus(true);
  };

  const filterYTChannels = React.useCallback(
    async (tempDataArray: YTChannelItem[]) => {
      /* FILTER METHOD: MAKES SURE NO DUPLICATE CHANNELS EXIST + FINDS SUBSCRIBERS + TOTAL VIEWS */
      let uniqueYTChannels = Helpers.getUniqueArray(tempDataArray, 'channelId');

      let YTChannelDatawithCounts: YTChannelItem[] = [];

      await Promise.all(
        uniqueYTChannels?.map(async (channel: any) => {
          let channelStat = await getChannelStatistics(
            channel?.snippet?.channelId,
          );
          let channelSnippet = await getChannelSnippet(
            channel?.snippet?.channelId,
          );
          if (channelStat) {
            let YTchannelDetails = {
              ...channel,
              subscribers: Number(channelStat.subscriberCount),
              views: Number(channelStat.viewCount),
              thumbnailC: channelSnippet.thumbnails.medium.url,
              hiddenSubscriber: channelStat.hiddenSubscriberCount,
            };
            YTChannelDatawithCounts.push(YTchannelDetails);
          }
        }),
      );
      setMiniCardData(YTChannelDatawithCounts);
    },
    [],
  );

  const getChannelStatistics: any = React.useCallback(
    async (channelId: string) => {
      try {
        let statistics;
        let StatisticsAPI = await getYTChannelsStatsticsAPI(channelId);
        statistics = StatisticsAPI?.items?.[0].statistics;
        return statistics;
      } catch (e) {
        console.log(e);
        return {};
      }
    },
    [],
  );

  const getChannelSnippet: any = React.useCallback(
    async (channelId: string) => {
      try {
        let snippet;
        let SnippetAPI = await getYTChannelsSnippetAPI(channelId);
        snippet = SnippetAPI?.items?.[0].snippet;
        return snippet;
      } catch (e) {
        console.log(e);
        return {};
      }
    },
    [],
  );

  const filterOption = () => {
    setFilterOptionStatus(!filterOptionStatus);
    //setFilterStatus(false);
    // Alert.alert('Filter Channels', 'Select an option', [
    // {
    //   text: 'Subscriber',
    //   onPress: () => filterSubscriber(),
    // },
    // {text: 'View Count', onPress: () => filterView()},
    // ]);
  };
  const filterSubscriber = React.useCallback(() => {
    // setIsFilteredByViews(false);
    // setIsFilteredBySubscribers(!isFilteredBySubscribers);
    for (const item of miniCardData) {
      if (item.hiddenSubscriber == false) {
        filterView();
        break;
      }
    }
    setSortedByViewsData([]);
    // if (isFilteredBySubscribers) {
    let sortedYTChannelBySubscribers = Helpers.sortArrayByKey(
      miniCardData,
      'subscribers',
    );
    let reverseSortedYTChannelBySubscribers = Helpers.reverseArray(
      sortedYTChannelBySubscribers,
    );
    setMiniCardData(reverseSortedYTChannelBySubscribers);
    setSortedBySubscribersData(reverseSortedYTChannelBySubscribers);
    // }
  }, [miniCardData]);

  const filterView = () => {
    // setIsFilteredBySubscribers(false);
    // setIsFilteredByViews(!isFilteredByViews);
    setSortedBySubscribersData([]);
    // if (isFilteredByViews) {
    let sortedYTChannelByViews = Helpers.sortArrayByKey(miniCardData, 'views');
    let reverseSortedYTChannelByViews = Helpers.reverseArray(
      sortedYTChannelByViews,
    );
    setMiniCardData(reverseSortedYTChannelByViews);
    setSortedByViewsData(reverseSortedYTChannelByViews);
    // }
  };

  return (
    <>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search Channel"
              style={styles.input}
              value={videoSearchText}
              onChangeText={text => setVideoSearchText(text)}
            />
            <Icon
              name="search1"
              size={30}
              color="#005A9C"
              onPress={() => fetchYTChannels()}
            />
            {filterStatus && (
              <View
                style={{
                  alignItems: 'flex-start',
                  paddingLeft: 10,
                  paddingTop: 5,
                }}>
                <Icon1
                  name="sort-amount-desc"
                  size={25}
                  color="#005A9C"
                  onPress={() => filterOption()}
                />
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            {filterOptionStatus && (
              <View
                style={{
                  flexDirection: 'row',
                  padding: 10,
                }}>
                <Text
                  style={
                    isFilteredBySubscribers
                      ? styles.textButtonEnabled
                      : styles.textButtonDisabled
                  }
                  onPress={() => filterSubscriber()}>
                  Subscribers
                </Text>
                <Text
                  style={
                    isFilteredByViews
                      ? styles.textButtonEnabled
                      : styles.textButtonDisabled
                  }
                  onPress={() => filterView()}>
                  View Count
                </Text>
              </View>
            )}
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
        <FlatList
          data={miniCardData}
          extraData={[sortedBySubscribersData, sortedByViewsData]}
          //initialNumToRender={5}
          keyExtractor={item => {
            return item.id.videoId;
          }}
          renderItem={({item}) => {
            return (
              <MiniCard
                channel={item.snippet.channelTitle} //Channel name
                title={item.snippet.title} //Video related to the query
                thumbnail={item.thumbnailC} //Thumbnail of the channel
                viewCount={item.views} //ViewCount
                subscriberCount={item.subscribers} //Subscriber
              />
            );
          }}
        />
        {/* <Image
          source={require('../images/sg.png')}
          style={styles.tinyLogo}></Image> */}
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
