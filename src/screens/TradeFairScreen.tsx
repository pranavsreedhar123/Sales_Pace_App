import React, {useState, useEffect} from 'react';
import _ from 'lodash';

// import { SearchBar } from 'react-native-elements';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Button,
  Linking,
  ToastAndroid,
} from 'react-native';
import {Helpers} from '../utils/Helpers';
import {Icon} from 'react-native-elements';
import {Theme} from '../styles/Theme';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {NavigationActions} from '../navigation/NavigationActions';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {
  getTradeFairDetailsAPI,
  getTradeFairDataAPI,
} from '../services/tradeFairsAPI';
import {AnalyticsHelper} from '../utils/AnalyticsHelper';
import {LabelButton} from '../components/buttons/LabelButton';
import {Screens} from '../navigation/Screens';
import {TopSearchBar} from '../components/TopSearchBar';

type RouteParams = {
  params: {
    tradeFairsList: any;
  };
};

const TradeFairScreen = ({route}: {route: RouteParams}) => {
  const {tradeFairsList} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [allTradeFair, setAllTradeFair] = useState<any>(tradeFairsList);
  const [filteredTradeFair, setFilteredTradeFair] =
    useState<any>(tradeFairsList);
  const [groupedTradeFair, setGroupedTradeFair] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [tenderSearchText, setTenderSearchText] = useState('');
  const [sourceID, setSourceID] = useState<any>();
  const [tenderID, setTenderID] = useState<any>();
  const [tenderDetails, setTenderDetails] = useState<any>({});
  const [isLoadingTenderDetails, setIsLoadingTenderDetails] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isGroupBy, setIsGroupBy] = useState(true);
  const [isSortByDateAsc, setIsSortByDateAsc] = useState(true);

  const toggleModal = () => {
    !isLoadingTenderDetails && setModalVisible(!isModalVisible);
  };
  function setFilterModal() {
    console.log('', isFilterModalVisible);
    setIsFilterModalVisible(!isFilterModalVisible);
    console.log('', isFilterModalVisible);
  }

  const passValuesInModal = async (tradeFair: any) => {
    NavigationActions.navigateToScreen({
      screenName: Screens.TradeFairScreenDetails,
      params: {
        tenderID: tradeFair.row_id,
        sourceID: tradeFair.source_id,
        tradeFairName: tradeFair.tradefair_name,
      },
    });
  };
  const checkIfURLExist = async (projectDetailsJSON: any) => {
    try {
      // await checkProjectDetailsURL('https://etender.up.nic.in/nicgep/app?page=FrontEndTenderDetailsExternal&amp;service=page&amp;tnid=915548%20');
      // await getTradeFairDataDetails(1,17)
    } catch {
      () => {
        projectDetailsJSON.tender_url = 'google.com';
      };
    }
    setIsLoadingTenderDetails(false);
    console.log('just for testing', projectDetailsJSON.length);
    setTenderDetails(projectDetailsJSON);
  };

  useEffect(() => {
    const getHousingData = async () => {
      setLoading(true);
      try {
        let crawledHousingData = await getTradeFairDataAPI(50, 0);

        setAllTradeFair(JSON.parse(crawledHousingData));
        setFilteredTradeFair(JSON.parse(crawledHousingData));
      } catch (e) {}
      setLoading(false);
    };

    !tradeFairsList?.length && getHousingData();
  }, [tradeFairsList]);

  const getAmountFormatted = (amt: any) => {
    let value = parseInt(amt);
    console.log(amt);
    let val = Math.abs(value);
    let retVal = '';

    if (amt !== 0) {
      if (val >= 10000000) {
        retVal =
          (val / 10000000).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Cr';
      } else {
        retVal =
          +(val / 100000).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Lac';
      }
    } else {
      retVal = 'Refer Trade Fair Document For Amount';
    }
    return retVal;
  };
  const filterTenders = () => {
    AnalyticsHelper.logEventTradeFairSearch(tenderSearchText);
    let allTenderContainingSearchText = allTradeFair.filter(
      (tradeFair: any) => {
        return tradeFair.tradefair_name
          ?.toLowerCase()
          ?.includes(tenderSearchText.toLowerCase());
      },
    );

    tenderSearchText
      ? setFilteredTradeFair(allTenderContainingSearchText)
      : setFilteredTradeFair(allTradeFair);
  };
  // console.log(JSON.stringify(groupedGovtTenders))

  // const sortOption = (sortBy: any) => {
  //   let allTendersWithSorting = Helpers.sortArrayByKey(
  //     filteredTradeFair,
  //     sortBy,
  //   );
  //   setFilteredTradeFair(allTendersWithSorting);
  //   // setGroupedGovtTenders(allTendersWithSorting)
  //   console.log(allTendersWithSorting, 'Sortedddddddddddd');
  // };
  // a openTradeFairURL(tender_url:any)
  const openTradeFairURL = async (tender_url: any) => {
    try {
      // console.log(await Linking.canOpenURL(tender_url))
      await Linking.openURL(tender_url);
    } catch (e) {
      // console.log(e)
      ToastAndroid.showWithGravity(
        'All Your Base Are Belong To Us',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  const getExhibitorSpacePrice = (expSpacePrice: any) => {
    if (expSpacePrice != '{}') {
      let price = expSpacePrice.substring(1).split(' ,');
      let indPriceString = price[0].split(',INR ');
      const rsFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      });
      const dollarFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      // let indPrice=getAmountFormatted(indPriceString[1]);
      // console.log(intPriceString[1].substring(0,intPriceString[1].length-1))
      let indPrice = rsFormatter.format(indPriceString[1]);
      // let intPrice=getAmountFormatted(intPriceString[1]);
      //  let internationalMoney =dollarFormatter.format(parseInt(intPriceString[1].substring(0,intPriceString[1].length-1)))    ;

      let exhibitorSpacePrice = '' + indPriceString[0] + ' ' + indPrice + '\n';
      console.log(exhibitorSpacePrice, 'PRICE');
      return [{price: exhibitorSpacePrice, isAmt: true}];
    } else {
      return [{price: '', isAmt: false}];
    }
  };

  const sortOption = () => {
    setIsGroupBy(false);
    setIsSortByDateAsc(!isSortByDateAsc);
    setIsFilterModalVisible(!isFilterModalVisible);

    let allTendersWithSorting = Helpers.sortArrayByDate(
      allTradeFair,
      'end_date',
      isSortByDateAsc,
    );

    let groupedSortedTenders = [
      {
        city: 'sorted_data',
        data: allTendersWithSorting,
      },
    ];

    setFilteredTradeFair(groupedSortedTenders);
    // setGroupedGovtTenders(groupedSortedTenders);
    // setTenderData(allTendersWithSorting)
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        {/* <TopSearchBar
          placeholderText={'Search Trade Fair'}
          filterResult={filterTenders}
          setFilterModal={setFilterModal}
        /> */}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextInput
            placeholder={'Search Trade Fair'}
            placeholderTextColor={Theme.colors.primary}
            style={{
              width: '70%',
              borderColor: Theme.colors.borderColor,
              borderWidth: 2,
              paddingRight: 5,
              fontSize: 17,
              borderRadius: 25,
              backgroundColor: Theme.colors.lightest,
              paddingHorizontal: 15,
              height: 40,
              marginTop: 10,
              color: 'black',
            }}
            value={tenderSearchText}
            onChangeText={text => setTenderSearchText(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              borderRadius: 50,
            }}>
            <Icon
              raised
              style={{padding: 0}}
              size={19}
              name="search"
              color={Theme.colors.primary}
              type="font-awesome"
              onPress={filterTenders}
            />
          </View>

          {setFilterModal && (
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                borderRadius: 50,
              }}>
              <TouchableOpacity onPress={setFilterModal}>
                <Icon
                  raised
                  style={{padding: 0}}
                  size={19}
                  name="sort-amount-desc"
                  color={Theme.colors.primary}
                  type="font-awesome"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <ScrollView>
          {filteredTradeFair?.map((tradeFair: any, index: number) => (
            <TouchableOpacity
              style={{
                backgroundColor: Theme.colors.cardBackground,
                marginTop: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
              onPress={() => passValuesInModal(tradeFair)}
              key={index}>
              <View
                style={{
                  backgroundColor: Theme.colors.secondary,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingVertical: 9,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Text
                  style={{
                    color: Theme.colors.lightest,
                    fontSize: Theme.fonts.fontSize.small,
                  }}>
                  <Text style={styles.title}>Closing Date: </Text>{' '}
                  {tradeFair.end_date}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '60%',
                    paddingLeft: 16,
                    marginTop: 10,
                  }}>
                  <Text style={{fontWeight: 'bold'}}>TradeFair Name</Text>
                  <Text
                    style={{
                      fontSize: Theme.fonts.fontSize.small,
                      paddingTop: 5,
                    }}>
                    {tradeFair.tradefair_name}{' '}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    width: '40%',
                  }}>
                  <LabelButton
                    text="View More"
                    style={{
                      backgroundColor: Theme.colors.dark,
                      marginTop: 10,
                      borderRadius: 30,
                      paddingVertical: 3,
                      alignItems: 'center',
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
            // </View>
          ))}
        </ScrollView>
      </View>

      <Modal
        isVisible={isModalVisible}
        style={{margin: 0, backgroundColor: 'white'}}>
        <View style={styles.modal}>
          <Text>
            {'\n'}
            {'\n'}
          </Text>
          <ScrollView style={styles.modal}>
            <View style={{flexDirection: 'row'}}>
              {tenderDetails?.tradefair_name && (
                <>
                  <Text style={styles.titles}>Trade Fair Name</Text>

                  <Text style={styles.values}>
                    {tenderDetails?.tradefair_name} {'\n'}
                  </Text>
                </>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              {!!tenderDetails?.event_description && (
                <>
                  <Text style={{...styles.titles}}>Event Details </Text>
                  <Text style={{...styles.values, textAlign: 'justify'}}>
                    {/* {' '} */}
                    {tenderDetails?.event_description}
                  </Text>
                </>
              )}
            </View>

            {!!tenderDetails?.city && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}>City </Text>
                <Text style={styles.values}>
                  {/* : {tenderDetails?.city} */}
                  {tenderDetails?.city.replace('(India)', '')}
                </Text>
              </View>
            )}

            <View style={{flexDirection: 'row'}}>
              {tenderDetails?.venue_address && (
                <>
                  <Text style={styles.titles}>Address</Text>
                  <Text style={{...styles.values}}>
                    {tenderDetails?.venue_address.replace(/^\{|\}$/g, '')}
                    {/* replace(/^(.)|(.)$/g,'')  */}
                  </Text>
                </>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              {(tenderDetails?.email ||
                tenderDetails?.venue_website ||
                tenderDetails?.fax_no) && (
                <Text style={styles.titles}>Venue Contact </Text>
              )}

              <View>
                {tenderDetails?.email && (
                  <>
                    <Text style={{...styles.values, textAlign: 'left'}}>
                      Contact at:-
                      <Text
                        style={{
                          ...styles.values,
                          color: 'blue',
                          textAlign: 'justify',
                        }}
                        onPress={() => openTradeFairURL(tenderDetails?.email)}>
                        {tenderDetails?.email.split('mailto:')[1]}
                      </Text>
                    </Text>
                  </>
                )}
                {/* {(tenderDetails?.fax_no) && (
            <Text style={styles.values}>
            fax-no: {tenderDetails?.fax_no}
            </Text>)} */}
                {tenderDetails?.venue_website && (
                  <>
                    <Text style={{...styles.values}}>
                      To Visit Venue Website and to check more information
                      <Text
                        style={{...styles.values, color: 'blue'}}
                        onPress={() =>
                          openTradeFairURL(tenderDetails?.venue_website)
                        }>
                        {' '}
                        Click Here {'\n'}
                      </Text>
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              {(tenderDetails?.organizer_name ||
                tenderDetails?.organizer_email ||
                tenderDetails?.organizer_website ||
                tenderDetails?.organizer_phoneno) && (
                <Text style={styles.titles}>Organizer Contact</Text>
              )}

              <View>
                {tenderDetails?.organizer_name && (
                  <Text style={styles.values}>
                    Name: {tenderDetails?.organizer_name}
                  </Text>
                )}
                {tenderDetails?.organizer_phoneno && (
                  <Text style={styles.values}>
                    Phone No: {tenderDetails?.organizer_phoneno}
                  </Text>
                )}
                {tenderDetails?.organizer_email &&
                  tenderDetails?.organizer_email != '' && (
                    <>
                      <Text style={{...styles.values}}>
                        Contact at :-
                        <Text
                          style={{...styles.values, color: 'blue'}}
                          onPress={() =>
                            openTradeFairURL(tenderDetails?.organizer_email)
                          }>
                          {tenderDetails?.organizer_email.split('mailto:')[1]}
                        </Text>
                      </Text>
                    </>
                  )}
                {tenderDetails?.organizer_website && (
                  <>
                    <Text style={{...styles.values}}>
                      To Visit Organizer Website and to check more information{' '}
                      <Text
                        style={{...styles.values, color: 'blue'}}
                        onPress={() =>
                          openTradeFairURL(tenderDetails?.organizer_website)
                        }>
                        Click Here {'\n'}
                      </Text>
                    </Text>
                  </>
                )}
                {/* <Text style={styles.values}>
             official_website: {}
            </Text> */}
              </View>
            </View>

            <View
            //  style={{flexDirection: 'column'}}
            >
              {tenderDetails?.exhibitor_profile && (
                <Text
                  style={{
                    ...styles.titles,
                    width: Dimensions.get('screen').width,
                    textAlign: 'justify',
                  }}>
                  Exhibitor's Profile{' '}
                  <Text style={{...styles.values, marginRight: 0}}>
                    : {tenderDetails?.exhibitor_profile} {'\n'}
                  </Text>
                </Text>
              )}
            </View>
          </ScrollView>
          <View style={{marginHorizontal: 100, marginBottom: 20}}>
            <Text
              style={{
                backgroundColor: '#005A9C',
                color: 'white',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                padding: 5,
              }}
              onPress={toggleModal}>
              {' '}
              Back
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
    padding: 5,
    backgroundColor: '#D0D0D0',
  },
  sectionsList: {
    marginTop: 10,
    backgroundColor: '#D0D0D0',
    height:
      Dimensions.get('window').height -
      (Dimensions.get('screen').height - Dimensions.get('window').height) -
      30,
  },

  text: {
    alignSelf: 'center',
    fontSize: 17,
    padding: 7,
    paddingBottom: 2,
    // padding:10000,
    fontWeight: 'bold',
    marginLeft: 15,
    borderRadius: 5,
    color: 'white',
    backgroundColor: 'blue',
    // width:200
  },
  searchBox: {
    flexDirection: 'row',
    borderColor: '#cccccc',
    borderBottomWidth: 1,
  },
  input: {
    width: '70%',
    borderColor: '#c6c8cc',
    borderWidth: 2,
    fontSize: 17,
    borderRadius: 25,
    padding: 5,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 15,
    height: 40,
    marginTop: 10,
    color: 'black',
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 7,
    marginVertical: 6,
    marginHorizontal: 0,
    fontSize: 12,
    borderRadius: 10,
    alignSelf: 'stretch',
  },
  tenderData: {
    paddingVertical: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    marginVertical: 4,
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#E1EBEE',
    borderBottomColor: '#2D8442', // if you need
    borderBottomWidth: 1,
    overflow: 'hidden',
    shadowColor: '#2D8442',
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
    width: '100%',
    borderRadius: 5,
    alignSelf: 'stretch',
  },
  titles: {
    fontSize: 16,
    fontFamily: 'Vintage',
    paddingVertical: 10,
    paddingLeft: 10,
    color: '#005A9C',
    fontWeight: 'bold',
    // flexDirection: 'column',
    width: 140,
  },
  values: {
    paddingBottom: 0,
    textAlign: 'justify',
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
    paddingVertical: 10,
    // marginRight: 150,
    marginLeft: 10,
    flexDirection: 'column',
    width: Dimensions.get('screen').width / 2 + 40,
  },
  modal: {
    flex: 1,
    width: '100%',
    // backgroundColor: '#e6e6e6',
    backgroundColor: 'white',
  },
});

export default TradeFairScreen;

function http<T>(arg0: Request): any {
  throw new Error('Function not implemented.');
}
