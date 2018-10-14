import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

import { colors } from '../constants/parameters';

export default class MarkerPosition extends PureComponent {
  static propTypes = {
    onPositionPress: PropTypes.func,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  };

  static defaultProps = {
    onPositionPress: () => true,
  }

  onPositionPress = ({ nativeEvent }) => this.props.onPositionPress(nativeEvent);

  render() {
    const {
      latitude,
      longitude,
    } = this.props;

    return (
      <MapView.Marker
        coordinate={{ latitude, longitude }}
        onPress={this.onPositionPress}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{ elevation: 4 }}
      >
        <View style={styles.dot} />
      </MapView.Marker>
    );
  }
}

const styles = StyleSheet.create({
  dot: {
    elevation: 4,
    height: 20,
    width: 20,
    backgroundColor: colors.blue,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 50,
  },
});
