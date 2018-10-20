import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';

import Text from './Text';

import { colors } from '../constants/parameters';

export default class List extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.any,
    ]),
    onPress: PropTypes.func,
    text: PropTypes.string,
    secondaryText: PropTypes.string,
    thumbnail: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    thumbnailStyle: PropTypes.any,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    onPress: () => false,
  }

  render() {
    const {
      children, onPress, text, secondaryText, thumbnail, disabled, thumbnailStyle,
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
        style={styles.container}
      >
        { thumbnail && (
          <FastImage
            source={!_.isNumber(thumbnail) ? { uri: thumbnail } : thumbnail}
            fallback={_.isNumber(thumbnail)}
            style={[
              styles.image,
              disabled && styles.image_disabled,
              thumbnailStyle,
            ]}
          />
        )}
        <View style={styles.wrapper}>
          <Text style={disabled && styles.secondaryText}>
            {text}
          </Text>
          {secondaryText && (
            <Text style={styles.secondaryText}>
              {' - '}
              {secondaryText}
            </Text>
          )}
        </View>

        <View>
          {children}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 9,
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  image_disabled: {
    opacity: 0.5,
  },
  image: {
    height: 24,
    width: 24,
    marginRight: 12,
    borderRadius: 50,
  },
  secondaryText: {
    color: colors.grey,
  },
});