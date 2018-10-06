import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';
import MapView from 'react-native-maps';

import Header from '../components/Header';
import Map from '../components/Map';
import Text from '../components/Text';

export default class HomeScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
  }

  onActionPress = () => this.props.navigation.openDrawer();

  render() {
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
          { Array(100).fill().map((_, i) => (
            <MapView.Marker
              key={`image${i}`}
              coordinate={{
                latitude: Math.floor(Math.random() * (2 * 85)) - 85,
                longitude: Math.floor(Math.random() * (2 * 180)) - 180,
              }}
              tracksViewChanges={false}
            >
              <Text>YO</Text>
              <Image
                style={{
                  height: 30,
                  width: 30,
                }}
                resizeMethod="scale"
                source={{ uri: 'https://picsum.photos/100/100/?image=' + i }}
              />
            </MapView.Marker>
          ))}
        </Map>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
