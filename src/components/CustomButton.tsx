import React from 'react';
import {
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  View,
  StyleSheet,
} from 'react-native';

import {CommonStyles} from '../styles/CommonStyle';
import {Helpers} from '../utils/Helpers';

interface Props {
  backgroundColorOnTouch: string;
}

export const CustomButton = (
  props: React.PropsWithChildren<TouchableNativeFeedbackProps & Props>,
): JSX.Element => {
  return Platform.OS === 'android' ? (
    <TouchableNativeFeedback
      {...props}
      accessibilityRole="button"
      background={TouchableNativeFeedback.Ripple(
        Helpers.getColorLuminance(props.backgroundColorOnTouch, 0.5),
        false,
      )}>
      <View style={[styles.button, props.style]}>{props.children}</View>
    </TouchableNativeFeedback>
  ) : (
    <TouchableHighlight
      {...props}
      accessibilityRole="button"
      style={[styles.button, CommonStyles.center, props.style]}
      underlayColor={Helpers.getColorLuminance(
        props.backgroundColorOnTouch,
        0.5,
      )}>
      {props.children}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
  },
});
