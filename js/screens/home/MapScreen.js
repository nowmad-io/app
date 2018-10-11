import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import _ from 'lodash';

import { selectPlaces } from '../../reducers/entities';

import Map from '../../components/Map';
import Marker from '../../components/Marker';

class MapScreen extends React.PureComponent {
  static propTypes = {
    places: PropTypes.array,
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedPlace: null,
    };

    this.prefetchedPictures = {};
  }

  onMarkerPress = uid => () => this.setState({ selectedPlace: uid });

  onPrefetched = picture => () => {
    this.prefetchedPictures[picture] = true;
  };

  renderMarker = places => _.map(places, ({
    uid, latitude, longitude, text, picture,
  }) => (
    <Marker
      key={shortid.generate()}
      latitude={latitude}
      longitude={longitude}
      text={text}
      picture={picture}
      selected={this.state.selectedPlace === uid}
      onMarkerPress={this.onMarkerPress(uid)}
      prefetched={this.prefetchedPictures[picture]}
      onPrefetched={this.onPrefetched(picture)}
    />
  ));

  render() {
    const { places } = this.props;

    return (
      <Map>
        {this.renderMarker(places)}
      </Map>
    );
  }
}

const mapStateToProps = state => ({
  places: selectPlaces(state),
});

export default connect(mapStateToProps, null)(MapScreen);
