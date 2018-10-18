import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import Dispatch from '../../libs/dispatch';

import { setGPlace } from '../../actions/home';
import { runSagas, stopSagas } from '../../actions/utils';

import MapWrapper from './MapWrapper';
import SearchBar from './SearchBar';
import Carousel from './Carousel';

import { carousel } from '../../constants/parameters';

class HomeScreen extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    places: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      panY: new Animated.Value(-carousel.level2),
    };

    this._map = React.createRef();
    this._searchBar = React.createRef();
  }

  componentWillMount() {
    this.props.navigation.openDrawer();
    OneSignal.addEventListener('opened', this.onNitificationOpened);
    Dispatch.initialize(this.props.dispatch);
  }

  componentDidMount() {
    this.props.dispatch(runSagas());
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
    this.props.dispatch(stopSagas());
  }

  onNitificationOpened = () => {
    Keyboard.dismiss();
    this.props.navigation.openDrawer();
    this._searchBar.current.blur();
  }

  searchNearby = ({ coordinate: { latitude, longitude } }) => this._searchBar.current.searchNearby(`${latitude}, ${longitude}`);

  onGPlacePress = (place) => {
    if (this.props.places[place.uid]) {
      this._map.current.getRef().animateToCoordinate(place);
    } else {
      this.onGplace(place.name);
      this.props.dispatch(setGPlace(place));
    }
  };

  onGplace = name => this._searchBar.current.onChangeText(name || '');

  onClear = () => this.props.dispatch(setGPlace());

  render() {
    const { navigation } = this.props;
    const { panY } = this.state;

    return (
      <SearchBar
        ref={this._searchBar}
        navigation={navigation}
        onClear={this.onClear}
        onGPlacePress={this.onGPlacePress}
      >
        <MapWrapper
          onRef={(ref) => { this._map.current = ref; }}
          panY={panY}
          searchNearby={this.searchNearby}
          onPoiPress={this.onGplace}
        />
        <Carousel panY={panY} navigation={navigation} />
      </SearchBar>
    );
  }
}


const makeMapStateToProps = state => ({
  places: state.entities.places,
});

export default connect(makeMapStateToProps)(HomeScreen);
