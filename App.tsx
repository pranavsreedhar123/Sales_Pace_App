import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigation/NavigationActions';
import {MainStackNavigator} from './src/navigation/MainStackNavigator';
import {AuthContext, LoginContext} from './src/components/auth-context';

const App = (): JSX.Element => {
  const routeNameRef = useRef<string>();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          navigationRef?.current?.getCurrentRoute()?.name;
        routeNameRef.current = currentRouteName;
      }}>
      <MainStackNavigator />
    </NavigationContainer>
);
};

export default App;
