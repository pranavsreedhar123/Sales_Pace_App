import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native';

export const ArrowBackIcon = ({style}: {style?: ViewStyle}): JSX.Element => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" style={style}>
      <Path
        d="M16 7H3.83l5.59-5.59L8 0 0 8l8 8 1.41-1.41L3.83 9H16V7z"
        fill="#fff"
      />
    </Svg>
  );
};
