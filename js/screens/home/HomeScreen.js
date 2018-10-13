import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Header from '../../components/Header';
import Button from '../../components/Button';
import HomeMap from './HomeMap';
import Carousel from './Carousel';

export default class HomeScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
  }

  onMenuPress = () => this.props.navigation.openDrawer();

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Header
          right={(
            <Button
              header
              transparent
              onPress={this.onMenuPress}
              icon="menu"
            />
          )}
        />
        <HomeMap />
        <Carousel navigation={navigation} />
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
