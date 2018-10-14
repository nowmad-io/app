import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

import MapWrapper from './MapWrapper';
import SearchBar from './SearchBar';
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

  render() {
    const { navigation } = this.props;
    const { panY } = this.state;

    return (
      <SearchBar navigation={navigation}>
        <MapWrapper panY={panY} />
        <Carousel panY={panY} navigation={navigation} />
      </SearchBar>
    );
  }
}
