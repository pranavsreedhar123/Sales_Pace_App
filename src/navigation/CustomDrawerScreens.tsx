import * as React from 'react';
import {Screens} from './Screens';
import {CustomDrawerScreen} from '../types/CustomDarwerScreen';
import {ListIcon} from '../assets/ListIcon';

export const CustomDrawerScreens = (): CustomDrawerScreen[] => {
  return [
    {
      name: Screens.TopVloggerScreen,
      displayName: 'Top Vloggers',
      icon: <ListIcon style={{width: 24, height: 24}} />,
    },
    {
      name: Screens.GovtProjectScreen,
      displayName: 'All tenders',
      icon: <ListIcon style={{width: 24, height: 24}} />,
    },
    {
      name: Screens.TradeFairScreen,
      displayName: 'All Trade Fairs',
      icon: <ListIcon style={{width: 24, height: 24}} />,
    },
    {
      name: Screens.VideoScreen,
      displayName: 'Video Sharing',
      icon: <ListIcon style={{width: 24, height: 24}} />,
    },
  ];
};
