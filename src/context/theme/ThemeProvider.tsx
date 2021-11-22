import React, {PropsWithChildren} from 'react';
import {ThemeContext} from './ThemeContext';

export const ThemeProvider = (
    props: PropsWithChildren<ThemeContext>,
): JSX.Element => {
    return (
        <ThemeContext.Provider value={{theme: props.theme}}>
            {props.children}
        </ThemeContext.Provider>
    );
};
