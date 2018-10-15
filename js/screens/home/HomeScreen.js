import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { connect } from 'react-redux';

import { setPoiPlace } from '../../actions/home';

import MapWrapper from './MapWrapper';
import SearchBar from './SearchBar';
import Carousel from './Carousel';

import { carousel } from '../../constants/parameters';

class HomeScreen extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      panY: new Animated.Value(-carousel.level2),
    };

    this._searchBar = React.createRef();
  }

  searchNearby = ({ coordinate: { latitude, longitude } }) => this._searchBar.current.searchNearby(`${latitude}, ${longitude}`);

  onPoiPress = name => this._searchBar.current.onChangeText(name || '');

  onClear = () => this.props.dispatch(setPoiPlace());

  render() {
    const { navigation } = this.props;
    const { panY } = this.state;

    return (
      <SearchBar
        ref={this._searchBar}
        navigation={navigation}
        onClear={this.onClear}
      >
        <MapWrapper
          panY={panY}
          searchNearby={this.searchNearby}
          onPoiPress={this.onPoiPress}
        />
        <Carousel panY={panY} navigation={navigation} />
      </SearchBar>
    );
  }
}

export default connect()(HomeScreen);
