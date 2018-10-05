import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class Map extends Component {
  timeout = null

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    onRef: PropTypes.func,
    onRegionChangeComplete: PropTypes.func,
    onPoiClick: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    onLayout: PropTypes.func,
    onMapReady: PropTypes.func,
    onPanDrag: PropTypes.func,
    region: PropTypes.object,
    zoomEnabled: PropTypes.bool,
    rotateEnabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    moveOnMarkerPress: PropTypes.bool,
    cacheEnabled: PropTypes.bool,
    mapPadding: PropTypes.object,
  }

  static defaultProps = {
    onRef: () => true,
    onRegionChangeComplete: () => true,
    onPoiClick: () => true,
    onLongPress: () => true,
    onLayout: () => true,
    onMapReady: () => true,
    onPanDrag: () => true,
    zoomEnabled: true,
    rotateEnabled: true,
    scrollEnabled: true,
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onRef(ref) {
    this._ref = ref;
    this.props.onRef(ref);
  }

  onMapReady() {
    if (this._ref) {
      this._ref.map.setNativeProps({ style: [styles.map, { marginBottom: 0 }] });
    }

    this.props.onMapReady();
  }

  updatePadding(mapPadding) {
    if (!this._ref.map) {
      return;
    }
    this._ref.map.setNativeProps({ style: [styles.map, { marginBottom: 1 }] });
    this._ref.map.setNativeProps({ mapPadding });

    this.timeout = setTimeout(
      () => this._ref.map.setNativeProps({ style: [styles.map, { marginBottom: 0 }] }),
      100,
    );
  }

  animateToRegion(region, duration = 500) {
    this._ref.animateToRegion(region, duration);
  }

  animateToBearing(bearing, duration = 500) {
    this._ref.animateToBearing(bearing, duration);
  }

  animateToCoordinate(place, duration = 500) {
    this._ref.animateToCoordinate(place, duration);
  }

  fitToCoordinates(coordinates) {
    this._ref.fitToCoordinates(coordinates);
  }

  zoomBy(zoom) {
    this._ref.zoomBy(zoom);
  }

  render() {
    const {
      region, zoomEnabled, rotateEnabled, scrollEnabled, mapPadding, onLongPress,
      onPress, onRegionChangeComplete, moveOnMarkerPress, onPoiClick, onLayout,
      onPanDrag, cacheEnabled,
    } = this.props;

    return (
      <MapView
        ref={ref => this.onRef(ref)}
        onMapReady={() => this.onMapReady()}
        onRegionChangeComplete={newRegion => onRegionChangeComplete(newRegion)}
        onPress={onPress}
        onLongPress={event => onLongPress(event.nativeEvent)}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsMyLocationButton={false}
        initialRegion={region}
        zoomEnabled={zoomEnabled}
        rotateEnabled={rotateEnabled}
        scrollEnabled={scrollEnabled}
        mapPadding={mapPadding}
        moveOnMarkerPress={moveOnMarkerPress}
        onLayout={onLayout}
        onPanDrag={onPanDrag}
        onPoiClick={event => onPoiClick && onPoiClick(event.nativeEvent)}
        cacheEnabled={cacheEnabled}
      >
        {this.props.children}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    marginBottom: 1,
  },
});
