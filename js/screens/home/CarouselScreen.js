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
    selectedPlace: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    gPlace: PropTypes.object,
    panY: PropTypes.object,
    onAddLocationPress: PropTypes.func,
  };

  static defaultProps = {
    panY: new Animated.Value(-carousel.level2),
  }

  constructor(props) {
    super(props);

    this.noCarouselUpdate = false;
    this._carousel = React.createRef();
  }

  componentWillReceiveProps({ selectedPlace }) {
    if (selectedPlace && !selectedPlace.noCarouselUpdate
      && !this.props.selectedPlace !== selectedPlace) {
      this.noCarouselUpdate = false;
      const index = selectedPlace
        ? _.compact([this.props.gPlace, ...this.props.visiblePlaces])
          .findIndex(d => d.id === selectedPlace)
        : 0;

      this.goToIndex(index);
    }
  }

  shouldComponentUpdate({ visiblePlaces, gPlace }) {
    return (
      !_.isEqual(visiblePlaces, this.props.visiblePlaces)
      || !_.isEqual(gPlace, this.props.gPlace)
    );
  }

  _onIndexChange = (index) => {
    const { visiblePlaces } = this.props;
    const place = visiblePlaces[index];

    this.noCarouselUpdate = true;
    this.props.dispatch(selectPlace(place && place.uid));
  }

  _onLayout = () => {
    const index = this.props.selectedPlace
      ? this.props.visiblePlaces.findIndex(place => place.id === this.props.selectedPlace) : 0;

    if (index !== -1) {
      this.goToIndex(index);
    } else {
      this.goToIndex(0);
    }
  }

  _onCarouselDidUpdate = () => {
    const { selectedPlace, visiblePlaces, gPlace } = this.props;
    const index = selectedPlace
      ? _.compact([gPlace, ...visiblePlaces]).findIndex(d => d.id === selectedPlace)
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
      panY, visiblePlaces, gPlace, onAddLocationPress,
    } = this.props;

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
        {(!visiblePlaces || !visiblePlaces.length) && !gPlace && (
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
              placeId={place.id}
              navigation={this.props.navigation}
            />
          </View>
        ))}
      </PanController>
    );
  }
}

const bindActions = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  visiblePlaces: selectVisiblePlaces(state),
});

export default connect(mapStateToProps, bindActions)(CarouselScreen);

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
