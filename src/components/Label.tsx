import React, {ReactNode, useContext} from 'react';
import {TextStyle, Text, TextProps} from 'react-native';
import {Theme} from '../styles/Theme';
import {ThemeContext} from '../context/theme/ThemeContext';

interface Props {
  byLine?: boolean;
  regular?: boolean;
  semiNormal?: boolean;
  small?: boolean;
  smallBold?: boolean;
  style?: TextStyle;
  regularLead?: boolean;
  regularBold?: boolean;
  semiLarge?: boolean;
}

const createRegularLeadTextStyleFromTheme = ({colors, fonts}: typeof Theme) =>
  ({
    color: colors.primary,
    fontSize: fonts.fontSize.regular,
    fontWeight: fonts.fontWeights.semiBold,
    textAlign: 'left',
  } as TextStyle);

// const createByLineTextStyleFromTheme = ({colors, fonts}: typeof Theme) =>
//     ({
//         color: colors.helperPrimary,
//         fontSize: fonts.fontSize.small,
//         fontFamily: fonts.family.titilliumWebRegular,
//         fontWeight: fonts.fontWeights.regular,
//         textAlign: 'left',
//     } as TextStyle);

const createBodyStyleFromTheme = ({colors, fonts}: typeof Theme) =>
  ({
    color: colors.primary,
    fontSize: fonts.fontSize.small,
    fontWeight: fonts.fontWeights.regular,
    textAlign: 'left',
  } as TextStyle);

const createSmallTextStyleFromTheme = ({colors, fonts}: typeof Theme) =>
  ({
    color: colors.primary,
    fontSize: fonts.fontSize.smallest,
    fontWeight: fonts.fontWeights.regular,
    textAlign: 'left',
  } as TextStyle);

// const createSmallBoldTextStyleFromTheme = ({colors, fonts}: typeof Theme) =>
//     ({
//         color: colors.primary,
//         fontSize: fonts.fontSize.small,
//         fontFamily: fonts.family.titilliumWebSemiBold,
//         textAlign: 'left',
//     } as TextStyle);

// const createRegularFontStyleFromTheme = ({colors, fonts}: typeof Theme) =>
//     ({
//         color: colors.primary,
//         fontSize: fonts.fontSize.regular,
//         fontFamily: fonts.family.titilliumWebRegular,
//         fontWeight: fonts.fontWeights.regular,
//         textAlign: 'left',
//     } as TextStyle);

// const createSemiNormalFontStyleFromTheme = ({colors, fonts}: typeof Theme) =>
//     ({
//         color: colors.primary,
//         fontSize: fonts.fontSize.backButtonFontSize,
//         fontFamily: fonts.family.regular,
//         fontWeight: fonts.fontWeights.semiBold,
//         textAlign: 'left',
//     } as TextStyle);

// const createRegularBoldStyleFromTheme = ({colors, fonts}: typeof Theme) =>
//     ({
//         color: colors.cta,
//         fontSize: fonts.fontSize.regular,
//         fontFamily: fonts.family.titilliumWebRegular,
//         fontWeight: fonts.fontWeights.bold,
//         textAlign: 'left',
//     } as TextStyle);

// const createSemiLargeStyleFromTheme = ({colors, fonts}: typeof Theme) =>
//     ({
//         color: colors.primary,
//         fontSize: fonts.fontSize.semiLarge,
//         fontFamily: fonts.family.titilliumWebSemiBold,
//         fontWeight: fonts.fontWeights.semiBold,
//         textAlign: 'left',
//     } as TextStyle);

export const Label = (
  props: React.PropsWithChildren<ReactNode> & TextProps & Props,
): JSX.Element => {
  const {theme} = useContext(ThemeContext);

  let themedStyle = createBodyStyleFromTheme(theme);
  if (props.regularLead) {
    themedStyle = createRegularLeadTextStyleFromTheme(theme);
  } else if (props.regularLead) {
    themedStyle = createSmallTextStyleFromTheme(theme);
  }

  return (
    <Text
      style={[themedStyle, props.style]}
      numberOfLines={props.numberOfLines}>
      {props.children}
    </Text>
  );
};
