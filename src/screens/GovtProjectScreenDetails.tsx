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
import {
  checkProjectDetailsURL,
  getGovtProjectDetails,
} from '../services/govtProjectsAPI';
import {NavigationActions} from '../navigation/NavigationActions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemeContext} from '../context/theme/ThemeContext';
import {Label} from '../components/Label';
import {LabelButton} from '../components/buttons/LabelButton';
import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {setHeaderLeft} from '../navigation/ScreenOptions';

type RouteParams = {
  params: {
    tender_id: string;
    tender_source: string;
    tender_title: string;
  };
};

export const GovtProjectScreenDetails = ({
  route,
  navigation,
}: {
  route: RouteParams;
  navigation: StackNavigationProp<Record<string, undefined>, string>;
}): JSX.Element => {
  const {tender_id, tender_source, tender_title} = route.params;
  const [tenderDetails, setTenderDetails] = useState<any>({});
  const [isLoadingTenderDetails, setIsLoadingTenderDetails] = useState(false);
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

  useFocusEffect(
    React.useCallback(() => {
      setHeaderLeft(navigation, '', '', () => {
        NavigationActions.navigateBack();
      });
    }, [navigation]),
  );

  useEffect(() => {
    getProjectDetails(tender_source, tender_id);
  }, [tender_source, tender_id]);

  const checkIfURLExist = async (projectDetailsJSON: any) => {
    setIsLoadingTenderDetails(true);
    try {
      if (projectDetailsJSON.tender_url) {
        let urlDetailsCheckResponse = await checkProjectDetailsURL(
          projectDetailsJSON.tender_url,
        );

        if (urlDetailsCheckResponse.status != 200) {
          projectDetailsJSON.tender_url = Helpers.extractDomain(
            projectDetailsJSON.tender_url,
          );
        }
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

        {tenderDetails !== {} && (
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
                  }}>
                  <Text>
                    Tender Amount: Rs.{' '}
                    {getAmountFormatted(tenderDetails.tender_amount)}/-
                  </Text>
                </Text>
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
                {tenderDetails.tender_id}
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
                    borderRightWidth: 0.25,
                    width: '50%',
                    marginRight: 5,
                  }}>
                  <Label small>Tender Category</Label>
                  <Label
                    style={{
                      color: theme.colors.dark,
                      flex: 1,
                      flexWrap: 'wrap',
                      textAlign: 'right',
                      paddingRight: 5,
                    }}>
                    {tenderDetails.tender_category}
                  </Label>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    marginRight: 5,
                  }}>
                  <Label small>Closing Date</Label>
                  <Label style={{color: theme.colors.dark, marginBottom: 10}}>
                    {Helpers.formatDate(tenderDetails.closing_date)}
                  </Label>
                </View>
              </View>
              <View
                style={{
                  marginTop: 5,
                  // borderBottomWidth: 0.25,
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
                    {tenderDetails.TenderType || 'N/A '}
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
                    {tenderDetails.tender_fee || 'N/A'}
                  </Label>
                </View>
              </View>
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
                <Label small>Tender Title</Label>
                <Label
                  style={{
                    color: theme.colors.dark,
                    marginBottom: 10,
                    alignSelf: 'stretch',
                    textAlign: 'center',
                  }}>
                  {tender_title}
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
                  Tender Description
                </Label>
                <Label
                  style={{
                    color: theme.colors.dark,
                    marginBottom: 10,
                    alignSelf: 'stretch',
                    textAlign: 'center',
                  }}>
                  {tenderDetails.tender_description}
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
                onPress={() => openTenderURL(tenderDetails?.tender_url)}
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
                    <Label small>Tender Location</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        textAlign: 'right',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}>
                      {tenderDetails.Location || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Department</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                        flex: 1,
                        flexWrap: 'wrap',
                      }}>
                      {tenderDetails.department || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> ProductCategory</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.ProductCategory || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Status</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.tender_status || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 5,
                    }}>
                    <Label small> Bidder Query</Label>
                    {tenderDetails?.bidder_query && (
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
                          openTenderURL(tenderDetails?.bidder_query)
                        }
                      />
                    )}
                    {!tenderDetails?.bidder_query && (
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
                    <Label small> Opening Date</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.BidOpeningDate || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> BidSubStart Date</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.BidSubStartDate || 'N/A'}
                    </Label>
                  </View>

                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small>DocDownl StartDate</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.DocDownlStartDate || 'N/A'}
                    </Label>
                  </View>

                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> DocDownl EndDate</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.DocDownlEndDate || 'N/A'}
                    </Label>
                  </View>

                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Organisation Name</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.OrganisationName || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> Organisation Type</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.OrganisationType || 'N/A'}
                    </Label>
                  </View>
                  <View
                    style={{
                      marginRight: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Label small> ePublish Date</Label>
                    <Label
                      style={{
                        color: theme.colors.dark,
                        marginBottom: 10,
                        textAlign: 'right',
                      }}>
                      {tenderDetails.ePublishDate || 'N/A'}
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
