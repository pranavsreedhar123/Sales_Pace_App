import React, {useState, useEffect, useCallback} from 'react';
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
} from 'react-native';
import {Helpers} from '../utils/Helpers';
import {getHousingDataAPI} from '../services/govtProjectsAPI';
import {getGovtProjectDetails} from '../services/govtProjectsAPI';
import {Icon} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import GovtProjectScreenDetail from './GovtProjectScreenDetails';
import {NavigationActions} from '../navigation/NavigationActions';
import Modal from 'react-native-modal';
import {Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const housingData = [
  {
    tender_id: 44418460,
    tender_title:
      'Construction of 144 no 4 storey flats under pmay at pocket-2 in avadh vihar yojna lucknow group-a',
    tender_amount: 0,
    closing_date: '2021-06-29T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44217856,
    tender_title: 'Construction of driving training institute',
    tender_amount: 0,
    closing_date: '2021-06-30T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44416899,
    tender_title:
      'Construction of 144 no 4 storey flats under pmay at pocket-2 in avadh vihar yojna lucknow group-c',
    tender_amount: 0,
    closing_date: '2021-06-29T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44478912,
    tender_title:
      'Remaining Construction Work of government industrial training institute & residential Buildings. hindi',
    tender_amount: 0,
    closing_date: '2021-07-15T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44418462,
    tender_title:
      'Construction of 144 no 4 storey flats under pmay at pocket-2 in avadh vihar yojna lucknow group-d',
    tender_amount: 0,
    closing_date: '2021-06-29T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44502347,
    tender_title:
      'Construction of lab and class room, placement office, toilet room and Parking Shed at campus of female (world bank) i.t.i. aliganj u.p.',
    tender_amount: 0,
    closing_date: '2021-06-28T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44522462,
    tender_title:
      'Construction of remaning work of 04 nos. type-iv and 01 nos. type-iii residential houses in police line at distt-',
    tender_amount: 0,
    closing_date: '2021-07-05T00:00:00',
    tender_type: 'Uttar Pradesh Housing And Development Board',
    tender_source: 1,
  },
  {
    tender_id: 44345750,
    tender_title:
      'Designing and construction of flat type high-rise residential Buildings cum commercial units  including on Site Development with  all infrastructure services for economically weaker section.',
    tender_amount: 399700000,
    closing_date: '2021-07-22T00:00:00',
    tender_type: 'Gujarat Housing Board',
    tender_source: 1,
  },
  {
    tender_id: 44221243,
    tender_title:
      'Re-development of integrated group housing facility over 4906.00 sq.mt of 168 ews (72 flood ews+48 ews+24 ews +24 ews) at anandnagar, rajkot, gujarat on ppp basis.',
    tender_amount: 141500000,
    closing_date: '2021-07-15T00:00:00',
    tender_type: 'Gujarat Housing Board',
    tender_source: 1,
  },
];

const GovtProjectScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [allGovtTenders, setAllGovtTenders] = useState<any>([]);
  const [filteredGovtTenders, setFilteredGovtTenders] = useState<any>([]);
  const [groupedGovtTenders, setGroupedGovtTenders] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [tenderSearchText, setTenderSearchText] = useState('');
  const [sourceID, setSourceID] = useState<any>();
  const [tenderID, setTenderID] = useState<any>();
  const [tenderDetails, setTenderDetails] = useState<any>({});

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const passValuesInModal = (tender: any) => {
    toggleModal();
    console.log(isModalVisible);
    if (!isModalVisible) {
      console.log(JSON.stringify(tender));
      console.log(tender.tender_source + '');
      setTenderID(tender.tender_id);
      setSourceID(tender.tender_source);
    }
  };
  useEffect(() => {
    setLoading(true);
    try {
      const getHousingData = async () => {
        let crawledHousingData: string = await getHousingDataAPI();
        setAllGovtTenders(JSON.parse(crawledHousingData));
        setFilteredGovtTenders(JSON.parse(crawledHousingData));
      };
      getHousingData();
    } catch (e) {
      // console.log(e);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    try {
      // alert(sourceID + tenderID);
      const getprojectDetails = async () => {
        let projectDetails: string = await getGovtProjectDetails(
          sourceID.toString(),
          tenderID.toString(),
        );
        console.log(projectDetails, '*********');
        setTenderDetails(JSON.parse(projectDetails));
      };
      sourceID && tenderID && getprojectDetails();
    } catch (e) {
      // consol
    }
  }, [sourceID, tenderID]);

  useEffect(() => {
    const getGroupedAndFilteredData = () => {
      // alert(12)
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
      console.log(mappedCrawledTenders, 'jewfniewfiewfoiewf');
      setGroupedGovtTenders(mappedCrawledTenders);
    };
    filteredGovtTenders && getGroupedAndFilteredData();
  }, [filteredGovtTenders]);
  // console.log(filteredGovtTenders+"-====")

  const getAmountFormatted = (amt: any) => {
    let value = parseInt(amt);
    let val = Math.abs(value);
    let retVal = '';

    if (amt !== 0) {
      if (val >= 10000000) {
        retVal =
          '₹' +
          (val / 10000000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Cr';
      } else {
        retVal =
          '₹' +
          (val / 100000).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Lac';
      }
    } else {
      retVal = '--';
    }
    return retVal;
  };
  const filterTenders = () => {
    let allTenderContainingSearchText = allGovtTenders.filter((tender: any) => {
      return tender.tender_title?.includes(tenderSearchText);
    });
    // console.log(allTenderContainingSearchText.length)
    tenderSearchText
      ? setFilteredGovtTenders(allTenderContainingSearchText)
      : setFilteredGovtTenders(allGovtTenders);
  };
  // console.log(JSON.stringify(groupedGovtTenders))

  const sortOption = (sortBy: any) => {
    let allTendersWithSorting = Helpers.sortArrayByKey(
      filteredGovtTenders,
      sortBy,
    );
    setFilteredGovtTenders(allTendersWithSorting);
    // setGroupedGovtTenders(allTendersWithSorting)
    console.log(allTendersWithSorting, 'Sortedddddddddddd');
  };
  const [isVisible, setVisiblity] = useState(false);

  let DATA =
    '{"sr_no":"46665927","tender_id":"44418460","tender_category":"Uttar Pradesh Housing And Development Board","amount_string":"Refer Document","tender_amount":0.0000,"closing_date":"2021-06-29","tender_description":"Construction of 144 no 4 storey flats under pmay at pocket-2 in avadh vihar yojna lucknow group-a","tender_url":"https://www.tendertiger.com/viewtenderdetailnd.aspx?SrNo=46665927&tendertype=9d09819bf4266dce2eviL&Year=2018&SerText=Uttar+Pradesh+Housing+and+Development+Board&Read=true","tender_currency":"Refer","state_name":"Uttar Pradesh"}';
  DATA = tenderDetails;
  return (
    <View style={{flex: 1}}>
      {/* true?<GovtProjectScreenDetail/>:null */}

      <View style={styles.container}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Tenders"
            style={styles.input}
            value={tenderSearchText}
            onChangeText={text => setTenderSearchText(text)}
          />

          <Icon
            style={styles.text}
            raised
            name="search"
            type="font-awesome"
            color="#005A9C"
            // backgroundColor: '#D0D0D0'

            onPress={() => filterTenders()}
          />
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

        <View style={styles.sectionsList}>
          {!groupedGovtTenders?.length && (
            <Text style={{...styles.text, marginVertical: 300, height: 30}}>
              No Tender Found
            </Text>
          )}

          <SectionList
            sections={groupedGovtTenders}
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
                  <Text style={styles.title}> Tender Amount : </Text>{' '}
                  {getAmountFormatted(item.tender_amount)}
                </Text>
                <Text style={styles.tenderData}>
                  <Text style={styles.title}> Closing Date : </Text>{' '}
                  {Helpers.formatDate(item.closing_date)}
                </Text>
              </TouchableOpacity>
            )}
            // renderItem={({tender}) => <Item tenderDetails={tender} />}
            renderSectionHeader={({section: {tender_type}}) => (
              <Text style={styles.header}>{tender_type}</Text>
            )}
          />
        </View>
      </View>
      <Modal isVisible={isModalVisible} style={{margin: 0}}>
        <ScrollView style={styles.modal}>
          <Text>
            {'\n'}
            {'\n'}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}>Tender ID </Text>
            <Text style={styles.values}>
              : {tenderDetails?.tender_id} {'\n'}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}>Tender Title </Text>
            <Text style={styles.values}>
              {' '}
              : {tenderDetails?.tender_description}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}> State: </Text>
            <Text style={{...styles.values}}>
              : {tenderDetails?.state_name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}>Tender Category </Text>
            <Text style={styles.values}>
              : {tenderDetails?.tender_category}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}>Tender Amount </Text>
            <Text style={styles.values}>
              : {getAmountFormatted(tenderDetails?.tender_amount)}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}>Closing Date </Text>
            <Text style={{...styles.values, color: 'darkred'}}>
              : {tenderDetails?.closing_date} {'\n'}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles}>Tender URL </Text>
            <Text
              style={{...styles.values, color: 'blue'}}
              onPress={() => Linking.openURL(tenderDetails?.tender_url)}>
              : {tenderDetails?.tender_url} {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
            </Text>
          </View>

          <View style={{marginHorizontal: 80, marginBottom: 20}}>
            <Button title="Close Tender" onPress={toggleModal} />
          </View>
        </ScrollView>
      </Modal>
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
    padding: 5,
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
    fontSize: 16,
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
    width: '80%',
    borderColor: '#c6c8cc',
    borderWidth: 2,

    borderRadius: 25,
    padding: 5,
    backgroundColor: '#e6e6e6',
    paddingHorizontal: 15,
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
    fontSize: 18,
    fontFamily: 'Vintage',
    paddingVertical: 10,
    paddingLeft: 10,
    color: '#005A9C',
    fontWeight: 'bold',
    flexDirection: 'column',
    width: 140,
  },
  values: {
    paddingBottom: 0,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
    paddingVertical: 10,
    marginRight: 145,
    marginLeft: 10,
    flexDirection: 'column',
  },
  modal: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e6e6e6',
  },
});

export default GovtProjectScreen;

function http<T>(arg0: Request): any {
  throw new Error('Function not implemented.');
}
