import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import Dispatch from '../libs/dispatch';

import { seenRequests } from '../actions/friends';

import HomeScreen from '../screens/home/HomeScreen';
import SidebarScreen from '../screens/SidebarScreen';

import { sizes } from '../constants/parameters';

const HomeNavigator = createDrawerNavigator({
  HomeScreen,
  SidebarScreen,
}, {
  drawerPosition: 'right',
  contentComponent: props => <SidebarScreen {...props} />,
  drawerWidth: sizes.drawerWidth,
  navigationOptions: {
    header: null,
  },
});


const defaultGetStateForAction = HomeNavigator.router.getStateForAction;

HomeNavigator.router.getStateForAction = (action, state) => {
  if (action.type === 'Navigation/DRAWER_CLOSED') {
    Dispatch.instance(seenRequests());
  }

  return defaultGetStateForAction(action, state);
};

export default HomeNavigator;
