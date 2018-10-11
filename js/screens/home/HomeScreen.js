import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import _ from 'lodash';

import Header from '../../components/Header';
import Map from '../../components/Map';
import Text from '../../components/Text';

class HomeScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    places: PropTypes.object,
  }

  onActionPress = () => this.props.navigation.openDrawer();

  render() {
    const { places } = this.props;

    return (
      <View style={styles.container}>
        <Header onActionPress={this.onActionPress} />
        <Map
          ref={(m) => { this._map = m; }}
          mapPadding={{
            top: 0,
            bottom: 0,
          }}
        >
          { _.map(places, ({ longitude, latitude, reviews }, i) => (
            <MapView.Marker
              key={`image${i}`}
              coordinate={{ latitude, longitude }}
              tracksViewChanges={false}
            >
              <Text>{_.size(reviews)}</Text>
              <Image
                style={{
                  height: 30,
                  width: 30,
                }}
                resizeMethod="scale"
                source={{ uri: 'https://picsum.photos/100/100/?image=66' }}
              />
            </MapView.Marker>
          ))}
        </Map>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  places: state.entities.places,
});

export default connect(mapStateToProps, null)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
