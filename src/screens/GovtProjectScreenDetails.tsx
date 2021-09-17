import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Linking,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Helpers} from '../utils/Helpers';
import {
  checkProjectDetailsURL,
  getGovtProjectDetails,
} from '../services/govtProjectsAPI';
import {NavigationActions} from '../navigation/NavigationActions';
import {TouchableOpacity} from 'react-native-gesture-handler';

type RouteParams = {
  params: {
    tender_id: string;
    tender_source: string;
  };
};

export const GovtProjectScreenDetails = ({
  route,
}: {
  route: RouteParams;
}): JSX.Element => {
  const {tender_id, tender_source} = route.params;
  const [tenderDetails, setTenderDetails] = useState<any>({});
  const [isLoadingTenderDetails, setIsLoadingTenderDetails] = useState(false);

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

  const openTenderURL = async (tender_url: any) => {
    await Linking.openURL(tender_url);
  };

  useEffect(() => {
    getProjectDetails(tender_source, tender_id);
  }, [tender_source, tender_id]);

  const checkIfURLExist = async (projectDetailsJSON: any) => {
    setIsLoadingTenderDetails(true);
    try {
      let urlDetailsCheckResponse = await checkProjectDetailsURL(
        projectDetailsJSON.tender_url,
      );

      console.log(urlDetailsCheckResponse, 'check projectDetailsJSON:::::::::');

      if (urlDetailsCheckResponse.status != 200) {
        projectDetailsJSON.tender_url = Helpers.extractDomain(
          projectDetailsJSON.tender_url,
        );
      }

      setTenderDetails(projectDetailsJSON);
    } catch {
      (e: Error) => {
        console.log(e + 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
        ToastAndroid.showWithGravity(
          'Unable to Process the request.\n Something went wrong',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      };
    }
    setIsLoadingTenderDetails(false);
  };

  const getProjectDetails = async (sourceId: string, tenderId: string) => {
    try {
      setTenderDetails({});
      let projectDetails: string = await getGovtProjectDetails(
        sourceId,
        tenderId,
      );

      let projectDetailsJSON = JSON.parse(projectDetails);

      console.log(projectDetailsJSON, '&&&&&&&&&&&&&&&&&');
      checkIfURLExist(projectDetailsJSON);
    } catch (e) {
      ToastAndroid.showWithGravityAndOffset(
        'Unable to Process the request.\n Something went wrong',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        30,
        50,
        // style= {color:'black'}
      );
    }
  };

  return (
    <>
      <View style={styles.modal}>
        {isLoadingTenderDetails && (
          <ActivityIndicator
            size={'large'}
            // {...props}
            color={'red'}
          />
        )}
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
              <Text style={{...styles.values}}>{tenderDetails?.Location}</Text>
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

        <TouchableOpacity
          style={{
            marginHorizontal: 80,
            backgroundColor: '#D22B2B',
            marginBottom: 20,
          }}
          onPress={() => {
            NavigationActions.navigateBack();
          }}>
          <Text
            style={{
              backgroundColor: '#005A9C',
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              padding: 5,
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e6e6e6',
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
});
