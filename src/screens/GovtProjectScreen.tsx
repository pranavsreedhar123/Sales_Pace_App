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
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {Helpers} from '../utils/Helpers';
import {
  checkProjectDetailsURL,
  getHousingDataAxwayAPI,
} from '../services/govtProjectsAPI';
import {getGovtProjectDetails} from '../services/govtProjectsAPI';
import {Icon} from 'react-native-elements';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {AnalyticsHelper} from '../utils/AnalyticsHelper';
import {NavigationActions} from '../navigation/NavigationActions';
import {Screens} from '../navigation/Screens';

const GovtProjectScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [allGovtTenders, setAllGovtTenders] = useState<any>([]);
  const [filteredGovtTenders, setFilteredGovtTenders] = useState<any>([]);
  const [groupedGovtTenders, setGroupedGovtTenders] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [tenderSearchText, setTenderSearchText] = useState('');
  const [sourceID, setSourceID] = useState<any>();
  const [tenderID, setTenderID] = useState<any>();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isGroupBy, setIsGroupBy] = useState(true);
  const [isSortByDateAsc, setIsSortByDateAsc] = useState(true);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  function setFilterModal() {
    setIsFilterModalVisible(!isFilterModalVisible);
  }
  const passValuesInModal = async (tender: any) => {
    NavigationActions.navigateToScreen({
      screenName: Screens.GovtProjectScreenDetails,
      params: {
        tender_id: tender.tender_id,
        tender_source: tender.tender_source,
      },
    });
    // // toggleModal();
    // await getProjectDetails(tender.tender_source, tender.tender_id);

    // if (!isModalVisible) {
    //   setTenderID(tender.tender_id);
    //   setSourceID(tender.tender_source);
    // }
  };

  useEffect(() => {
    const getHousingData = async () => {
      setLoading(true);
      try {
        let crawledHousingData = await getHousingDataAxwayAPI();
        console.log(typeof crawledHousingData, 'crawledDatahousing');

        setAllGovtTenders(JSON.parse(crawledHousingData));
        setFilteredGovtTenders(JSON.parse(crawledHousingData));
      } catch (e) {}
      setLoading(false);
    };

    getHousingData();
  }, []);

  useEffect(() => {
    const getGroupedAndFilteredData = () => {
      const tendersGroupedByType = _.groupBy(
        filteredGovtTenders,
        'tender_type',
      );
      setLoading(false);

      const mappedCrawledTenders = _.map(
        tendersGroupedByType,
        (value: any, key: any) => {
          return {
            tender_type: key,
            data: value,
          };
        },
      );

      setGroupedGovtTenders(mappedCrawledTenders);
      // setTenderData(mappedCrawledTenders)
    };
    filteredGovtTenders && !!isGroupBy && getGroupedAndFilteredData();
  }, [filteredGovtTenders]);

  const getAmountFormatted = (amt: any) => {
    let value = parseInt(amt);
    let val = Math.abs(value);
    let retVal = '';

    if (parseInt(amt) !== 0) {
      if (val >= 10000000) {
        retVal =
          '₹ ' +
          (val / 10000000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Cr';
      } else if (val > 100000) {
        retVal =
          '₹ ' +
          (val / 100000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Lac';
      } else {
        retVal =
          '₹ ' +
          (val / 1000).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' K';
      }
    } else {
      retVal = 'Refer Tender Document For Amount';
    }
    return retVal;
  };

  const filterTenders = () => {
    AnalyticsHelper.logEventTenderSearch(tenderSearchText);
    let allTenderContainingSearchText = allGovtTenders.filter((tender: any) => {
      return tender.tender_title
        ?.toLowerCase()
        ?.includes(tenderSearchText.toLowerCase());
    });

    tenderSearchText
      ? setFilteredGovtTenders(allTenderContainingSearchText)
      : setFilteredGovtTenders(allGovtTenders);
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
      allGovtTenders,
      'closing_date',
      isSortByDateAsc,
    );

    let groupedSortedTenders = [
      {
        tender_type: 'sorted_data',
        data: allTendersWithSorting,
      },
    ];

    setFilteredGovtTenders(groupedSortedTenders);
    // setGroupedGovtTenders(groupedSortedTenders);
    // setTenderData(allTendersWithSorting)
  };

  const [isVisible, setVisiblity] = useState(false);

  const groupByTenderType = () => {
    // alert('Hello is it group')
    setIsGroupBy(true);
    setIsFilterModalVisible(!isFilterModalVisible);
    // setTenderData(groupedGovtTenders)
  };

  // setTenderData(groupedGovtTenders)
  return (
    <View style={{flex: 1}}>
      {/* true?<GovtProjectScreenDetail/>:null */}

      <View style={styles.container}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Tenders"
            placeholderTextColor="black"
            style={styles.input}
            value={tenderSearchText}
            onChangeText={text => setTenderSearchText(text)}
          />

          <Icon
            // style={styles.text}
            style={{padding: 0}}
            raised
            size={19}
            name="search"
            color="#005A9C"
            type="font-awesome"
            onPress={() => filterTenders()}
          />
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              borderRadius: 50,
            }}>
            <TouchableOpacity onPress={() => setFilterModal()}>
              <Icon
                raised
                name="sort-amount-desc"
                type="font-awesome"
                size={19}
                color="#005A9C"

                // onPress={() => sortOption("tender_amount")}
              />
            </TouchableOpacity>
          </View>
          {/* <Text onPress={() => filterTenders()}>
            Search
          </Text> */}

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
        </View>

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
              size={20}
              // color="#55DD33"
              color={isGroupBy ? '#55DD33' : '#D0D0D0'}
              style={{flexDirection: 'column'}}
            />
            <Text
              style={{flexDirection: 'row', fontSize: 16, fontWeight: 'bold'}}>
              {' '}
              Tender Type{' '}
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

        <View style={styles.sectionsList}>
          {!isLoading && !groupedGovtTenders?.length && (
            <Text
              style={{
                ...styles.text,
                marginVertical: 300,
                height: 40,
                paddingLeft: 30,
                paddingTop: 10,
                backgroundColor: '#005A9C',
              }}>
              No Tender Found
            </Text>
          )}

          <SectionList
            sections={isGroupBy ? groupedGovtTenders : filteredGovtTenders}
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
                  <Text style={styles.title}>Tender Title: </Text>
                  {item.tender_title}{' '}
                </Text>
                <Text style={styles.tenderData}>
                  <Text style={styles.title}>Tender Amount: </Text>{' '}
                  {getAmountFormatted(item.tender_amount)}
                </Text>
                <Text style={styles.tenderData}>
                  <Text style={styles.title}>Closing Date: </Text>{' '}
                  {Helpers.formatDate(item.closing_date)}
                </Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({section: {tender_type}}) => (
              <>
                {isGroupBy && <Text style={styles.header}>{tender_type}</Text>}
              </>
            )}
          />
        </View>
      </View>
      {/* <Modal isVisible={isModalVisible} style={{margin: 0}}>
        <View style={styles.modal}>
          <ScrollView style={styles.modal}>
            <Text>
              {'\n'}
              {'\n'}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titles}>Tender ID </Text>
              <Text style={styles.values}>
                {tenderDetails?.tender_id} {'\n'}
              </Text>
            </View>

            {tenderDetails?.tender_description && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}>Tender Title </Text>
                <Text style={styles.values}>
                  {' '}
                  {tenderDetails?.tender_description}
                </Text>
              </View>
            )}

            {tenderDetails?.Location && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}> Location </Text>
                <Text style={{...styles.values}}>
                  {tenderDetails?.Location}
                </Text>
              </View>
            )}

            {tenderDetails?.department && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}> Department </Text>
                <Text style={{...styles.values}}>
                  {tenderDetails?.department}
                </Text>
              </View>
            )}

            {tenderDetails?.tender_category && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}>Tender Category </Text>
                <Text style={styles.values}>
                  {' '}
                  {tenderDetails?.tender_category}
                </Text>
              </View>
            )}

            {tenderDetails?.tender_description && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}> Tender Description </Text>
                <Text style={{...styles.values}}>
                  {tenderDetails?.tender_description}
                </Text>
              </View>
            )}
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.titles}>Tender Amount </Text>
              <Text style={styles.values}>
                {' '}
                {getAmountFormatted(tenderDetails?.tender_amount)}
              </Text>
            </View>

            {tenderDetails?.closing_date && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}>Closing Date </Text>
                <Text style={{...styles.values, color: 'darkred'}}>
                  {' '}
                  {Helpers.formatDate(tenderDetails?.closing_date)} {'\n'}
                </Text>
              </View>
            )}

            {tenderDetails?.tender_url && (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titles}>Tender URL </Text>
                <Text
                  style={{...styles.values, color: 'blue'}}
                  onPress={() => openTenderURL(tenderDetails?.tender_url)}>
                  {' '}
                  {tenderDetails?.tender_url} {'\n'}
                  {'\n'}
                  {'\n'}
                  {'\n'}
                </Text>
              </View>
            )}
          </ScrollView>
          <View
            style={{
              marginHorizontal: 80,
              backgroundColor: '#D22B2B',
              marginBottom: 20,
            }}>
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
              Back
            </Text>
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  // titles: {
  //   fontSize: 18,
  //   fontFamily: 'Vintage',
  //   paddingVertical: 10,
  //   paddingLeft: 10,
  //   color: '#005A9C',
  //   fontWeight: 'bold',
  // },
  // values: {
  //   fontWeight: 'bold',
  //   fontSize: 15,
  //   color: 'black',
  // },
  // modal: {
  //   flex: 1,
  //   width: '100%',
  //   backgroundColor: '#e6e6e6',
  // },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch',
    backgroundColor: '#D0D0D0',
  },
  sectionsList: {
    marginTop: 10,
    backgroundColor: '#D0D0D0',
    height:
      Dimensions.get('window').height -
      (Dimensions.get('screen').height - Dimensions.get('window').height) +
      8,
  },

  text: {
    alignSelf: 'center',
    fontSize: 17,
    paddingBottom: 2,
    fontWeight: 'bold',
    marginLeft: 15,
    borderRadius: 5,
    color: 'white',
    backgroundColor: 'blue',
    width: 200,
  },
  icon: {
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingTop: 5,
    //paddingBottom: 10,
    //borderRadius: 5,
    //color: 'white',
    //backgroundColor: 'blue',
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
    paddingRight: 5,
    fontSize: 17,
    borderRadius: 25,
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
    flexDirection: 'row',
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
    fontSize: 18,
    fontFamily: 'Vintage',
    paddingVertical: 10,
    paddingLeft: 10,
    color: '#005A9C',
    fontWeight: 'bold',
    flexDirection: 'column',
    width: 140,
  },

  modal: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e6e6e6',
  },
  tinyLogo: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').height / 9,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default GovtProjectScreen;

function http<T>(arg0: Request): any {
  throw new Error('Function not implemented.');
}
