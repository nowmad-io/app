import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Animated, View } from 'react-native';

import Header from '../../components/Header';
import Button from '../../components/Button';
import HomeMap from './HomeMap';
import Carousel from './Carousel';

import { carousel } from '../../constants/parameters';

export default class HomeScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      panY: new Animated.Value(-carousel.level2),
    };
  }

  onMenuPress = () => this.props.navigation.openDrawer();

  render() {
    const { navigation } = this.props;
    const { panY } = this.state;

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
        <HomeMap panY={panY} />
        <Carousel panY={panY} navigation={navigation} />
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
