import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Image } from 'react-native';
import MapView from 'react-native-maps';
import _ from 'lodash';

import Avatar from './Avatar';

import { colors } from '../constants/parameters';

const triangleHelper = 10;

export default class Marker extends React.Component {
  static propTypes = {
    onMarkerPress: PropTypes.func,
    onPrefetched: PropTypes.func,
    uid: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    picture: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    selected: PropTypes.bool,
    prefetched: PropTypes.bool,
    google: PropTypes.bool,
  };

  static defaultProps = {
    onMarkerPress: () => true,
    onPrefetched: () => true,
  }

  constructor(props) {
    super(props);

    this.state = {
      prefetched: !props.picture || props.prefetched,
    };
    this.prefetchId = null;
  }

  componentDidMount() {
    const { onPrefetched, picture } = this.props;
    const { prefetched } = this.state;

    if (!prefetched) {
      Image.prefetch(picture, (prefetchId) => { this.prefetchId = prefetchId; })
        .then(() => {
          onPrefetched(picture);
          this.setState({ prefetched: true });
        });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
  }

  componentWillUnmount() {
    if (this.prefetchId) {
      Image.abortPrefetch(this.prefetchId);
    }
  }

  onMarkerPress = () => this.props.onMarkerPress(this.props.uid);

  render() {
    const {
      latitude,
      longitude,
      text,
      picture,
      selected,
      google,
    } = this.props;
    const { prefetched } = this.state;

    const me = (text === 'me');
    const avatarSize = me ? 36 : 40;
    const height = !selected
      ? (avatarSize + triangleHelper - 1) : (avatarSize + 2 * (triangleHelper + 1));

    return prefetched && (
      <MapView.Marker
        coordinate={{ latitude, longitude }}
        onPress={this.onMarkerPress}
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
            uppercase={!me}
            style={[
              styles.avatar,
              selected && styles.avatar_selected,
            ]}
            textStyle={[
              selected && styles.avatar_text_selected,
              me && styles.avatarMe,
            ]}
            set="FontAwesome"
            icon={google && 'google' || ''}
          />
          <View
            style={[
              styles.triangle,
              selected && styles.triangle_selected,
            ]}
          />
        </View>
      </MapView.Marker>
    ) || [];
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
    backgroundColor: colors.primary,
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
