import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Animated, View, StyleSheet, Share,
} from 'react-native';
import _ from 'lodash';

import Entry from './Entry';
import PanController from '../../components/PanController';
import EmptyEntry from '../../components/EmptyEntry';

import { selectPlace } from '../../actions/home';
import { selectVisiblePlaces } from '../../reducers/home';

import { sizes } from '../../constants/parameters';

class CarouselScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    visiblePlaces: PropTypes.array,
    selectedPlace: PropTypes.string,
    poiPlace: PropTypes.object,
    panY: PropTypes.object,
  };

  static defaultProps = {
    panY: new Animated.Value(0),
  }

  constructor(props) {
    super(props);

    this._carousel = React.createRef();
  }

  componentWillReceiveProps({ selectedPlace: nextSelectedPlace }) {
    const { selectedPlace, poiPlace, visiblePlaces } = this.props;

    if (nextSelectedPlace && !selectedPlace !== nextSelectedPlace) {
      const index = nextSelectedPlace
        ? [...[poiPlace || []], ...visiblePlaces].findIndex(d => d.uid === nextSelectedPlace)
        : 0;

      this.goToIndex(index);
    }
  }

  shouldComponentUpdate({ visiblePlaces, poiPlace }) {
    return (
      !_.isEqual(visiblePlaces, this.props.visiblePlaces)
      || !_.isEqual(poiPlace, this.props.poiPlace)
    );
  }

  onIndexChange = (index) => {
    const { visiblePlaces, poiPlace } = this.props;
    const place = [...[poiPlace || []], ...visiblePlaces][index];

    this.props.dispatch(selectPlace(place && place.uid));
  }

  onCarouselDidUpdate = () => {
    const { selectedPlace, visiblePlaces, poiPlace } = this.props;
    const index = selectedPlace
      ? [...[poiPlace || []], ...visiblePlaces].findIndex(d => d.uid === selectedPlace)
      : -1;

    this._carousel.current.toIndex(index, index < 0, index < 0);
  }

  onSharePress = () => Share.share({
    message: `Hi!
Join me in Nowmad and lets start sharing the best places for travelling around the world !
See you soon on Nowmad !
https://play.google.com/store/apps/details?id=com.nowmad`,
  });

  onActionPress = reviewPlace => this.props.navigation.navigate('AddReviewScreen', reviewPlace);

  goToIndex(index) {
    this._carousel.current.toIndex(index);
  }

  render() {
    const { panY, visiblePlaces, poiPlace } = this.props;

    return (
      <PanController
        ref={this._carousel}
        style={styles.carousel}
        horizontal
        lockDirection
        panY={panY}
        onIndexChange={this.onIndexChange}
        onComponentDidUpdate={this.onCarouselDidUpdate}
        snapSpacingX={entryWidth}
      >
        {!visiblePlaces.length && !poiPlace && (
          <View
            style={styles.entryWrapper}
          >
            <EmptyEntry
              onAddLocationPress={this.onAddLocationPress}
              onSharePress={this.onSharePress}
            />
          </View>
        )}
        {poiPlace && (
          <Entry
            key={poiPlace.uid}
            placeUid={poiPlace.uid}
            style={styles.entryWrapper}
            onActionPress={this.onActionPress}
            google
          />
        )}
        {visiblePlaces && visiblePlaces.map(({ uid }) => (
          <Entry
            key={uid}
            placeUid={uid}
            style={styles.entryWrapper}
            onActionPress={this.onActionPress}
          />
        ))}
      </PanController>
    );
  }
}

const makeMapStateToProps = () => {
  const visiblePlacesSelector = selectVisiblePlaces();

  return state => ({
    selectedPlace: state.home.selectedPlace,
    poiPlace: state.home.poiPlace,
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
