import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import { colors, sizes } from '../constants/parameters';

export default class Spinner extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    left: PropTypes.object,
    right: PropTypes.object,
  };

  render() {
    const { children, left, right } = this.props;

    return (
      <View style={styles.header}>
        {left && (
          <View style={styles.left}>
            {left}
          </View>
        )}
        {children}
        {right && (
          <View style={styles.right}>
            {right}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: sizes.headerHeight,
  },
  left: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
});
