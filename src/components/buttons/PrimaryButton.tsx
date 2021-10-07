import {TouchableOpacityProps, View} from 'react-native';
import React, {useContext} from 'react';
import {Title} from '../Title';
import {Theme} from '../../styles/Theme';
import {ThemeContext} from '../../context/theme/ThemeContext';
import {CommonStyles} from '../../styles/CommonStyle';
import {CustomButton} from './CustomButton';

interface Props {
  text: string;
  isLoading?: boolean;
  backgroundColorOnTouch?: string;
}

export const PrimaryButton = ({
  text,
  isLoading,
  onPress,
  style,
  disabled,
  backgroundColorOnTouch,
}: Props & TouchableOpacityProps): JSX.Element => {
  const {theme} = useContext(ThemeContext);
  return (
    <CustomButton
      disabled={disabled}
      backgroundColorOnTouch={backgroundColorOnTouch || theme.colors.cta}
      style={[
        CommonStyles.center,
        {
          minHeight: 20,
          backgroundColor: theme.colors.dark,
          marginVertical: 10,
          borderColor: theme.colors.lightest,
          borderWidth: 1,
          borderRadius: 30,
        },
        style,
      ]}
      onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* {isLoading && (
                    <Spinner
                        color={theme.colors.lightest}
                        style={{position: 'absolute', left: -50}}
                    />
                )} */}
        <Title h2 style={{color: Theme.colors.lightest}}>
          {text}
        </Title>
      </View>
    </CustomButton>
  );
};
