import React, {createContext, useState} from 'react';

//export const LoginContext = createContext(false);

const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
export const AuthContext = createContext({});

export const AuthProvider = (props: any) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    sleep(2000).then(() => setLoggedIn(true));
  };
  const logout = () => {
    sleep(2000).then(() => setLoggedIn(false));
  };
  const authContextValue = {
    login,
    loggedIn,
    logout,
  };
  return <AuthContext.Provider value={authContextValue} {...props} />;
};

export const useAuth = () => React.useContext(AuthContext);
