import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

import Text from './Text';
import Icon from './Icon';

import { colors } from '../constants/parameters';

export default class Avatar extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    textStyle: PropTypes.any,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    uri: PropTypes.string,
    uppercase: PropTypes.bool,
    size: PropTypes.number,
    icon: PropTypes.string,
    set: PropTypes.string,
  };

  static defaultProps = {
    size: 40,
    uppercase: true,
  }

  render() {
    const {
      style, textStyle, size, text, uppercase, uri, icon, set,
    } = this.props;

    return (
      <View
        style={[
          styles.avatar,
          uri && styles.avatarWithImage,
          {
            width: size,
            height: size,
          },
          style,
        ]}
      >
        {uri ? (
          <Image
            style={styles.image}
            resizeMethod="scale"
            source={{ uri }}
          />
        ) : !icon ? (
          <Text
            style={[
              styles.text,
              textStyle,
            ]}
            uppercase={uppercase}
          >
            {text}
          </Text>
        ) : (
          <Icon
            set={set}
            name={icon}
            style={[
              styles.text,
              textStyle,
            ]}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.white,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarWithImage: {
    borderWidth: 0,
  },
  text: {
    color: colors.primary,
    fontSize: 20,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
