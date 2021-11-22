import React from 'react';
import {Theme} from '../../styles/Theme';

export interface ThemeContext {
    theme: typeof Theme;
}

export const ThemeContext = React.createContext<ThemeContext>({
    theme: Theme,
});
