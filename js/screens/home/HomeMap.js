import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import _ from 'lodash';

import { regionChanged, selectPlace } from '../../actions/home';

import { selectMarkers } from '../../reducers/entities';

import Map from '../../components/Map';
import Marker from '../../components/Marker';

import { carousel } from '../../constants/parameters';

class HomeMap extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    places: PropTypes.array,
    selectedPlace: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.prefetchedPictures = {};
  }

  onPrefetched = (picture) => {
    this.prefetchedPictures[picture] = true;
  };

  onMarkerPress = uid => this.props.dispatch(selectPlace(uid));

  onRegionChange = region => this.props.dispatch(regionChanged(region));

  onMapReady = () => this.props.dispatch(regionChanged());

  render() {
    const {
      places, selectedPlace,
    } = this.props;

    return (
      <Map
        onRegionChangeComplete={this.onRegionChange}
        mapPadding={{ bottom: carousel.level2 }}
        onMapReady={this.onMapReady}
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
      </Map>
    );
  }
}

const makeMapStateToProps = () => {
  const markersSelector = selectMarkers();

  return state => ({
    selectedPlace: state.home.selectedPlace,
    places: markersSelector(state),
  });
};

export default connect(makeMapStateToProps, null)(HomeMap);
