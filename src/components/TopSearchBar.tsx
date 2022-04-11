import {View} from 'native-base';
import {TextInput, TouchableOpacity, TextProps} from 'react-native';
import {useState, ReactNode, useContext} from 'react';
import {Theme} from '../styles/Theme';
import React from 'react';
import {Icon, ThemeContext} from 'react-native-elements';

interface Props {
  placeholderText: string;
  filterResult: (searchText: string) => void;
  setFilterModal?: () => void;
}

export const TopSearchBar = (props: Props): JSX.Element => {
  const {placeholderText, filterResult, setFilterModal} = props;
  const [tenderSearchText, setTenderSearchText] = useState('');
  const {theme} = useContext(ThemeContext);

  const filterResultFn = () => {

    tenderSearchText && filterResult(tenderSearchText);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <TextInput
        placeholder={placeholderText}
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
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          borderRadius: 50,
        }}>
        <Icon
          raised
          style={{padding: 0}}
          size={19}
          name="search"
          color={Theme.colors.primary}
          type="font-awesome"
          onPress={filterResultFn}
        />
      </View>

      {setFilterModal && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-start',
            borderRadius: 50,
          }}>
          <TouchableOpacity onPress={setFilterModal}>
            <Icon
              raised
              style={{padding: 0}}
              size={19}
              name="sort-amount-desc"
              color={Theme.colors.primary}
              type="font-awesome"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
