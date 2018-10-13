import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import Icon from './Icon';
import Spinner from './Spinner';

import { colors } from '../constants/parameters';

export default class ImageHolder extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    uri: PropTypes.string,
    loading: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  };

  render() {
    const {
      onPress, style, uri, loading,
    } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <View style={[
          styles.wrapper,
          !uri && styles.empty,
        ]}
        >
          {uri ? (
            <View style={styles.image}>
              <FastImage
                style={styles.image}
                source={{ uri }}
              />
              <Spinner overlay visible={loading} />
            </View>
          ) : (
            <Icon name="add-a-photo" style={styles.icon} />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 58,
    width: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: 24,
    color: colors.primary,
  },
});
