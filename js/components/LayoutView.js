import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, StyleSheet, View } from 'react-native';

import { colors, sizes } from '../../parameters';

export default class LayoutView extends PureComponent {
  static propTypes = {
    ...ViewPropTypes,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    type: PropTypes.oneOf([
      'header',
      'container',
      'left',
      'right',
      'wrapper',
    ]),
  };

  render() {
    const { style, type } = this.props;
    return (
      <View {...this.props} style={[styles[type], style]}>
        {this.props.children}
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
    borderBottomColor: colors.primary,
    height: sizes.headerHeight,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  container: {
    flex: 1,
    height: sizes.height,
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
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },
});
