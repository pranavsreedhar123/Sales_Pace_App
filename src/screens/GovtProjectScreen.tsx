import React, {useState, useEffect, useCallback} from 'react';
import _ from 'lodash';

// import { SearchBar } from 'react-native-elements';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  StyleSheet,
  SectionList,
} from 'react-native';
import {Helpers} from '../utils/Helpers';
import {getHousingDataAPI} from '../services/govtProjectsAPI';

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
  const [allGovtTenders, setAllGovtTenders] = useState<any>([]);
  const [filteredGovtTenders, setFilteredGovtTenders] = useState<any>([]);
  const [groupedGovtTenders, setGroupedGovtTenders] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [tenderSearchText, setTenderSearchText] = useState('');

  useEffect(() => {
    setLoading(true);
    try {
      const getHousingData = async () => {
        let crawledHousingData: string = await getHousingDataAPI();
        setAllGovtTenders(JSON.parse(crawledHousingData));
        setFilteredGovtTenders(JSON.parse(crawledHousingData));
      };
      getHousingData();
      console.log(allGovtTenders);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
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
    };
    filteredGovtTenders && getGroupedAndFilteredData();
    // console.log(filteredGovtTenders)
  }, [filteredGovtTenders]);

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

    tenderSearchText
      ? setFilteredGovtTenders(allTenderContainingSearchText)
      : setFilteredGovtTenders(allGovtTenders);
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Tenders"
            style={styles.input}
            value={tenderSearchText}
            onChangeText={text => setTenderSearchText(text)}
          />
          <Text style={styles.text} onPress={() => filterTenders()}>
            Search
          </Text>
        </View>

        <View style={styles.sectionsList}>
          {!groupedGovtTenders?.length && (
            <Text style={{...styles.text, marginVertical: 300}}>
              No Tender Found
            </Text>
          )}

          <SectionList
            sections={groupedGovtTenders}
            keyExtractor={(tender, index) => tender + index}
            renderItem={({item}) => (
              <View style={styles.item}>
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
              </View>
            )}
            // renderItem={({tender}) => <Item tenderDetails={tender} />}
            renderSectionHeader={({section: {tender_type}}) => (
              <Text style={styles.header}>{tender_type}</Text>
            )}
          />
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
    paddingLeft: 10,
    fontWeight: 'bold',
    marginLeft: 17,
    borderRadius: 10,
    color: 'white',
    backgroundColor: 'blue',
  },
  searchBox: {
    flexDirection: 'row',
    borderColor: '#cccccc',
    borderBottomWidth: 1,
  },
  input: {
    width: '77%',
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
});

export default GovtProjectScreen;

function http<T>(arg0: Request): any {
  throw new Error('Function not implemented.');
}
