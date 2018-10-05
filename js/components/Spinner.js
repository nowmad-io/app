import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

import { colors } from '../constants/parameters';

export default class Spinner extends PureComponent {
  static propTypes = {
    ...ActivityIndicator.propTypes,
    children: PropTypes.any,
    size: PropTypes.string,
    color: PropTypes.string,
    visible: PropTypes.bool,
    style: PropTypes.any,
    wrapperStyle: PropTypes.any,
    overlay: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    color: colors.primary,
    visible: false,
    overlay: false,
    size: 'large',
  }

  render() {
    const {
      children, visible, wrapperStyle, style, overlay, color, size,
    } = this.props;

    return (
      <View
        style={[
          visible && style,
          children && wrapperStyle,
          overlay && visible ? styles.overlay : {},
        ]}
      >
        { visible ? (
          <ActivityIndicator
            color={color}
            size={size}
          />
        ) : children }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.WhiteTransparent,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
