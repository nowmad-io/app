import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Button from './Button';

import { colors, sizes } from '../constants/parameters';

export default class Spinner extends PureComponent {
  static propTypes = {
    onActionPress: PropTypes.func,
  };

  static defaultProps = {
    onActionPress: () => true,
  };

  render() {
    const { onActionPress } = this.props;

    return (
      <View style={styles.header}>
        <View style={styles.right}>
          <Button
            header
            transparent
            onPress={onActionPress}
            icon="menu"
          />
        </View>
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
