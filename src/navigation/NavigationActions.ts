import * as React from 'react';
import {
  NavigationContainerRef,
  NavigationState,
} from '@react-navigation/native';
import {DrawerActions, StackActions} from '@react-navigation/routers';
import {
  PartialState,
  Route,
} from '@react-navigation/routers/lib/typescript/src/types';

export const navigationRef = React.createRef<NavigationContainerRef>();

export const NavigationActions = {
  navigateToScreen: ({
    screenName,
    params,
  }: {
    screenName: string;
    params?: Record<string, unknown>;
  }): void => {
    if (__DEV__) {
      /* eslint-disable no-console */
      console.log('NavigateToScreen', screenName, params);
    }

    navigationRef.current?.navigate(screenName, params);
  },
  navigateToScreenWithPush: ({
    screenName,
    params,
  }: {
    screenName: string;
    params?: Record<string, unknown>;
  }): void => {
    if (__DEV__) {
      /* eslint-disable no-console */
      console.log('NavigateToScreenWithPush', screenName, params);
    }

    navigationRef.current?.dispatch(StackActions.push(screenName, params));
  },
  navigateToDifferentStackedScreen: ({
    stackName,
    screenName,
    params,
  }: {
    stackName: string;
    screenName: string;
    params?: Record<string, unknown>;
  }): void => {
    if (__DEV__) {
      /* eslint-disable no-console */
      console.log(
        'NavigateToDifferentStackedScreen',
        stackName,
        screenName,
        params,
      );
    }

    navigationRef.current?.navigate(stackName, {
      screen: screenName,
      params: params,
    });
  },
  navigateBack: (): void => navigationRef.current?.goBack(),
  navigateToStartScreen: (
    routes: Array<{name: string; params?: Record<string, unknown>}>,
  ): void => navigationRef.current?.reset({routes}),
};

export const getNavigator = (): NavigationContainerRef | null =>
  navigationRef.current;

// Cast to any -> Bug in TS.
// https://github.com/microsoft/TypeScript/issues/36390
export function isRouteInNavigation(routeName: string): boolean {
  const navigator = getNavigator()?.getRootState();
  let didFindRoute = false;
  let index = 0;
  const lengthOfRoute = navigator?.routes?.length ?? 0;

  while (!didFindRoute && index < lengthOfRoute - 1) {
    const stackRoute = navigator?.routes[index];
    const foundRoute = (stackRoute?.state?.routes as any)?.find(
      (
        route: Route<string> & {
          state?: NavigationState | PartialState<NavigationState>;
        },
      ) => route.name === routeName,
    );
    didFindRoute = !!foundRoute;
    if (didFindRoute) {
      break;
    }
    index += 1;
  }

  return didFindRoute;
}

export const toggleNavigationDrawer = (): void => {
  navigationRef.current?.dispatch(DrawerActions.toggleDrawer);
};
