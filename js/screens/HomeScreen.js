import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Header from '../components/Header';
import Map from '../components/Map';

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
        />
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
