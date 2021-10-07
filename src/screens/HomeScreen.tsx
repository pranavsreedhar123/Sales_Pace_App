import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import _ from 'lodash';
import {getHousingDataAxwayAPI} from '../services/govtProjectsAPI';

import {ThemeContext} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationActions} from '../navigation/NavigationActions';
import {Screens} from '../navigation/Screens';
import {getTradeFairDataAPI} from '../services/tradeFairsAPI';

const HomeScreen = () => {
  const [groupedGovtTenders, setGroupedGovtTenders] = useState<any>([]);
  const [filteredGovtTenders, setFilteredGovtTenders] = useState<any>([]);
  const [filteredTradeFair, setFilteredTradeFair] = useState<any>([]);
  const [groupedTradeFair, setGroupedTradeFair] = useState<any>([]);

  useEffect(() => {
    const getHousingData = async () => {
      try {
        let crawledHousingData = await getHousingDataAxwayAPI();

        setFilteredGovtTenders(JSON.parse(crawledHousingData));
      } catch (e) {}
    };

    getHousingData();
  }, []);

  useEffect(() => {
    try {
      const getTradeFairData = async () => {
        let crawledHousingData: string = await getTradeFairDataAPI(50, 0);

        setFilteredTradeFair(JSON.parse(crawledHousingData));
      };
      getTradeFairData();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  useEffect(() => {
    const getGroupedAndFilteredData = () => {
      const tendersGroupedByType = _.groupBy(
        filteredGovtTenders,
        'tender_type',
      );
      //   setLoading(false);

      const mappedCrawledTenders = _.map(
        tendersGroupedByType,
        (value: any, key: any) => {
          return {
            tender_type: key,
            data: value,
          };
        },
      );
      console.log(mappedCrawledTenders, '*********************');

      setGroupedGovtTenders(mappedCrawledTenders);
      // setTenderData(mappedCrawledTenders)
    };
    filteredGovtTenders && getGroupedAndFilteredData();
  }, [filteredGovtTenders]);

  useEffect(() => {
    const getGroupedAndFilteredData = () => {
      // alert(12)
      const tendersGroupedByType = _.groupBy(filteredTradeFair, 'city');
      const mappedCrawledTenders = _.map(
        tendersGroupedByType,
        (value: any, key: any) => {
          return {
            city: key,
            data: value,
          };
        },
      );
      console.log(mappedCrawledTenders, 'jewfniewfiewfoiewf');
      setGroupedTradeFair(mappedCrawledTenders);
    };
    filteredTradeFair && getGroupedAndFilteredData();
  }, [filteredTradeFair]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Image style={styles.splogo} source={require('../SPImages/SPLogo.png')} /> */}
      <View style={styles.myBar}>
        <TouchableOpacity
          onPress={() => {
            NavigationActions.navigateToScreen({
              screenName: Screens.GovtProjectScreen,
            });
          }}>
          <>
            <Text style={styles.myBarTitle}>ALL TENDERS</Text>
            <View style={styles.myBarHandler}>
              <ScrollView horizontal={true}>
                {groupedGovtTenders.map((govtTenders: any, index: number) => (
                  <View key={index}>
                    <View style={styles.myBarData}>
                      <Text
                        style={{
                          color: 'darkblue',
                          flex: 1,
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          alignContent: 'center',
                          textAlignVertical: 'center',
                          paddingHorizontal: 5,
                          fontWeight: 'bold',
                        }}>
                        {govtTenders.tender_type}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        </TouchableOpacity>
      </View>

      <View style={styles.myBar}>
        <TouchableOpacity
          onPress={() => {
            NavigationActions.navigateToScreen({
              screenName: Screens.TradeFairScreen,
            });
          }}>
          <>
            <Text style={styles.myBarTitle}>ALL TRADE FAIRS</Text>

            <View style={styles.myBarHandler}>
              <ScrollView horizontal={true}>
                {groupedTradeFair.map((tradeFair: any, index: number) => (
                  <View key={index}>
                    <View style={styles.myBarData}>
                      <Text
                        style={{
                          color: 'darkblue',
                          flex: 1,
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          alignContent: 'center',
                          textAlignVertical: 'center',
                          paddingHorizontal: 5,
                          fontWeight: 'bold',
                        }}>
                        {tradeFair.city}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 5,
          alignContent: 'flex-end',
          marginTop: 30,
        }}>
        <View
          style={{
            ...styles.myBarData,
            width: '50%',
            height: 200,
            paddingHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              NavigationActions.navigateToScreen({
                screenName: Screens.TopVloggerScreen,
              });
            }}>
            <Text style={{color: 'darkblue', fontWeight: 'bold'}}>
              Top Vloggers
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            ...styles.myBarData,
            width: '50%',
            height: 200,
          }}>
          <TouchableOpacity
            onPress={() => {
              NavigationActions.navigateToScreen({
                screenName: Screens.VideoScreen,
              });
            }}>
            <Text style={{color: 'darkblue', fontWeight: 'bold'}}>
              Video Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.myBar}>
        <Text style={styles.myBarTitle}>NEW TITLE HERE</Text>
        <View style={styles.myBarHandler}>
          <ScrollView horizontal={true}>
            <View style={styles.myBarData}></View>
            <View style={styles.myBarData}></View>
            <View style={styles.myBarData}></View>
          </ScrollView>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'baseline',
  },
  splogo: {
    width: 80,
    height: 60,
    marginTop: 20,
    marginLeft: 20,
    padding: 5,
  },
  myBar: {
    marginTop: 10,
    //backgroundColor: "lightpink",
    width: '100%',
    height: 150,
  },
  myBarTitle: {
    marginTop: 5,
    marginLeft: 5,
    padding: 5,
    fontWeight: 'bold',
    color: '#F15D22',
  },
  myBarHandler: {
    flexDirection: 'row',
  },
  myBarData: {
    marginTop: 5,
    marginLeft: 5,
    width: 150,
    height: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'darkblue',
  },
});
