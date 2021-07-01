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
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
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
  const [filterOptionStatus, setFilterOptionStatus] = useState(false);

  const fetchYTChannels = async () => {
    setFilterOptionStatus(false);
    setIsLoading(true);
    try {
      let YouTubeChannels = await getYouTubeChannelsAPI(videoSearchText);

      setIsLoading(false);
      setFilterOptionStatus(true);
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
    Alert.alert('Filter Options', 'Select an option', [
      {
        text: 'Subscriber',
        onPress: () => filterSubscriber(),
      },
      {text: 'View Count', onPress: () => filterView()},
    ]);
  };
  const filterSubscriber = React.useCallback(() => {
    setSortedByViewsData([]);
    let sortedYTChannelBySubscribers = Helpers.sortArrayByKey(
      miniCardData,
      'subscribers',
    );
    let reverseSortedYTChannelBySubscribers = Helpers.reverseArray(
      sortedYTChannelBySubscribers,
    );
    setMiniCardData(reverseSortedYTChannelBySubscribers);
    setSortedBySubscribersData(reverseSortedYTChannelBySubscribers);
  }, [miniCardData]);

  const filterView = () => {
    setSortedBySubscribersData([]);
    let sortedYTChannelByViews = Helpers.sortArrayByKey(miniCardData, 'views');
    let reverseSortedYTChannelByViews = Helpers.reverseArray(
      sortedYTChannelByViews,
    );
    setMiniCardData(reverseSortedYTChannelByViews);
    setSortedByViewsData(reverseSortedYTChannelByViews);
  };

  return (
    <>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <TextInput
            placeholder="Search Channel"
            style={styles.input}
            value={videoSearchText}
            onChangeText={text => setVideoSearchText(text)}
          />
          {/* <Icon
            name="search1"
            size={30}
            color="#900"
            onPress={() => fetchYTChannels()}
          /> */}
          <Text style={styles.text} onPress={() => fetchYTChannels()}>
            Search
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {filterOptionStatus && (
            <Text
              style={{
                paddingRight: 10,
                paddingLeft: 18,
                fontSize: 14,
                fontWeight: 'bold',
                color: 'blue',
              }}
              onPress={() => filterOption()}>
              Click here for filter options:
            </Text>
          )}
          {/* <Text
            style={{
              paddingRight: 10,
              paddingLeft: 18,
              fontSize: 14,
              fontWeight: 'bold',
              color: 'blue',
            }}
            onPress={() => filterOption()}>
            Click here for filter options:
          </Text> */}
          {/* <Text style={styles.textButton} onPress={() => filterSubscriber()}>
            Subscribers
          </Text>
          <Text style={styles.textButton} onPress={() => filterView()}>
            View Count
          </Text> */}
        </View>

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
      </View>
      {isLoading && (
        <ActivityIndicator
          style={{marginTop: Dimensions.get('window').height / 84}}
          size="large"
          color="red"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    paddingHorizontal: 15,
    paddingRight: 0,
    paddingBottom: 10,
    flexDirection: 'row',
    marginTop: Dimensions.get('window').height / 17,
    width: Dimensions.get('window').width,
    backgroundColor: '#FFF',
    height: '11%',
  },
  tinyLogo: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').height / 8,
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
  textButton: {
    fontSize: 14,
    padding: 5,
    fontWeight: 'bold',
    paddingTop: 0,
    marginLeft: Dimensions.get('window').width / 100,
    color: 'white',
    backgroundColor: 'red',
    width: Dimensions.get('window').width * 0.24,
  },
  input: {
    width: '70%',
    borderColor: '#c6c8cc',
    borderWidth: 2,
    borderRadius: 25,
    padding: 5,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 10,
  },
  error: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
