import React, {useState, useEffect, useContext} from 'react';
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
import {Icon, ThemeContext} from 'react-native-elements';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';
import {AnalyticsHelper} from '../utils/AnalyticsHelper';
import {NavigationActions} from '../navigation/NavigationActions';
import {Screens} from '../navigation/Screens';
import {Theme} from '../styles/Theme';
import {PrimaryButton} from '../components/buttons/PrimaryButton';
import {LabelButton} from '../components/buttons/LabelButton';
import {TopSearchBar} from '../components/TopSearchBar';

type RouteParams = {
  params: {
    tendersList: any;
  };
};

const GovtProjectScreen = ({route}: {route: RouteParams}) => {
  const {tendersList} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [allGovtTenders, setAllGovtTenders] = useState<any>(tendersList);
  const [filteredGovtTenders, setFilteredGovtTenders] =
    useState<any>(tendersList);
  const [groupedGovtTenders, setGroupedGovtTenders] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [tenderSearchText, setTenderSearchText] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isGroupBy, setIsGroupBy] = useState(true);
  const [isSortByDate, setIsSortByDate] = useState(false);
  const [isSortByDateAsc, setIsSortByDateAsc] = useState(true);
  const {theme} = useContext(ThemeContext);

  function setFilterModal() {
    setIsFilterModalVisible(!isFilterModalVisible);
  }
  const passValuesInModal = async (tender: any) => {
    NavigationActions.navigateToScreen({
      screenName: Screens.GovtProjectScreenDetails,
      params: {
        tender_id: tender.tender_id,
        tender_source: tender.tender_source,
        tender_title: tender.tender_title,
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

        setAllGovtTenders(JSON.parse(crawledHousingData));
        setFilteredGovtTenders(JSON.parse(crawledHousingData));
      } catch (e) {}
      setLoading(false);
    };
    !tendersList && getHousingData();
  }, [tendersList]);

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
      retVal = 'NA';
    }
    return retVal;
  };

  const filterTenders = (tenderSearchText: string) => {
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

  const sortOption = (isDateAsc: boolean) => {
    setIsSortByDate(true);
    setIsSortByDateAsc(isDateAsc);
    setIsFilterModalVisible(!isFilterModalVisible);

    // alert('sorted')
    // let allTendersWithSorting = Helpers.sortArrayByKey(
    //   allGovtTenders,
    //   sortBy,
    // );
    let allTendersWithSorting = Helpers.sortArrayByDate(
      allGovtTenders,
      'closing_date',
      isDateAsc,
    );

    let groupedSortedTenders = [
      {
        tender_type: 'sorted_data',
        data: allTendersWithSorting,
      },
    ];

    setFilteredGovtTenders(allTendersWithSorting);
    // setGroupedGovtTenders(groupedSortedTenders);
    // setTenderData(allTendersWithSorting)
  };

  const [isVisible, setVisiblity] = useState(false);

  const groupByTenderType = () => {
    setIsGroupBy(true);
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{paddingHorizontal: 20, backgroundColor: Theme.colors.lightest}}>
        <TopSearchBar
          filterResult={filterTenders}
          setFilterModal={setFilterModal}
        />
        <Modal
          isVisible={isFilterModalVisible}
          style={{
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
          {/* <Text
            style={{
              // flexDirection:'column',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 0,
              marginLeft: 20,
              paddingBottom: 15,
            }}>
            Group By{' '}
          </Text> */}

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          <Text
            style={{
              // flexDirection:'column',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Sort By{' '}
          </Text>
          <Text style={{borderBottomWidth: 2}}> </Text>

          <TouchableOpacity
            style={{flexDirection: 'row', marginLeft: 40, marginTop: 20}}
            onPress={() => sortOption(true)}>
            <Icon
              name="circle"
              type="font-awesome"
              size={20}
              color={
                isSortByDate && isSortByDateAsc
                  ? theme.colors?.primary
                  : '#D0D0D0'
              }
            />
            <Text
              style={{
                // flexDirection:'column',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {' '}
              Closing Date (ASC)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', marginLeft: 40, marginTop: 20}}
            onPress={() => sortOption(false)}>
            <Icon
              name="circle"
              type="font-awesome"
              size={20}
              color={
                isSortByDate && !isSortByDateAsc
                  ? theme.colors?.primary
                  : '#D0D0D0'
              }
            />
            <Text
              style={{
                // flexDirection:'column',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {' '}
              Closing Date (DESC)
            </Text>
          </TouchableOpacity>
        </Modal>

        <View>
          {!isLoading && !groupedGovtTenders?.length && (
            <Text
              style={{
                ...styles.text,
                marginVertical: 300,
                height: 40,
                paddingLeft: 30,
                paddingTop: 10,
                backgroundColor: Theme.colors.primary,
              }}>
              No Tender Found
            </Text>
          )}
          <ScrollView>
            {filteredGovtTenders?.map((govtTender: any, index: number) => (
              // <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: Theme.colors.cardBackground,
                  marginTop: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
                onPress={() => passValuesInModal(govtTender)}
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
                    {Helpers.formatDate(govtTender.closing_date)}
                  </Text>

                  <Text
                    style={{
                      color: Theme.colors.lightest,
                      fontSize: Theme.fonts.fontSize.small,
                    }}>
                    <Text style={styles.title}>Tender Amount: </Text>{' '}
                    {getAmountFormatted(govtTender.tender_amount)}/-
                  </Text>
                  {/* </>
                )} */}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '60%',
                      paddingLeft: 16,
                      marginTop: 10,
                    }}>
                    <Text style={{fontWeight: 'bold'}}>Tender Title</Text>
                    <Text
                      style={{
                        fontSize: Theme.fonts.fontSize.small,
                        paddingTop: 5,
                      }}>
                      {govtTender.tender_title}{' '}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '40%',
                    }}>
                    <LabelButton
                      text="Share"
                      style={{
                        backgroundColor: Theme.colors.dark,
                        marginTop: 10,
                        borderRadius: 30,
                        paddingVertical: 3,
                        alignItems: 'center',
                      }}
                    />
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
            {/* <SectionList
            sections={isGroupBy ? groupedGovtTenders : filteredGovtTenders}
            keyExtractor={(tender, index) => tender + index}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => passValuesInModal(item)}>
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
          /> */}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  card: {
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
