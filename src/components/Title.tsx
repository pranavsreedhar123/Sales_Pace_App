import React, {ReactNode, useContext} from 'react';
import {Text, TextStyle} from 'react-native';

interface Props {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h2SemiBold?: boolean;
  h2Regular?: boolean;
  h3Bold?: boolean;
  style?: TextStyle;
}

const createBaseHeaderStyleFromTheme = () =>
  ({
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'left',
    marginVertical: 4,
  } as TextStyle);

export const Title = (
  props: React.PropsWithChildren<ReactNode> & Props,
): JSX.Element => {
  let themedStyle = createBaseHeaderStyleFromTheme();

  return <Text style={[themedStyle, props.style]}>{props.children}</Text>;
};
