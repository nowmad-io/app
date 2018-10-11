import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { selectPlaces } from '../../reducers/entities';

import Header from '../../components/Header';
import Map from '../../components/Map';
import Marker from '../../components/Marker';

class HomeScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    places: PropTypes.array,
  }

  onActionPress = () => this.props.navigation.openDrawer();

  renderMarker = places => _.map(places, ({
    uid, latitude, longitude, text, picture,
  }) => (
    <Marker
      key={uid}
      latitude={latitude}
      longitude={longitude}
      text={text}
      picture={picture}
      selected={false}
    />
  ));

  render() {
    const { places } = this.props;
    console.count('homeScreen');
    return (
      <View style={styles.container}>
        <Header onActionPress={this.onActionPress} />
        <Map>
          {this.renderMarker(places)}
        </Map>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  places: selectPlaces(state),
});

export default connect(mapStateToProps, null)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
