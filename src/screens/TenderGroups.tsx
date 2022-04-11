import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Label} from 'native-base';
import {TopSearchBar} from '../components/TopSearchBar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationActions} from '../navigation/NavigationActions';
import {Screens} from '../navigation/Screens';

const windowWidth = Dimensions.get('window').width;

type RouteParams = {
  params: {
    govtTendersList: any;
  };
};
const TenderGroups = ({route}: {route: RouteParams}) => {
  const {govtTendersList} = route.params;

  const [filteredTenderCategoriesList, setFilteredTenderCategoriesList] =
    useState(govtTendersList);
  const filterTenderCategories = React.useCallback(
    (searchText: string) => {
      const allTenderCategoryContainingSearchText = govtTendersList.filter(
        (tenderCategory: any) => {
          return tenderCategory.tender_type
            ?.toLowerCase()
            ?.includes(searchText.toLowerCase());
        },
      );

      searchText
        ? setFilteredTenderCategoriesList(allTenderCategoryContainingSearchText)
        : setFilteredTenderCategoriesList(govtTendersList);
    },
    [govtTendersList],
  );

  const setFilterModal = React.useCallback(() => {}, []);
  const navigateToListPage = React.useCallback((tenderCategory: any) => {
    NavigationActions.navigateToScreen({
      screenName: Screens.GovtProjectScreen,
      params: {
        tendersList: tenderCategory.data,
      },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Image style={styles.splogo} source={require('../SPImages/SPLogo.png')} /> */}
      <View style={styles.myBar}>
        <Text style={styles.myBarTitle}>ALL TENDERS</Text>
      </View>

      <View style={styles.myAllData}>
        {filteredTenderCategoriesList.map((govtTender: any) => {
          return (
            <TouchableOpacity
              key={govtTender.tender_type}
              onPress={() => navigateToListPage(govtTender)}>
              <View>
                <View style={styles.myBarData}>
                  <Label>{govtTender.tender_type}</Label>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default TenderGroups;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'baseline',
    backgroundColor: '#fff',
  },
  splogo: {
    width: 80,
    height: 60,
    marginTop: 20,
    marginLeft: 20,
    padding: 5,
  },
  myBar: {
    marginTop: 10,
    width: '100%',
    height: 25,
  },
  myBarTitle: {
    textAlign: 'center',
    marginTop: 0,
    padding: 2,
    fontWeight: 'bold',
    color: 'orange',
  },
  myBarHandler: {
    flexDirection: 'row',
  },
  myBarData: {
    marginTop: 5,
    marginLeft: 5,
    width: windowWidth / 2 - 20,
    height: 100,
    backgroundColor: '#f4f4f4',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'darkblue',
  },
  mySearchBarView: {
    width: '100%',
    height: 45,
    backgroundColor: 'orange',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myAllData: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    //justifyContent:"center",
    alignItems: 'center',
    marginLeft: 3,
    paddingTop: 10,
  },
});
