import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
//import { getActiveChildNavigationOptions } from 'react-navigation';
import MiniCard from './src/screen/MiniCard';

interface Props {
  children: React.ReactNode;
}

interface State {
  value: String; //QUERY
  miniCardData: Array<String>; //INITIAL DATA GOT BY FETCH SEARCH DATA
  filterMiniData: Array<String>; //ARRAY TO FILTER MINICARDDATA
  filterData: Array<String>; //ARRAY THAT'S PASSED AS THE DATA FOR THE FLATLIST
  statistics: Array<String>; //DATA GOT MY FETCH CHANNEL DATA (subscribers, viewcount)
  subView: number[]; //ARRAY WITH SUBSCRIBERS and VIEW COUNT alternating each other Ex. [sub1, viewcount1, sub2, viewcount2] ..
  loading: boolean; //LOADING - ACTIVITY INDICATOR
}

class TTV extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      miniCardData: [],
      filterMiniData: [],
      filterData: [],
      statistics: [],
      subView: [],
      loading: false,
    };
  }
  /* FETCH METHOD: GETS THE VIDEOS BASED ON THE QUERY */

  async fetchData() {
    this.setState({loading: true});
    await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${this.state.value}&regionCode=IN&key=AIzaSyBZ3PGw-NX1QRy8uvKKsgUOhVtdwGqk_sw`,
    )
      .then(res => res.json())
      .then(data => {
        this.setState({loading: false});
        this.setState({miniCardData: data.items});
      })
      .catch(error => {
        console.error(error);
      });
    this.filter();
  }

  /* FILTER METHOD: MAKES SURE NO DUPLICATE CHANNELS EXIST + FINDS SUBSCRIBERS + TOTAL VIEWS */
  async filter() {
    let duplicate: boolean = false;
    let index: number = 1;
    this.state.filterMiniData[0] = this.state.miniCardData[0];
    for (let i = 1; i < this.state.miniCardData.length; i++) {
      if (index <= 4) {
        let x: number = i - 1;
        while (x >= 0 && duplicate === false) {
          if (
            this.state.miniCardData[i].snippet.channelTitle ===
            this.state.miniCardData[x].snippet.channelTitle
          ) {
            duplicate = true;
          }
          x--;
        }
        if (duplicate === false) {
          this.state.filterMiniData[index] = this.state.miniCardData[i];
          index++;
        }
      }
    }
    let i: number = 0;
    for (let filteredData of this.state.filterMiniData) {
      await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${filteredData.snippet.channelId}&key=AIzaSyBZ3PGw-NX1QRy8uvKKsgUOhVtdwGqk_sw`,
      )
        .then(res => res.json())
        .then(data => {
          this.setState({statistics: data.items});
        })
        .catch((error) => {
          console.error(error);
        });
      this.state.subView[i] =
        this.state.statistics[0].statistics.subscriberCount;
      i++;
      this.state.subView[i] = this.state.statistics[0].statistics.viewCount;
      i++;
    }

    this.setState({filterData: this.state.filterMiniData});
  }
  filterSubscriber() {
    /* SORTING ALGORITHM: SORTING BY SUBSCRIBERS  */
    let subs: number[] = this.state.subView;
    let n: number = this.state.subView.length;
    for (let i = 0; i < n; i += 2) {
      let max: number = i;
      for (let j: number = i + 2; j < n; j += 2) {
        if (subs[j] > subs[max]) {
          max = j;
        }
      }
      if (max != i) {
        let subTmp: number = subs[i];
        let dataTmp: String = this.state.filterMiniData[i / 2];
        let viewTmp: number = subs[i + 1];
        subs[i] = subs[max];
        this.state.filterMiniData[i / 2] = this.state.filterMiniData[max / 2];
        subs[i + 1] = subs[max + 1];
        subs[max] = subTmp;
        this.state.filterMiniData[max / 2] = dataTmp;
        subs[max + 1] = viewTmp;
      }
    }
    this.setState({subView: subs});
  }
  filterView() {
    /* SORTING ALGORITHM: SORTING BY VIEWCOUNT  */
    let view: number[] = this.state.subView;
    let n: number = this.state.subView.length;
    for (let i: number = 1; i < n; i += 2) {
      let max: number = i;
      for (let j: number = i + 2; j < n; j += 2) {
        if (view[j] > view[max]) {
          max = j;
        }
      }
      if (max != i) {
        let viewTmp: number = view[i];
        let dataTmp: String = this.state.filterMiniData[(i - 1) / 2];
        let subTmp: number = view[i - 1];
        view[i] = view[max];
        this.state.filterMiniData[(i - 1) / 2] =
          this.state.filterMiniData[(max - 1) / 2];
        view[i - 1] = view[max - 1];
        view[max] = viewTmp;
        this.state.filterMiniData[(max - 1) / 2] = dataTmp;
        view[max - 1] = subTmp;
        // Alert.alert(
        //   this.state.filterMiniData[0].snippet.channelTitle +
        //     ' ' +
        //     view[0] +
        //     ' ' +
        //     view[1],
        // );
      }
    }
    this.setState({subView: view});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <TextInput
            placeholder="Search Query"
            style={styles.input}
            value={this.state.value}
            onChangeText={text => this.setState({value: text})}
          />
          <Text style={styles.text} onPress={() => this.fetchData()}>
            Search
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              paddingRight: 10,
              paddingLeft: 18,
              fontSize: 14,
              fontWeight: 'bold',
            }}>
            Filter by:
          </Text>
          <Text
            style={styles.textButton}
            onPress={() => this.filterSubscriber()}>
            Subscribers
          </Text>
          <Text style={styles.textButton} onPress={() => this.filterView()}>
            View Count
          </Text>
        </View>

        {this.state.loading ? (
          <ActivityIndicator
            style={{marginTop: Dimensions.get('window').height / 84}}
            size="large"
            color="red"
          />
        ) : null}

        {/* FLATLIST WHICH TAKES TWO DATA SOURCES: THE CHANNELS (FilterData) + SUBSCRIBERS/VIEW COUNT (subView) returns MINICARD OBJECT*/}
        <FlatList
          data={this.state.filterData}
          extraData={this.state.subView}
          //initialNumToRender={5}
          keyExtractor={(item) => {
            return item.id.videoId;
          }}
          renderItem={({item, index}) => {
            return <MiniCard
                // videoId={item.id.videoId}
                channel={item.snippet.channelTitle} //Channel name
                title={item.snippet.title} //Video related to the query
                thumbnail={item.snippet.thumbnails.medium.url} //Thumbnail of the video - Might want to remove it???
                viewCount={this.state.subView[index * 2 + 1]} //ViewCount (index*2 + 1) since it's at every odd indices
                subscriberCount={this.state.subView[index * 2]} //Subscriber (index*2) since it's at every even indices
              />
          }}
          // maxToRenderPerBatch={5}
        />
      </View>
    );
  }
}
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
export default TTV;
