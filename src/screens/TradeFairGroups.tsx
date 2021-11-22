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
    tradeFairList: any;
  };
};
const TradeFairGroups = ({route}: {route: RouteParams}) => {
  const {tradeFairList} = route.params;

  const [filteredTradeFairCategoriesList, setFilteredTradeFairCategoriesList] =
    useState(tradeFairList);
  const filterTenderCategories = React.useCallback(
    (searchText: string) => {
      const allTradeFairCategoryContainingSearchText = tradeFairList.filter(
        (tradeFairCategory: any) => {
          return tradeFairCategory.tender_type
            ?.toLowerCase()
            ?.includes(searchText.toLowerCase());
        },
      );

      searchText
        ? setFilteredTradeFairCategoriesList(
            allTradeFairCategoryContainingSearchText,
          )
        : setFilteredTradeFairCategoriesList(tradeFairList);
    },
    [tradeFairList],
  );

  const setFilterModal = React.useCallback(() => {}, []);
  const navigateToListPage = React.useCallback((tradeFairCategory: any) => {
    NavigationActions.navigateToScreen({
      screenName: Screens.TradeFairScreen,
      params: {
        tradeFairsList: tradeFairCategory.data,
      },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopSearchBar filterResult={filterTenderCategories} />
      <View style={styles.myAllData}>
        {filteredTradeFairCategoriesList?.map((tradeFair: any) => {
          return (
            <TouchableOpacity
              key={tradeFair.city}
              onPress={() => navigateToListPage(tradeFair)}>
              <View>
                <View style={styles.myBarData}>
                  <Label>{tradeFair.city}</Label>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default TradeFairGroups;

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
