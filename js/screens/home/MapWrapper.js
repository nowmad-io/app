import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from 'react-redux';
import shortid from 'shortid';
import _ from 'lodash';

import { regionChanged, selectPlace, getGeolocation } from '../../actions/home';

import { selectMarkers } from '../../reducers/entities';

import Map from '../../components/Map';
import Marker from '../../components/Marker';
import Button from '../../components/Button';
import MarkerPosition from '../../components/MarkerPosition';

import { carousel, sizes } from '../../constants/parameters';

const INITIAL_PADDING = {
  top: sizes.headerHeight,
  bottom: carousel.level2,
};

class MapWrapper extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    searchNearby: PropTypes.func,
    geolocation: PropTypes.object,
    places: PropTypes.array,
    selectedPlace: PropTypes.string,
    panY: PropTypes.object,
  }

  static defaultProps = {
    panY: new Animated.Value(0),
  }

  constructor(props) {
    super(props);

    this.prefetchedPictures = {};
    this._map = React.createRef();
  }

  componentWillReceiveProps({ geolocation }) {
    if (geolocation && geolocation.coords
        && !geolocation.loading && this.props.geolocation.loading) {
      this._map.current.getRef().animateToRegion({
        ...geolocation.coords,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
      }, 1000);
    }
  }

  onPrefetched = (picture) => {
    this.prefetchedPictures[picture] = true;
  };

  onMarkerPress = uid => this.props.dispatch(selectPlace(uid));

  onRegionChange = region => this.props.dispatch(regionChanged(region));

  onMapReady = () => {
    this.props.dispatch(getGeolocation());
    this.props.dispatch(regionChanged());
  };

  onZoomOut = () => {
    this._map.current.getRef().zoomBy(-4);
  };

  onLocationPress = () => this.props.dispatch(getGeolocation());

  render() {
    const {
      geolocation, places, selectedPlace, panY, searchNearby,
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Map
          ref={this._map}
          onRegionChangeComplete={this.onRegionChange}
          mapPadding={INITIAL_PADDING}
          onMapReady={this.onMapReady}
          onLongPress={searchNearby}
        >
          {_.map(places, ({
            uid, latitude, longitude, text, picture,
          }) => (
            <Marker
              key={(selectedPlace === uid) ? shortid.generate() : uid}
              uid={uid}
              latitude={latitude}
              longitude={longitude}
              text={text}
              picture={picture}
              selected={selectedPlace === uid}
              onMarkerPress={this.onMarkerPress}
              prefetched={this.prefetchedPictures[picture]}
              onPrefetched={this.onPrefetched}
            />
          ))}
          {geolocation && geolocation.coords && (
            <MarkerPosition
              latitude={geolocation.coords.latitude}
              longitude={geolocation.coords.longitude}
              onPositionPress={searchNearby}
            />
          )}
        </Map>
        <Animated.View
          style={[
            styles.buttonControls,
            { transform: [{ translateY: panY }] },
          ]}
          pointerEvents="box-none"
        >
          <Button
            fab
            icon="zoom-out-map"
            style={styles.zoomOut}
            onPress={this.onZoomOut}
          />
          <Button
            fab
            icon="my-location"
            onPress={this.onLocationPress}
          />
        </Animated.View>
      </View>
    );
  }
}

const makeMapStateToProps = () => {
  const markersSelector = selectMarkers();

  return state => ({
    selectedPlace: state.home.selectedPlace,
    places: markersSelector(state),
    geolocation: state.home.geolocation,
  });
};

export default connect(makeMapStateToProps, null)(MapWrapper);

const styles = StyleSheet.create({
  buttonControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    padding: 14,
  },
  zoomOut: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
});
