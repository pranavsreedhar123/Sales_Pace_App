import * as React from 'react';
import Svg, {G, Polygon} from 'react-native-svg';
import {ViewStyle} from 'react-native';

export enum ArrowDirectionEnum {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  BOTTOM = 'BOTTOM',
}

function ArrowIcon({
  style,
  color,
  direction,
  width,
}: {
  color?: string;
  direction: ArrowDirectionEnum;
  style?: ViewStyle;
  width?: number;
}): JSX.Element {
  let rotation;

  switch (direction) {
    case ArrowDirectionEnum.BOTTOM:
      rotation = '-90.000000';
      break;
    case ArrowDirectionEnum.LEFT:
      rotation = '-180.000000';
      break;
    case ArrowDirectionEnum.RIGHT:
      rotation = '0.000000';
      break;
    case ArrowDirectionEnum.UP:
      rotation = '-270.000000';
      break;
    default:
      rotation = 0;
  }

  return (
    <Svg width={width || '9'} height={'16'} viewBox="0 0 9 6" style={style}>
      <G
        id="Symbols"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd">
        <G
          id="ListMenuItem-open"
          transform="translate(-307.000000, -7.000000)"
          fill={color || '#656060'}>
          <G
            id="iconmonstr-arrow-25-(1)"
            transform={`translate(311.500000, 10.000000) scale(1, -1) rotate(${rotation}) translate(-311.500000, -10.000000) translate(309.000000, 6.000000)`}>
            <Polygon
              id="iconmonstr-arrow-25_1_"
              points="0 1 1.019 0 5 4 1.019 8 0 7 3 4"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default ArrowIcon;
