import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';

import Tab from '../screens/home/Tab';
import Text from '../components/Text';

import { colors, fonts } from '../constants/parameters';

export default createMaterialTopTabNavigator({
  All: Tab,
  People: Tab,
  Places: Tab,
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarLabel: (tab) => {
      const { routeName } = navigation.state;

      return (
        <Text
          style={[
            styles.regular,
            tab.focused && styles.focused,
          ]}
        >
          { routeName }
        </Text>
      );
    },
  }),
  tabBarOptions: {
    style: {
      elevation: 0,
      backgroundColor: 'transparent',
      borderBottomWidth: 0.5,
      borderColor: colors.grey,
    },
    indicatorStyle: {
      backgroundColor: colors.primary,
    },
  },
});

const styles = StyleSheet.create({
  regular: {
    fontSize: 14,
    ...fonts.medium,
    color: colors.grey,
  },
  focused: {
    color: colors.black,
  },
});
