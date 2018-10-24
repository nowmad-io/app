import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from 'react-redux';
import shortid from 'shortid';
import _ from 'lodash';

import {
  regionChanged, selectPlace, getGeolocation, setGPlace,
} from '../../actions/home';

import { poiToPlace, placeDetails } from '../../actions/search';

import { selectMarkers } from '../../reducers/home';

import Map from '../../components/Map';
import Marker from '../../components/Marker';
import Button from '../../components/Button';
import MarkerPosition from '../../components/MarkerPosition';

import { carousel, sizes } from '../../constants/parameters';

const INITIAL_PADDING = {
  top: sizes.headerHeight + sizes.searchBarPadding,
  bottom: carousel.height,
};

class MapWrapper extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    onRef: PropTypes.func,
    searchNearby: PropTypes.func,
    onPoiPress: PropTypes.func,
    filters: PropTypes.object,
    gPlace: PropTypes.object,
    geolocation: PropTypes.object,
    places: PropTypes.array,
    selectedPlace: PropTypes.string,
    panY: PropTypes.object,
  }

  static defaultProps = {
    onRef: () => true,
    panY: new Animated.Value(0),
  }

  constructor(props) {
    super(props);

    this._map = React.createRef();
  }

  componentWillReceiveProps({
    filters, geolocation, places, gPlace,
  }) {
    if (geolocation && geolocation.coords
        && !geolocation.loading && this.props.geolocation.loading) {
      this._map.current.getRef().animateToRegion({
        ...geolocation.coords,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
      }, 1000);
    }

    if (filters.friend && places.length && places.length !== this.props.places.length) {
      this._map.current.getRef().fitToCoordinates(places);
    }

    if (gPlace && (!this.props.gPlace || gPlace.uid !== this.props.gPlace.uid)) {
      this._map.current.getRef().animateToCoordinate(gPlace);
    }

    if (!gPlace && this.props.gPlace) {
      this.props.onPoiPress();
    }
  }

  onRef = (ref) => {
    this._map.current = ref;
    this.props.onRef(ref);
  }

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

  onPoiPress = (poi) => {
    const gPlace = poiToPlace(poi);

    this.props.dispatch(setGPlace(gPlace, true));
    this.props.onPoiPress(gPlace.name);

    placeDetails(gPlace.placeId, gPlace.name)
      .then((place) => {
        this.props.dispatch(setGPlace(place));
      });
  }

  onMapPress = () => {
    if (this.props.gPlace) {
      this.props.dispatch(setGPlace());
      this.props.onPoiPress();
    }
  }

  render() {
    const {
      geolocation, places, selectedPlace, panY, searchNearby, gPlace,
    } = this.props;

    return (
      <View style={styles.container}>
        <Map
          ref={this.onRef}
          onRegionChangeComplete={this.onRegionChange}
          mapPadding={INITIAL_PADDING}
          onMapReady={this.onMapReady}
          onLongPress={searchNearby}
          onPoiClick={this.onPoiPress}
          onPress={this.onMapPress}
        >
          {gPlace && (
            <Marker
              uid={gPlace.uid}
              latitude={gPlace.latitude}
              longitude={gPlace.longitude}
              selected={selectedPlace === gPlace.uid}
              onMarkerPress={this.onMarkerPress}
              google
            />
          )}
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
    gPlace: state.home.gPlace,
    filters: state.home.filters,
  });
};

export default connect(makeMapStateToProps, null)(MapWrapper);

const styles = StyleSheet.create({
  container: {
    height: sizes.height,
  },
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
