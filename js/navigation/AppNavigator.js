import React from 'react';
import { createDrawerNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import SidebarScreen from '../screens/SidebarScreen';

import { sizes } from '../constants/parameters';

export default createDrawerNavigator({
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
