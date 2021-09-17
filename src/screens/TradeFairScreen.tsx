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
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {NavigationActions} from '../navigation/NavigationActions';
import Modal from 'react-native-modal';
import {Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  getTradeFairDataAPI,
  getTradeFairDetailsAPI,
} from '../services/tradeFairsAPI';
import {AnalyticsHelper} from '../utils/AnalyticsHelper';

const TradeFairScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [allTradeFair, setAllTradeFair] = useState<any>([]);
  const [filteredTradeFair, setFilteredTradeFair] = useState<any>([]);
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

  const passValuesInModal = (tender: any) => {
    toggleModal();
    console.log(isModalVisible, 'Modal Value');
    console.log(isModalVisible);
    if (!isModalVisible) {
      console.log(JSON.stringify(tender));
      // checkIfURLExist();
      console.log(tender.source_id + '----' + tender.row_id + 'sourceID');
      setTenderID(tender.row_id);
      setSourceID(tender.source_id);
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      Linking.addEventListener('url', () => {
        console.log('Hello World');
      });

      const getTradeFairData = async () => {
        let crawledHousingData: string = await getTradeFairDataAPI(50, 0);

        console.log(
          await Linking.getInitialURL(),
          '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$',
        );
        setAllTradeFair(JSON.parse(crawledHousingData));
        setFilteredTradeFair(JSON.parse(crawledHousingData));
        // setAllTradeFair(tradeFairDataJSON);
        // setFilteredTradeFair(tradeFairDataJSON)
      };
      getTradeFairData();
    } catch (e) {
      // console.log(e);
      setLoading(false);
    }
  }, []);
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
    try {
      // alert(sourceID + tenderID);
      const getprojectDetails = async () => {
        console.log('--------------=================');
        let projectDetails: string = await getTradeFairDetailsAPI(
          sourceID,
          tenderID,
        );
        console.log(projectDetails, '0000000000');
        let projectDetailsJSON = JSON.parse(projectDetails);

        checkIfURLExist(projectDetailsJSON);
      };
      console.log(
        sourceID && tenderID && getprojectDetails() + 'GET project details',
      );
      sourceID && tenderID && getprojectDetails();
    } catch (e) {
      // consol
    }
  }, [sourceID, tenderID]);

  useEffect(() => {
    const getGroupedAndFilteredData = () => {
      // alert(12)
      const tendersGroupedByType = _.groupBy(filteredTradeFair, 'city');
      setLoading(true);

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
  // console.log(filteredGovtTenders+"-====")

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
    let allTenderContainingSearchText = allTradeFair.filter((tender: any) => {
      return tender.city
        ?.toLowerCase()
        ?.includes(tenderSearchText.toLowerCase());
    });
    // console.log(allTenderContainingSearchText.length)includes(tenderSearchText);
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
  const [isVisible, setVisiblity] = useState(false);

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
    // .catch(()=>{console.log("ERROR")});
  };

  const getExhibitorSpacePrice = (expSpacePrice: any) => {
    if (expSpacePrice != '{}') {
      let price = expSpacePrice.substring(1).split(' ,');
      let indPriceString = price[0].split(',INR ');
      // let intPriceString=price[1].split(",USD ");
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
  const groupByTenderType = () => {
    // alert('Hello is it group')
    setIsGroupBy(true);

    setIsFilterModalVisible(!isFilterModalVisible);
    setFilteredTradeFair(allTradeFair);
    console.log(filteredTradeFair, '<--', isGroupBy, '-->', groupedTradeFair);
    // setTenderData(groupedGovtTenders)
  };
  const sortOption = () => {
    setIsGroupBy(false);
    setIsSortByDateAsc(!isSortByDateAsc);
    setIsFilterModalVisible(!isFilterModalVisible);

    // alert('sorted')
    // let allTendersWithSorting = Helpers.sortArrayByKey(
    //   allGovtTenders,
    //   sortBy,
    // );
    let allTendersWithSorting = Helpers.sortArrayByDate(
      allTradeFair,
      'end_date',
      isSortByDateAsc,
    );
    // sortArrayByDate(allGovtTenders);
    // setGroupedGovtTenders(mappedCrawledTenders);

    console.log(groupedTradeFair, '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    let groupedSortedTenders = [
      {
        city: 'sorted_data',
        data: allTendersWithSorting,
      },
    ];

    console.log(groupedSortedTenders, '******************');

    setFilteredTradeFair(groupedSortedTenders);
    // setGroupedGovtTenders(groupedSortedTenders);
    // setTenderData(allTendersWithSorting)
  };

  return (
    <View style={{flex: 1}}>
      {/* true?<GovtProjectScreenDetail/>:null */}

      <View style={styles.container}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search City"
            style={styles.input}
            value={tenderSearchText}
            onChangeText={text => setTenderSearchText(text)}
          />

          <Icon
            // style={styles.text}
            raised
            name="search"
            type="font-awesome"
            size={19}
            color="#005A9C"
            // backgroundColor: '#D0D0D0'

            onPress={() => filterTenders()}
          />

          {/* <View style={{alignItems: 'flex-end', paddingLeft: 10,paddingVertical:15}}>
              <Icon
                name="sort-amount-desc"
                type='font-awesome'
                size={35}
                color="#005A9C"
                
                
                onPress={() => sortOption("tender_amount")}
              />
            </View> */}
          {/* {filterOptionStatus && (
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 16,
              }}>
              <Text
                style={styles.textButton}
                onPress={() => filterSubscriber()}>
                Subscribers
              </Text>
              <Text style={styles.textButton} onPress={() => filterView()}>
                View Count
              </Text>
            </View>
          )} */}
          <View
            style={{
              flexDirection: 'row',
              // marginRight:300,

              // marginLeft:10,
              alignSelf: 'flex-start',
              // padding:10 ,
              borderRadius: 50,
              // backgroundColor:'white'
            }}>
            <TouchableOpacity onPress={() => setFilterModal()}>
              <Icon
                //  style={styles.text}
                raised
                name="sort-amount-desc"
                type="font-awesome"
                size={19}
                color="#005A9C"

                // onPress={() => sortOption("tender_amount")}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionsList}>
          {!groupedTradeFair?.length && (
            <Text
              style={{
                ...styles.text,
                marginVertical: 300,
                height: 40,
                paddingHorizontal: 20,
                paddingTop: 10,
                backgroundColor: '#005A9C',
              }}>
              No Trade Fair Found
            </Text>
          )}
          <Modal
            isVisible={isFilterModalVisible}
            style={{
              // isVisible=isFilterModalVisible,
              // flexDirection:'row',
              // marginRight:10,

              // marginTop:10,
              margin: 0,
              marginTop: Dimensions.get('screen').height / 6,
              maxHeight: Dimensions.get('screen').height / 4,
              // height:/
              borderRadius: 40,
              width: Dimensions.get('screen').width,

              // height:800,
              // margin:300,
              alignSelf: 'flex-end',
              // padding:10,
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                // flexDirection:'column',
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 0,
                marginLeft: 20,
                paddingBottom: 15,
              }}>
              Group By{' '}
            </Text>

            <TouchableOpacity
              style={{flexDirection: 'row', marginLeft: 40}}
              onPress={groupByTenderType}>
              <Icon
                name="circle"
                type="font-awesome"
                size={19}
                // color="#55DD33"
                color={isGroupBy ? '#55DD33' : '#D0D0D0'}
                style={{flexDirection: 'column'}}
              />
              <Text
                style={{
                  flexDirection: 'row',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {' '}
                City{' '}
              </Text>
            </TouchableOpacity>
            <Text style={{borderBottomWidth: 2}}> </Text>
            <Text
              style={{
                // flexDirection:'column',
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 20,
                paddingVertical: 10,
              }}>
              Sort By{' '}
            </Text>
            <TouchableOpacity
              style={{flexDirection: 'row', marginLeft: 40}}
              // onPress={()  }
              onPress={sortOption}>
              <Icon
                name="circle"
                type="font-awesome"
                size={20}
                color={isGroupBy ? '#D0D0D0' : '#55DD33'}
              />
              <Text
                style={{
                  // flexDirection:'column',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {' '}
                Closing Date {isSortByDateAsc ? '(ASC)' : '(DESC)'}{' '}
              </Text>
              <Icon
                // name="arrow-down"
                name={isSortByDateAsc ? 'arrow-down' : 'arrow-up'}
                type="font-awesome"
                size={20}
                color={isGroupBy ? '#D0D0D0' : '#55DD33'}
              />
            </TouchableOpacity>
          </Modal>
          <SectionList
            sections={isGroupBy ? groupedTradeFair : filteredTradeFair}
            keyExtractor={(tender, index) => tender + index}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => passValuesInModal(item)}
                // onPress={()=>NavigationActions.navigateToDifferentStackedScreen(
                //   {screenName:'GovtProjectScreenDetails',params:item}
                //   )}
              >
                <Text style={styles.tenderData}>
                  <Text style={styles.title}>Trade Fair Name </Text>
                  {item.tradefair_name}{' '}
                </Text>

                {item.city?.length > 0 && (
                  <Text style={styles.tenderData}>
                    <Text style={styles.title}>City: </Text> {item.city}{' '}
                  </Text>
                )}

                <Text style={styles.tenderData}>
                  <Text style={styles.title}>Venue Name: </Text>{' '}
                  {
                    // getAmountFormatted(item.tender_amount)
                    item.venue_name
                  }
                </Text>
                <Text style={styles.tenderData}>
                  <Text style={styles.title}>Event Date: </Text>{' '}
                  {
                    // Helpers.formatDate(item.event_date)
                    item.start_date
                  }
                  {' - '}
                  {item.end_date} {item.event_year}
                </Text>
              </TouchableOpacity>
            )}
            // // renderItem={({tender}) => <Item tenderDetails={tender} />}
            // renderSectionHeader={({section: {city}}) => (
            //   <Text style={styles.header}>{city}</Text>
            // )}

            renderSectionHeader={({section: {city}}) => (
              <>{isGroupBy && <Text style={styles.header}>{city}</Text>}</>
            )}
          />
        </View>
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
