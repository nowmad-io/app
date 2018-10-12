import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Header from '../../components/Header';
import MapScreen from './MapScreen';
import CarouselScreen from './CarouselScreen';

export default class HomeScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
  }

  onActionPress = () => this.props.navigation.openDrawer();

  render() {
    return (
      <View style={styles.container}>
        <Header onActionPress={this.onActionPress} />
        <MapScreen />
        <CarouselScreen />
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
