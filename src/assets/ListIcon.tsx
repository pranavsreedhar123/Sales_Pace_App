import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

import {ViewStyle} from 'react-native';

export const ListIcon = ({style}: {style?: ViewStyle}): JSX.Element => {
  const defaultWidth = '1em';
  const defaultHeight = '1em';
  return (
    <Svg viewBox="0 0 24 24" width="24" height="24">
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path
        fill={'#000'}
        d="M14.17 5L19 9.83V19H5V5h9.17m0-2H5a2.006 2.006 0 00-2 2v14a2.006 2.006 0 002 2h14a2.006 2.006 0 002-2V9.83a1.966 1.966 0 00-.59-1.41l-4.83-4.83A1.966 1.966 0 0014.17 3zM7 15h10v2H7zm0-4h10v2H7zm0-4h7v2H7z"
      />
    </Svg>
  );
};
