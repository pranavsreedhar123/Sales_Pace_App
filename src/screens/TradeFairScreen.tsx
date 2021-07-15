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
  ToastAndroid,
} from 'react-native';
import {Helpers} from '../utils/Helpers';
import {checkProjectDetailsURL, getHousingDataAPI} from '../services/govtProjectsAPI';
import {getGovtProjectDetails} from '../services/govtProjectsAPI';
import {Icon} from 'react-native-elements';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {NavigationActions} from '../navigation/NavigationActions';
import Modal from 'react-native-modal';
import {Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { getTradeFairDataAPI, getTradeFairDetailsAPI } from '../services/tradeFairsAPI';

const tradeFairDataJSON=[
  {
    "row_id": 26,
    "tradefair_name": "INTERMAT India",
    "city": "",
    "event_date": "27 Apr - 29 Apr 2022",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 17,
    "tradefair_name": "ACETECH - BENGALURU 2021",
    "city": "Bangalore (India)",
    "event_date": "Oct. 22 - 24, 2021",
    "venue_name": "Bangalore International Exhibition Centre (BIEC)",
    "source_id": 1
  },
  {
    "row_id": 39,
    "tradefair_name": "United Build Expo",
    "city": "",
    "event_date": "25 Jun - 27 Jun 2021",
    "venue_name": "Thamukam Ground",
    "source_id": 2
  },
  {
    "row_id": 15,
    "tradefair_name": "BUILD INTEC 2022",
    "city": "Coimbatore (India)",
    "event_date": "Feb. 18 - 21, 2022",
    "venue_name": "Codissia Trade Fair Complex",
    "source_id": 1
  },
  {
    "row_id": 4,
    "tradefair_name": "UNITED BUILD EXPO 2021",
    "city": "Madurai (India)",
    "event_date": "June 25 - 27, 2021",
    "venue_name": "Thamukam Ground",
    "source_id": 1
  },
  {
    "row_id": 7,
    "tradefair_name": "Excon",
    "city": "",
    "event_date": "07 Dec - 11 Dec 2021",
    "venue_name": "BIEC Bengaluru International Exhibition Centre",
    "source_id": 2
  },
  {
    "row_id": 10,
    "tradefair_name": "Intex Expo Ludhiana",
    "city": "",
    "event_date": "19 Nov - 22 Nov 2021",
    "venue_name": "Punjab Agricultural University",
    "source_id": 2
  },
  {
    "row_id": 3,
    "tradefair_name": "iDAC - Infrastructure Development Architecture Construction",
    "city": "",
    "event_date": "27 Jan - 29 Jan 2022",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 35,
    "tradefair_name": "International Elevator & Escalator Expo",
    "city": "",
    "event_date": "16 Feb - 18 Feb 2022",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 18,
    "tradefair_name": "World of Concrete India",
    "city": "",
    "event_date": "07 Oct - 09 Oct 2021",
    "venue_name": "Hitex Exhibition Center",
    "source_id": 2
  },
  {
    "row_id": 16,
    "tradefair_name": "ACETECH - MUMBAI 2021",
    "city": "Mumbai (India)",
    "event_date": "Nov. 18 - 21, 2021",
    "venue_name": "Bombay Convention & Exhibition Centre (BCEC)",
    "source_id": 1
  },
  {
    "row_id": 21,
    "tradefair_name": "World of Facades ",
    "city": "",
    "event_date": "10 Jun - 10 Jun 2021",
    "venue_name": "JW Marriott Mumbai Sahar",
    "source_id": 2
  },
  {
    "row_id": 33,
    "tradefair_name": "INDEX Fair Delhi",
    "city": "",
    "event_date": "30 Aug - 01 Aug 2021",
    "venue_name": "Pragati Maidan",
    "source_id": 2
  },
  {
    "row_id": 7,
    "tradefair_name": "CONSTRO 2022",
    "city": "Pune (India)",
    "event_date": "on Jan. 2022 (?)",
    "venue_name": "College of Agriculture Ground",
    "source_id": 1
  },
  {
    "row_id": 42,
    "tradefair_name": "The Dream Home Expo",
    "city": "",
    "event_date": "27 Aug - 29 Aug 2021",
    "venue_name": "Indira Gandhi Pratishthan",
    "source_id": 2
  },
  {
    "row_id": 44,
    "tradefair_name": "Elevator Escalator Expo ",
    "city": "",
    "event_date": "05 Aug - 07 Aug 2021",
    "venue_name": "Helipad Grounds",
    "source_id": 2
  },
  {
    "row_id": 17,
    "tradefair_name": "The Economic Times Acetech Bengaluru ",
    "city": "",
    "event_date": "18 Oct - 20 Oct 2021",
    "venue_name": "BIEC Bengaluru International Exhibition Centre",
    "source_id": 2
  },
  {
    "row_id": 40,
    "tradefair_name": "Glasspex India",
    "city": "",
    "event_date": "23 Sep - 25 Sep 2021",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 16,
    "tradefair_name": "MUMBAIWOOD ",
    "city": "",
    "event_date": "21 Oct - 23 Oct 2021",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 27,
    "tradefair_name": "Floor India Exhibition",
    "city": "",
    "event_date": "21 Apr - 23 Apr 2022",
    "venue_name": "Bangalore international exhibition centre",
    "source_id": 2
  },
  {
    "row_id": 2,
    "tradefair_name": "INDEX CONTRACT 2021",
    "city": "New Delhi (India)",
    "event_date": "July 30 - Aug. 01, 2021",
    "venue_name": "Pragati Maidan",
    "source_id": 1
  },
  {
    "row_id": 25,
    "tradefair_name": "World ConEx",
    "city": "",
    "event_date": "17 May - 19 May 2022",
    "venue_name": "Satwari Chowk",
    "source_id": 2
  },
  {
    "row_id": 14,
    "tradefair_name": "International Real Estate Expo",
    "city": "",
    "event_date": "22 Oct - 23 Oct 2021",
    "venue_name": "The St. Regis Mumbai",
    "source_id": 2
  },
  {
    "row_id": 5,
    "tradefair_name": "Economic Times ACETECH - New Delhi ",
    "city": "",
    "event_date": "16 Dec - 19 Dec 2021",
    "venue_name": "Pragati Maidan",
    "source_id": 2
  },
  {
    "row_id": 10,
    "tradefair_name": "CHINA HOME LIFE INDIA 2021",
    "city": "Mumbai (India)",
    "event_date": "Dec. 09 - 11, 2021",
    "venue_name": "Bombay Convention & Exhibition Centre (BCEC)",
    "source_id": 1
  },
  {
    "row_id": 20,
    "tradefair_name": "World of Concrete India ",
    "city": "",
    "event_date": "20 May - 22 May 2021",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 19,
    "tradefair_name": "ISH India",
    "city": "",
    "event_date": "20 May - 22 May 2021",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 13,
    "tradefair_name": "South Indian Real Estate Expo",
    "city": "",
    "event_date": "27 Oct - 29 Oct 2021",
    "venue_name": "Novotel",
    "source_id": 2
  },
  {
    "row_id": 34,
    "tradefair_name": "Build Intec - International Building & Construction Trade Fair",
    "city": "",
    "event_date": "18 Feb - 21 Feb 2022",
    "venue_name": "CODISSIA TRADE FAIR COMPLEX",
    "source_id": 2
  },
  {
    "row_id": 8,
    "tradefair_name": "Zak Doors & Windows Expo",
    "city": "",
    "event_date": "02 Dec - 05 Dec 2021",
    "venue_name": "Bombay Exhibition Centre (BEC)",
    "source_id": 2
  },
  {
    "row_id": 6,
    "tradefair_name": "Global Smart Cities",
    "city": "",
    "event_date": "16 Dec - 17 Dec 2021",
    "venue_name": "India Exposition Mart",
    "source_id": 2
  },
  {
    "row_id": 1,
    "tradefair_name": "INFRACONEX 2021",
    "city": "Gandhinagar (India)",
    "event_date": "Aug. 06 - 08, 2021",
    "venue_name": "Helipad Grounds, Gandhinagar",
    "source_id": 1
  },
  {
    "row_id": 5,
    "tradefair_name": "ACREX 2022",
    "city": "Bangalore (India)",
    "event_date": "Feb. 17 - 19, 2022",
    "venue_name": "Bangalore International Exhibition Centre (BIEC)",
    "source_id": 1
  },
  {
    "row_id": 43,
    "tradefair_name": "Global Residency & Citizenship Expo",
    "city": "",
    "event_date": "05 Aug - 07 Aug 2021",
    "venue_name": "BIEC Bengaluru International Exhibition Centre",
    "source_id": 2
  },
  {
    "row_id": 8,
    "tradefair_name": "ACETECH - NEW DELHI 2021",
    "city": "New Delhi (India)",
    "event_date": "Dec. 16 - 19, 2021",
    "venue_name": "Pragati Maidan",
    "source_id": 1
  },
  {
    "row_id": 29,
    "tradefair_name": "Global Real Estate Expo",
    "city": "",
    "event_date": "07 Mar - 11 Mar 2022",
    "venue_name": "PHD House",
    "source_id": 2
  },
  {
    "row_id": 22,
    "tradefair_name": "MSME Innovation & Start-up Summit & Time2Leap Awards",
    "city": "",
    "event_date": "12 Jun - 12 Jun 2021",
    "venue_name": "Four Seasons Hotel Bengaluru at Embassy ONE",
    "source_id": 2
  },
  {
    "row_id": 28,
    "tradefair_name": "Smart Cities India Expo ",
    "city": "",
    "event_date": "09 Mar - 11 Mar 2022",
    "venue_name": "Pragati Maidan",
    "source_id": 2
  },
  {
    "row_id": 36,
    "tradefair_name": "Mumbai Con-Expo",
    "city": "",
    "event_date": "27 Jan - 29 Jan 2022",
    "venue_name": "Venue to be announced",
    "source_id": 2
  },
  {
    "row_id": 1,
    "tradefair_name": "MAPIC India",
    "city": "",
    "event_date": "29 Sep - 30 Sep 2021",
    "venue_name": "Mumbai Express - Renaissance Hotel",
    "source_id": 2
  },
  {
    "row_id": 37,
    "tradefair_name": "INFRACONEX",
    "city": "",
    "event_date": "06 Aug - 08 Aug 2021",
    "venue_name": "The Exhibition Centre",
    "source_id": 2
  },
  {
    "row_id": 12,
    "tradefair_name": "Global Residency & Citizenship Expo",
    "city": "",
    "event_date": "12 Nov - 14 Nov 2021",
    "venue_name": "Hitex Exhibition Center",
    "source_id": 2
  },
  {
    "row_id": 13,
    "tradefair_name": "CERAMICS ASIA 2022",
    "city": "Ahmedabad (India)",
    "event_date": "March 03 - 05, 2021",
    "venue_name": "Gujarat University Convention and Exhibition Centre",
    "source_id": 1
  },
  {
    "row_id": 31,
    "tradefair_name": "Indian Ceramics Asia ",
    "city": "",
    "event_date": "02 Mar - 04 Mar 2022",
    "venue_name": "The Exhibition Centre",
    "source_id": 2
  },
  {
    "row_id": 9,
    "tradefair_name": "CHINA MACHINEX INDIA 2021",
    "city": "Mumbai (India)",
    "event_date": "Dec. 09 - 11, 2021",
    "venue_name": "Bombay Convention & Exhibition Centre (BCEC)",
    "source_id": 1
  },
  {
    "row_id": 9,
    "tradefair_name": "INDIA STONE MART ",
    "city": "",
    "event_date": "25 Nov - 28 Nov 2021",
    "venue_name": "Jaipur Exhibition & Convention Centre",
    "source_id": 2
  },
  {
    "row_id": 18,
    "tradefair_name": "SMM INDIA 2021",
    "city": "Mumbai (India)",
    "event_date": "Oct. 11 - 13, 2021",
    "venue_name": "Bombay Convention & Exhibition Centre (BCEC)",
    "source_id": 1
  },
  {
    "row_id": 15,
    "tradefair_name": "India Buildtech",
    "city": "",
    "event_date": "07 Apr - 10 Apr 2022",
    "venue_name": "India International Convention And Expo Center",
    "source_id": 2
  },
  {
    "row_id": 12,
    "tradefair_name": "INDIAN CERAMICS 2022",
    "city": "Gandhinagar (India)",
    "event_date": "March 03 - 05, 2021",
    "venue_name": "Helipad Grounds, Gandhinagar",
    "source_id": 1
  },
  {
    "row_id": 23,
    "tradefair_name": "Earthcon Expo",
    "city": "",
    "event_date": "11 Jun - 13 Jun 2021",
    "venue_name": "Shree Vallabh Sadan Haveli Vaishnav Temple",
    "source_id": 2
  }
]

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
  const [isLoadingTenderDetails,setIsLoadingTenderDetails] =useState(true)

  const toggleModal = () => {
   
    !isLoadingTenderDetails && setModalVisible(!isModalVisible);
   
  };

  const passValuesInModal = (tender: any) => {
    toggleModal();
    console.log(isModalVisible,"Modal Value")
    console.log(isModalVisible);
    if (!isModalVisible) {
      console.log(JSON.stringify(tender));
      // checkIfURLExist();
      console.log(tender.source_id +"----"+ tender.row_id+'sourceID');
      setTenderID(tender.row_id);
      setSourceID(tender.source_id);
     
    }
  };


  

  useEffect(() => {
    setLoading(true);
    try {
      Linking.addEventListener('url',()=>{console.log('Hello World')} );


      const getTradeFairData = async () => {
        let crawledHousingData: string = await getTradeFairDataAPI(50,0);
        
  console.log(await Linking.getInitialURL(),"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
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
  const checkIfURLExist=async(projectDetailsJSON:any)=>{
try{
    // await checkProjectDetailsURL('https://etender.up.nic.in/nicgep/app?page=FrontEndTenderDetailsExternal&amp;service=page&amp;tnid=915548%20');
// await getTradeFairDataDetails(1,17)
  }
  catch{()=>{
    
    projectDetailsJSON.tender_url="google.com";

  }}
  setIsLoadingTenderDetails(false)
  console.log("just for testing",projectDetailsJSON.length);
  setTenderDetails(projectDetailsJSON);
  
  }
  

  
  useEffect(() => {
    try {
      // alert(sourceID + tenderID);
      const getprojectDetails = async () => {

        console.log("--------------=================")
        let projectDetails: string = await getTradeFairDetailsAPI(sourceID,tenderID)
        console.log(projectDetails,"0000000000")
      let  projectDetailsJSON=JSON.parse(projectDetails)
      
      
        checkIfURLExist(projectDetailsJSON);
     
      };
      console.log(sourceID && tenderID && getprojectDetails()+"GET project details")
      sourceID && tenderID && getprojectDetails();
    } catch (e) {
      // consol
    }
  }, [sourceID, tenderID]);


  useEffect(() => {
    const getGroupedAndFilteredData = () => {
      // alert(12)
      const tendersGroupedByType = _.groupBy(
        filteredTradeFair,
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
      setGroupedTradeFair(mappedCrawledTenders);
    };
    filteredTradeFair && getGroupedAndFilteredData();
  }, [filteredTradeFair]);
  // console.log(filteredGovtTenders+"-====")

  const getAmountFormatted = (amt: any) => {
    let value = parseInt(amt);
    console.log(amt)
    let val = Math.abs(value);
    let retVal = '';

    if (amt !== 0) {
      if (val >= 10000000) {
        retVal =
         
          (val / 10000000).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Cr';
      } else {
        retVal =
           +
          (val / 100000).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
          ' Lac';
      }
    } else {
      retVal = '--';
    }
    return retVal;
  };
  const filterTenders = () => {
    let allTenderContainingSearchText = allTradeFair.filter((tender: any) => {
      return tender.venue_name?.includes(tenderSearchText);
    });
    // console.log(allTenderContainingSearchText.length)
    tenderSearchText
      ? setFilteredTradeFair(allTenderContainingSearchText)
      : setFilteredTradeFair(allTradeFair);
  };
  // console.log(JSON.stringify(groupedGovtTenders))

  const sortOption = (sortBy: any) => {
    let allTendersWithSorting = Helpers.sortArrayByKey(
      filteredTradeFair,
      sortBy,
    );
    setFilteredTradeFair(allTendersWithSorting);
    // setGroupedGovtTenders(allTendersWithSorting)
    console.log(allTendersWithSorting, 'Sortedddddddddddd');
  };
  const [isVisible, setVisiblity] = useState(false);


  // a openTradeFairURL(tender_url:any)
  const openTradeFairURL=async (tender_url:any)=>
    {
      try{
    // console.log(await Linking.canOpenURL(tender_url))
    await Linking.openURL(tender_url)
  }
    catch (e){
      // console.log(e)
      ToastAndroid.showWithGravity(
        "All Your Base Are Belong To Us",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );

    }
    // .catch(()=>{console.log("ERROR")});
  }




  const getExhibitorSpacePrice =(expSpacePrice : any)=>{
    if(expSpacePrice!='{}')
   { let price=expSpacePrice.substring(1).split(" ,");
    let indPriceString=price[0].split(",INR ");
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
let indPrice=rsFormatter.format(indPriceString[1])
    // let intPrice=getAmountFormatted(intPriceString[1]);
  //  let internationalMoney =dollarFormatter.format(parseInt(intPriceString[1].substring(0,intPriceString[1].length-1)))    ;
  
  let exhibitorSpacePrice= '' +indPriceString[0]+' ' +indPrice +'\n'
    console.log(exhibitorSpacePrice,"PRICE");
    return [{"price":exhibitorSpacePrice,
              "isAmt":true}]
  }
  else{
    return [{"price":"",
              "isAmt":false}]
  }
}
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
          {!groupedTradeFair?.length && (
            <Text style={{...styles.text, marginVertical: 300, height: 30}}>
              No Tender Found
            </Text>
          )}

          <SectionList
            sections={groupedTradeFair}
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
                  <Text style={styles.title}>Trade Fair Name: </Text>
                  {item.tradefair_name}{' '}
                </Text>

                {item.city?.length>0 && (
                <Text style={styles.tenderData}>
                  <Text style={styles.title}>City: </Text>
                  {item.city.replace('(India)', '')}{' '}
                </Text> )} 

                <Text style={styles.tenderData}>
                  <Text style={styles.title}> Venue Name : </Text>{' '}
                  {
                  // getAmountFormatted(item.tender_amount)
                  item.venue_name
                  }
                </Text>
                <Text style={styles.tenderData}>
                  <Text style={styles.title}> Event Date : </Text>{' '}
                  {
                  // Helpers.formatDate(item.event_date)
                  item.start_date.replace('/', ' ')
                  }{' - '}{item.end_date.replace('/', ' ')}{' '}{item.event_year}
                </Text>
              </TouchableOpacity>
            )}
            // renderItem={({tender}) => <Item tenderDetails={tender} />}
            // renderSectionHeader={({section: {tender_type}}) => (
            //   <Text style={styles.header}>{tender_type}</Text>
            // )}
          />
        </View>
      </View>
   
      <Modal isVisible={isModalVisible} style={{margin: 0}}>
    <View style={styles.modal}>
          <Text>
            {'\n'}
            {'\n'}
          </Text>
          <ScrollView style={styles.modal}>
            
          <View style={{flexDirection: 'row'}}>
          {tenderDetails?.tradefair_name && (

            <><Text style={styles.titles}>Trade Fair Name</Text>
            
            <Text style={styles.values}>
                  : {tenderDetails?.tradefair_name} {'\n'}
                </Text></> 
           )}

          </View>

          <View style={{flexDirection: 'row'}}>
          {!(!tenderDetails?.event_description) && (
            <><Text style={{...styles.titles}}>Event Details </Text><Text style={{...styles.values,textAlign:'justify'}}>
                  {/* {' '} */}
                  : {tenderDetails?.event_description}
                </Text></>
          )}
          </View>

          {!!(tenderDetails?.city) && (
          <View style={{flexDirection: 'row'}}>
          
            <Text style={styles.titles}>City </Text>
            <Text style={styles.values}>
                  {' '}
                  {/* : {tenderDetails?.city} */}
                  :{tenderDetails?.city.replace('(India)', '')}
                </Text>

          </View>)}

  <View style={{flexDirection: 'row'}}>
{tenderDetails?.venue_address && (
    <><Text style={styles.titles}> Address: </Text><Text style={{ ...styles.values }}>
                  : {tenderDetails?.venue_address.replace(/^\{|\}$/g,'')
                  }
                  {/* replace(/^(.)|(.)$/g,'')  */}
                </Text></>)}
</View>
         
      
          <View style={{flexDirection: 'row'}}>
          {(tenderDetails?.email || tenderDetails?.venue_website  || tenderDetails?.fax_no) && (
            <Text style={styles.titles}>Venue Contact </Text>)}


            <View >
            {tenderDetails?.email && (
              <><Text style={{ ...styles.values,textAlign:'left'}} >
                  Contact at:- 
                  <Text style={{ ...styles.values, color: 'blue' ,textAlign:'justify'}}
                    onPress={() => openTradeFairURL(tenderDetails?.email)}>
                      {tenderDetails?.email.split("mailto:")[1]}
                    </Text></Text></>)}
            {/* {(tenderDetails?.fax_no) && (
            <Text style={styles.values}>
            fax-no: {tenderDetails?.fax_no}
            </Text>)} */}
            {tenderDetails?.venue_website && (
            <Text
              style={{...styles.values, color: 'blue'}}
              onPress={() => 
                openTradeFairURL(tenderDetails?.venue_website)}>
               {tenderDetails?.venue_website} {'\n'}</Text>)}
            </View>           
          </View>




          <View style={{flexDirection: 'row'}}>

          {(tenderDetails?.organizer_name  ||tenderDetails?.organizer_email || tenderDetails?.organizer_website  || tenderDetails?.organizer_phoneno) && (
      
            <Text style={styles.titles}>Organizer Contact</Text>)}

            <View >
            {tenderDetails?.organizer_name && (
           <Text style={styles.values}> Name:  {tenderDetails?.organizer_name } 
            </Text>)}
            {tenderDetails?.organizer_phoneno && (
           <Text style={styles.values}> Phone No:  {tenderDetails?.organizer_phoneno } 
            </Text>)}
            {tenderDetails?.organizer_email && (
              <><Text style={{ ...styles.values}} >
                  Contact at :- 
                  <Text style={{ ...styles.values, color: 'blue' }}
                    onPress={() => openTradeFairURL(tenderDetails?.organizer_email)}>
                      {tenderDetails?.organizer_email.split("mailto:")[1]}
                    </Text></Text></>)}
            {tenderDetails?.organizer_website && (
            <><Text style={{ ...styles.values}}> To Visit Organizer Website and to check more information <Text
                    style={{ ...styles.values, color: 'blue' }}
                    onPress={() => openTradeFairURL(tenderDetails?.organizer_website)}>
                    Click Here {'\n'}</Text></Text></>
            )}
            {/* <Text style={styles.values}>
             official_website: {}
            </Text> */}
           
            </View>
            
         
          </View>
          {/* getExhibitorSpacePrice(tenderDetails?.exhibitor_space_price)[0].isAmt */}
          <View style={{flexDirection: 'row'}}>
          { getExhibitorSpacePrice(tenderDetails?.exhibitor_space_price)[0].isAmt  && (
            <><Text style={styles.titles}>Exhibitor Space Price </Text><Text style={styles.values}>
                  {/* {tenderDetails?.exhibitor_space_price} */}
                  : {getExhibitorSpacePrice(tenderDetails?.exhibitor_space_price)[0].price}
                </Text></>)}
          </View>


          {/* <View style={{flexDirection: 'row'}}>
            <Text style={styles.titles} 
            >Tender URL </Text>
            <Text
              style={{...styles.values, color: 'blue'}}
              onPress={() => 
                openTradeFairURL(tenderDetails?.tender_url)}>
              : {tenderDetails?.tender_url} {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
            </Text>
          </View> */}

          <View
          //  style={{flexDirection: 'column'}}
           >
              { tenderDetails?.exhibitor_profile && (
            <Text style={{...styles.titles,width: Dimensions.get('screen').width ,textAlign:'justify'}}>Exhibitor's Profile     <Text style={{...styles.values, marginRight: 0,}}>
              : {tenderDetails?.exhibitor_profile} {'\n'}
            </Text></Text>
              )}
          </View>

         
        </ScrollView>
        <View style={{marginHorizontal: 100, marginBottom: 20,}}>
            <Text 
            style={{backgroundColor:"#D22B2B",color:"white",textAlign:'center',fontSize:20,fontWeight:'bold',padding:5}}
           onPress={toggleModal} > Close</Text>
          </View>
        </View>
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
      Dimensions.get('window').height - (Dimensions.get('screen').height - Dimensions.get('window').height) - 30,
  
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
    textAlign:'justify',
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
    paddingVertical: 10,
    // marginRight: 150,
    marginLeft: 10,
    flexDirection: 'column',
    width:  Dimensions.get('screen').width/2 +40
  },
  modal: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e6e6e6',
  },
});

export default TradeFairScreen;

function http<T>(arg0: Request): any {
  throw new Error('Function not implemented.');
}
