import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Text from './Text';

import { colors, fonts } from '../constants/parameters';

export default class Badge extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    count: PropTypes.number,
  };

  render() {
    const { style, count } = this.props;
    return (
      <View
        style={[styles.badge, style]}
        pointerEvents="none"
      >
        <Text style={styles.text}>
          {count}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.red,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
    width: 16,
  },
  text: {
    color: colors.white,
    fontSize: 10,
    lineHeight: 14,
    ...fonts.medium,
  },
});
