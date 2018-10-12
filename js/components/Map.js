import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class Map extends React.PureComponent {
  timeout = null

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    onRegionChangeComplete: PropTypes.func,
    onPoiClick: PropTypes.func,
    onLongPress: PropTypes.func,
    onPress: PropTypes.func,
    onLayout: PropTypes.func,
    onMapReady: PropTypes.func,
    onPanDrag: PropTypes.func,
    initialRegion: PropTypes.object,
    zoomEnabled: PropTypes.bool,
    rotateEnabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    moveOnMarkerPress: PropTypes.bool,
    cacheEnabled: PropTypes.bool,
    mapPadding: PropTypes.object,
  }

  static defaultProps = {
    onRegionChangeComplete: () => true,
    onPoiClick: () => true,
    onLongPress: () => true,
    onLayout: () => true,
    onMapReady: () => true,
    onPanDrag: () => true,
    moveOnMarkerPress: false,
    zoomEnabled: true,
    rotateEnabled: true,
    scrollEnabled: true,
  }

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onMapReady = () => {
    this._ref.current.map.setNativeProps({ style: [styles.map, { marginBottom: 0 }] });

    this.props.onMapReady();
  }

  onLongPress = event => this.props.onLongPress(event.nativeEvent);

  onPoiClick = event => this.props.onPoiClick(event.nativeEvent);

  updatePadding(mapPadding) {
    if (!this._ref.current.map) {
      return;
    }
    this._ref.current.map.setNativeProps({ style: [styles.map, { marginBottom: 1 }] });
    this._ref.current.map.setNativeProps({ mapPadding });

    this.timeout = setTimeout(
      () => this._ref.current.map.setNativeProps({ style: [styles.map, { marginBottom: 0 }] }),
      100,
    );
  }

  animateToRegion(region, duration = 500) {
    this._ref.current.animateToRegion(region, duration);
  }

  animateToBearing(bearing, duration = 500) {
    this._ref.current.animateToBearing(bearing, duration);
  }

  animateToCoordinate(place, duration = 500) {
    this._ref.current.animateToCoordinate(place, duration);
  }

  fitToCoordinates(coordinates) {
    this._ref.current.fitToCoordinates(coordinates);
  }

  zoomBy(zoom) {
    this._ref.current.zoomBy(zoom);
  }

  render() {
    const {
      initialRegion, zoomEnabled, rotateEnabled, scrollEnabled, mapPadding,
      onPress, onRegionChangeComplete, moveOnMarkerPress, onLayout,
      onPanDrag, cacheEnabled,
    } = this.props;
    console.count('map');
    return (
      <MapView
        ref={this._ref}
        onMapReady={this.onMapReady}
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={onPress}
        onLongPress={this.onLongPress}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsMyLocationButton={false}
        initialRegion={initialRegion}
        zoomEnabled={zoomEnabled}
        rotateEnabled={rotateEnabled}
        scrollEnabled={scrollEnabled}
        mapPadding={mapPadding}
        moveOnMarkerPress={moveOnMarkerPress}
        onLayout={onLayout}
        onPanDrag={onPanDrag}
        onPoiClick={this.onPoiClick}
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
