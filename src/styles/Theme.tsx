import {MainTheme} from './MainTheme';
import {DefaultTheme} from '@react-navigation/native';

export type ThemeType = typeof MainTheme;
const Theme = MainTheme;

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.colors.primary,
    text: Theme.colors.primary,
  },
};

export {Theme, NavigationTheme};
