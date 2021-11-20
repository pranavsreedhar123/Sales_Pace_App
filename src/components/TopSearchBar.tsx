import {View, Icon} from 'native-base';
import {TextInput, TouchableOpacity, TextProps} from 'react-native';
import {useState, ReactNode, useContext} from 'react';
import {Theme} from '../styles/Theme';
import React from 'react';
import {ThemeContext} from 'react-native-elements';

interface Props {
  filterResult: (searchText: string) => void;
  setFilterModal?: () => void;
}

export const TopSearchBar = (props: Props): JSX.Element => {
  const {filterResult, setFilterModal} = props;
  const [tenderSearchText, setTenderSearchText] = useState('');
  const {theme} = useContext(ThemeContext);

  const filterResultFn = React.useCallback(() => {
    tenderSearchText && filterResult(tenderSearchText);
  }, [filterResult]);

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <TextInput
        placeholder="Search Tenders"
        placeholderTextColor={Theme.colors.primary}
        style={{
          width: '70%',
          borderColor: Theme.colors.borderColor,
          borderWidth: 2,
          paddingRight: 5,
          fontSize: 17,
          borderRadius: 25,
          backgroundColor: Theme.colors.lightest,
          paddingHorizontal: 15,
          height: 40,
          marginTop: 10,
          color: 'black',
        }}
        value={tenderSearchText}
        onChangeText={text => setTenderSearchText(text)}
      />
      <Icon
        name="search"
        type="FontAwesome"
        style={{padding: 10}}
        fontSize={10}
        color={'red'}
        onPress={filterResultFn}
      />

      {setFilterModal && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            borderRadius: 50,
          }}>
          <TouchableOpacity onPress={setFilterModal}>
            <Icon
              name="sort-amount-desc"
              type="FontAwesome"
              style={{padding: 10}}
              fontSize={10}
              color={Theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
