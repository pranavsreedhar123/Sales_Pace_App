import * as React from 'react';
import {TextStyle, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Text} from 'react-native-elements';

interface Props {
  small?: boolean;
  text?: string;
  color?: string;
  labelStyle?: TextStyle;
  icon?: Element;
}

export const LabelButton = (
  props: React.PropsWithChildren<Props> & TouchableOpacityProps,
): JSX.Element => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={props.onPress}
      style={props.style}>
      {!!props.icon && props.icon}
      {!!props.text && (
        <Text style={[{color: props.color || '#fff'}, props.labelStyle]}>
          {props.text}
        </Text>
      )}
      {props.children}
    </TouchableOpacity>
  );
};
