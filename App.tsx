import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/navigation/NavigationActions';
import {MainStackNavigator} from './src/navigation/MainStackNavigator';
import {AuthContext} from './src/components/auth-context';
import {AnalyticsHelper} from './src/utils/AnalyticsHelper';
import RNBootSplash from 'react-native-bootsplash';

const App = (): JSX.Element => {
  const routeNameRef = useRef<string>();

  React.useEffect(() => {
    RNBootSplash.hide();
  }, []);

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
        if (previousRouteName !== currentRouteName) {
          AnalyticsHelper.logScreenView(currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}>
      <MainStackNavigator />
    </NavigationContainer>
  );
};

export default App;
