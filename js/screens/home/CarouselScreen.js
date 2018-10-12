import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Animated, View, StyleSheet, Share,
} from 'react-native';
import _ from 'lodash';

import Entry from '../../components/Entry';
import EmptyEntry from '../../components/EmptyEntry';
import PanController from '../../components/PanController';

import { selectPlace } from '../../actions/home';
import { selectVisiblePlaces } from '../../reducers/home';

import { sizes, carousel } from '../../constants/parameters';

class CarouselScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    visiblePlaces: PropTypes.array,
    selectedPlace: PropTypes.string,
    panY: PropTypes.object,
    onAddLocationPress: PropTypes.func,
  };

  static defaultProps = {
    panY: new Animated.Value(-carousel.level2),
  }

  constructor(props) {
    super(props);

    this._carousel = React.createRef();
  }

  componentWillReceiveProps({ selectedPlace }) {
    if (selectedPlace && !this.props.selectedPlace !== selectedPlace) {
      const index = selectedPlace
        ? this.props.visiblePlaces.findIndex(d => d.uid === selectedPlace)
        : 0;

      this.goToIndex(index);
    }
  }

  shouldComponentUpdate({ visiblePlaces }) {
    return !_.isEqual(visiblePlaces, this.props.visiblePlaces);
  }

  _onIndexChange = (index) => {
    const { visiblePlaces } = this.props;
    const place = visiblePlaces[index];

    this.props.dispatch(selectPlace(place && place.uid));
  }

  _onLayout = () => {
    const index = this.props.selectedPlace
      ? this.props.visiblePlaces.findIndex(place => place.uid === this.props.selectedPlace) : 0;

    if (index !== -1) {
      this.goToIndex(index);
    } else {
      this.goToIndex(0);
    }
  }

  _onCarouselDidUpdate = () => {
    const { selectedPlace, visiblePlaces } = this.props;
    const index = selectedPlace
      ? visiblePlaces.findIndex(d => d.uid === selectedPlace)
      : -1;

    this._carousel.current.toIndex(index, index < 0, index < 0);
  }

  _onSharePress = () => Share.share({
    message: `Hi!
Join me in Nowmad and lets start sharing the best places for travelling around the world !
See you soon on Nowmad !
https://play.google.com/store/apps/details?id=com.nowmad`,
  });

  goToIndex(index) {
    this._carousel.current.toIndex(index);
  }

  render() {
    const {
      panY, visiblePlaces, onAddLocationPress,
    } = this.props;
    console.log('------visiblePlaces------', visiblePlaces);
    return (
      <PanController
        ref={this._carousel}
        style={styles.carousel}
        horizontal
        lockDirection
        panY={panY}
        onIndexChange={this._onIndexChange}
        onComponentDidUpdate={this._onCarouselDidUpdate}
        snapSpacingX={entryWidth}
      >
        {(!visiblePlaces || !visiblePlaces.length) && (
          <View
            style={styles.entryWrapper}
          >
            <EmptyEntry
              onAddLocationPress={onAddLocationPress}
              onSharePress={this._onSharePress}
            />
          </View>
        )}
        {visiblePlaces && visiblePlaces.map(place => (
          <View
            key={place.uid}
            style={styles.entryWrapper}
          >
            <Entry
              placeId={place.uid}
              navigation={this.props.navigation}
            />
          </View>
        ))}
      </PanController>
    );
  }
}

const makeMapStateToProps = () => {
  const visiblePlacesSelector = selectVisiblePlaces();

  return state => ({
    selectedPlace: state.home.selectedPlace,
    visiblePlaces: visiblePlacesSelector(state),
  });
};

export default connect(makeMapStateToProps)(CarouselScreen);

const entryMargin = 8;
const entryWidth = sizes.width - (entryMargin * 2);

const styles = StyleSheet.create({
  carousel: {
    position: 'absolute',
    top: sizes.height,
    alignItems: 'center',
    paddingLeft: 8,
  },
  buttonWrapper: {
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 14,
    width: sizes.width,
  },
  entryWrapper: {
    width: entryWidth,
    paddingHorizontal: (entryMargin / 2),
  },
});
