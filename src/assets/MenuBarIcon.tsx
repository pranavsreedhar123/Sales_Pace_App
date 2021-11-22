import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native';
import {Theme} from '../styles/Theme';

export const MenuBarIcon = ({style}: {style?: ViewStyle}): JSX.Element => {
  return (
    <Svg
      width="25"
      height="30"
      style={style}
      color={Theme.colors.primary}
      viewBox="0 0 20 1"
      fill={Theme.colors.primary}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2V0h18v2H0zm0 5h18V5H0v2zm0 5h18v-2H0v2z"
        fill={Theme.colors.primary}
      />
    </Svg>
  );
};
