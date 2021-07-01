import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native';

export const MenuBarIcon = ({style}: {style?: ViewStyle}): JSX.Element => {
  return (
    <Svg width="20" height="25" style={style} viewBox="0 0 20 1" fill="#000">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 2V0h18v2H0zm0 5h18V5H0v2zm0 5h18v-2H0v2z"
        fill="#000"
      />
    </Svg>
  );
};
