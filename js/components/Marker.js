import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

import Avatar from './Avatar';

import { colors } from '../constants/parameters';

const triangleHelper = 10;

export default class Marker extends PureComponent {
  static propTypes = {
    onMarkerPress: PropTypes.func,
    coordinates: PropTypes.object,
    text: PropTypes.string,
    picture: PropTypes.string,
    selected: PropTypes.bool,
  };

  static defaultProps = {
    onMarkerPress: () => true,
  }

  render() {
    const {
      onMarkerPress,
      coordinates,
      text,
      picture,
      selected,
    } = this.props;
    const me = (text === 'me');
    const avatarSize = me ? 36 : 40;
    const height = !selected
      ? (avatarSize + triangleHelper - 1) : (avatarSize + 2 * (triangleHelper + 1));

    return (
      <MapView.Marker
        coordinate={coordinates}
        onPress={onMarkerPress}
        anchor={{ x: 0.5, y: 1 }}
        tracksViewChanges={false}
      >
        <View
          style={[
            styles.wrapper,
            { height },
            selected && styles.wrapper_selected,
            selected && { width: height },
          ]}
        >
          <Avatar
            uri={picture}
            size={avatarSize}
            text={text}
            uppercase={me}
            style={[
              styles.avatar,
              selected && styles.avatar_selected,
            ]}
            textStyle={[
              selected && styles.avatar_text_selected,
              me && styles.avatarMe,
            ]}
          />
          <View
            style={[
              styles.triangle,
              selected && styles.triangle_selected,
            ]}
          />
        </View>
      </MapView.Marker>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  wrapper_selected: {
    justifyContent: 'center',
    backgroundColor: colors.primaryShadow,
    borderRadius: 50,
  },
  avatar: {
    borderWidth: 2,
  },
  avatar_selected: {
    backgroundColor: colors.green,
    borderColor: colors.white,
  },
  avatar_text_selected: {
    color: colors.white,
  },
  avatarMe: {
    fontSize: 18,
    lineHeight: 20,
  },
  triangle: {
    position: 'absolute',
    bottom: 0,
    borderTopWidth: triangleHelper,
    borderRightWidth: triangleHelper / 2.0,
    borderBottomWidth: 0,
    borderLeftWidth: triangleHelper / 2.0,
    borderTopColor: colors.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    zIndex: 2,
  },
  triangle_selected: {
    bottom: 2,
    borderTopColor: colors.white,
  },
  triangle_green: {
    borderTopColor: colors.primary,
  },
});
