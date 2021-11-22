import React, {useState, useEffect, useContext} from 'react';
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
import {checkProjectDetailsURL} from '../services/govtProjectsAPI';
import {NavigationActions} from '../navigation/NavigationActions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemeContext} from '../context/theme/ThemeContext';
import {Label} from '../components/Label';
import {LabelButton} from '../components/buttons/LabelButton';
import {getTradeFairDetailsAPI} from '../services/tradeFairsAPI';
import {useFocusEffect} from '@react-navigation/native';
import {setHeaderLeft} from '../navigation/ScreenOptions';
import {StackNavigationProp} from '@react-navigation/stack';

type RouteParams = {
  params: {
    sourceID: number;
    tenderID: number;
    tradeFairName: string;
  };
};

export const TradeFairScreenDetails = ({
  route,
  navigation,
}: {
  route: RouteParams;
  navigation: StackNavigationProp<Record<string, undefined>, string>;
}): JSX.Element => {
  const {sourceID, tenderID, tradeFairName} = route.params;
  const [tradeFairDetails, setTradeFairDetails] = useState<any>({});
  const [isLoadingTradeFairDetails, setIsLoadingTradeFairDetails] =
    useState(false);
  const {theme} = useContext(ThemeContext);

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

  const openTenderURL = async (tender_url: any) => {
    await Linking.openURL(tender_url);
  };

  useEffect(() => {
    getTradeFairDetails(sourceID, tenderID);
  }, [sourceID, tenderID]);

  useEffect(() => {
    try {
      // alert(sourceID + tenderID);
    } catch (e) {
      // consol
    }
  }, [sourceID, tenderID]);

  const checkIfURLExist = async (projectDetailsJSON: any) => {
    setIsLoadingTradeFairDetails(true);
    try {
      let urlDetailsCheckResponse = await checkProjectDetailsURL(
        projectDetailsJSON.venue_website,
      );

      console.log(urlDetailsCheckResponse, 'check projectDetailsJSON:::::::::');

      if (urlDetailsCheckResponse.status != 200) {
        projectDetailsJSON.venue_website = Helpers.extractDomain(
          projectDetailsJSON.venue_website,
        );
      }

      setTradeFairDetails(projectDetailsJSON);
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
    setIsLoadingTradeFairDetails(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setHeaderLeft(navigation, '', '', () => {
        NavigationActions.navigateBack();
      });
    }, [navigation]),
  );

  const getTradeFairDetails = async (sourceId: number, tenderId: number) => {
    try {
      setTradeFairDetails({});
      const getTradeFairDetails = async () => {
        console.log('--------------=================');
        let projectDetails: string = await getTradeFairDetailsAPI(
          sourceId,
          tenderId,
        );
        console.log(projectDetails, '0000000000');
        let projectDetailsJSON = JSON.parse(projectDetails);

        checkIfURLExist(projectDetailsJSON);
      };
      console.log(
        sourceID && tenderID && getTradeFairDetails() + 'GET project details',
      );
      sourceID && tenderID && getTradeFairDetails();
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
        {isLoadingTradeFairDetails && (
          <ActivityIndicator
            size={'large'}
            // {...props}
            color={'red'}
          />
        )}

        {tradeFairDetails !== {} && (
          <>
            <View
              style={{
                backgroundColor: theme.colors.cardBackground,
                // marginTop: 20,
                marginHorizontal: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}>
              <View
                style={{
                  backgroundColor: theme.colors.secondary,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingVertical: 9,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Text
                  style={{
                    color: theme.colors.lightest,
                    fontSize: theme.fonts.fontSize.small,
                  }}>
                  <Text>Tender Details</Text>
                </Text>

                <Text
                  style={{
                    color: theme.colors.lightest,
                    fontSize: theme.fonts.fontSize.small,
                  }}></Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 15,
                borderBottomWidth: 0.25,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Label small>Tender ID</Label>
              <Label style={{color: theme.colors.dark, marginBottom: 10}}>
                {tenderID}
              </Label>
            </View>

            <View
              style={{
                marginTop: 20,
                marginHorizontal: 15,
                borderBottomWidth: 0.25,
                flexDirection: 'column',
              }}>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    marginRight: 5,
                  }}>
                  <Label small>End Date</Label>
                  <Label style={{color: theme.colors.dark, marginBottom: 10}}>
                    {Helpers.formatDate(tradeFairDetails.end_date)}
                  </Label>
                </View>
              </View>
              {/* <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRightWidth: 0.25,
                    width: '50%',
                    marginRight: 5,
                  }}>
                  <Label small>Tender Type</Label>
                  <Label style={{color: theme.colors.dark, marginBottom: 10}}>
                    {tradeFairDetails.TenderType || 'N/A '}
                  </Label>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    marginRight: 5,
                  }}>
                  <Label small>Tender Fee</Label>
                  <Label style={{color: theme.colors.dark, marginBottom: 10}}>
                    {tradeFairDetails.tender_fee || 'N/A'}
                  </Label>
                </View>
              </View> */}
            </View>
            <View
              style={{
                marginVertical: 20,
                marginHorizontal: 15,
                borderBottomWidth: 0.25,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{alignContent: 'center', alignItems: 'center'}}>
                <Label small>Trade Fair Name </Label>
                <Label
                  style={{
                    color: theme.colors.dark,
                    marginBottom: 10,
                    alignSelf: 'stretch',
                    textAlign: 'center',
                  }}>
                  {tradeFairName}
                </Label>
              </View>
              <View
                style={{
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Label
                  small
                  style={{
                    borderTopWidth: 0.25,
                    paddingTop: 10,
                  }}>
                  Trade Fair Description
                </Label>
                <Label
                  style={{
                    color: theme.colors.dark,
                    marginBottom: 10,
                    alignSelf: 'stretch',
                    textAlign: 'center',
                  }}>
                  {tradeFairDetails.event_description}
                </Label>
              </View>
              <LabelButton
                text="Tender Link Click Here to View"
                labelStyle={{fontSize: theme.fonts.fontSize.smallest}}
                style={{
                  backgroundColor: theme.colors.dark,
                  marginVertical: 10,
                  borderRadius: 30,
                  paddingVertical: 10,
                  paddingHorizontal: 25,
                  alignItems: 'center',
                }}
                onPress={() => openTenderURL(tradeFairDetails?.venue_website)}
              />
            </View>
            <ScrollView>
              <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 15,
                  // borderBottomWidth: 0.25,
                  // flexDirection: 'row',
                }}>
                <View
                  style={{
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 5,
                      marginBottom: 10,
                    }}>
                    <Label small>TradeFair Address</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        textAlign: 'right',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}>
                      {tradeFairDetails.venue_address || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Email</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}>
                      {tradeFairDetails.email || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Fax</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tradeFairDetails.fax || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Organizer Name</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tradeFairDetails.organizer_name || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 5,
                    }}>
                    <Label small> Organizer Email</Label>
                    {tradeFairDetails?.organizer_name && (
                      <LabelButton
                        text="Click Here to View"
                        labelStyle={{fontSize: theme.fonts.fontSize.smallest}}
                        style={{
                          backgroundColor: theme.colors.dark,
                          borderRadius: 30,
                          paddingVertical: 5,
                          paddingHorizontal: 15,
                          alignItems: 'center',
                        }}
                        onPress={() =>
                          openTenderURL(tradeFairDetails?.organizer_email)
                        }
                      />
                    )}
                    {!tradeFairDetails?.organizer_phoneno && (
                      <Label
                        style={{
                          color: theme.colors.dark,
                          marginBottom: 10,
                          textAlign: 'right',
                        }}>
                        {'N/A'}
                      </Label>
                    )}
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Org. Phone No</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tradeFairDetails.organizer_phoneno || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Exhibitor Profile</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tradeFairDetails.exhibitor_profile || 'N/A'}
                    </Label>
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
        )}
        <TouchableOpacity
          style={{
            marginHorizontal: 80,
            backgroundColor: '#F9F9F9',
            marginVertical: 10,
          }}
          onPress={() => {
            NavigationActions.navigateBack();
          }}>
          <Text
            style={{
              backgroundColor: theme.colors.secondary,
              color: 'white',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              padding: 5,
              borderRadius: 10,
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
