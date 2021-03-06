import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { selectPlace } from '../../reducers/home';

import Review from '../../components/Review';
import ReviewGoogle from '../../components/ReviewGoogle';
import Button from '../../components/Button';
import Text from '../../components/Text';

import { colors, carousel } from '../../constants/parameters';

class Entry extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    navigation: PropTypes.object,
    onActionPress: PropTypes.func,
    // eslint-disable-next-line
    placeUid: PropTypes.string,
    place: PropTypes.object,
    google: PropTypes.bool,
  };

  onActionPress = () => {
    const { onActionPress, google, place } = this.props;

    onActionPress({
      reviewId: place.own,
      place: google ? place : place.uid,
    });
  };

  goToDetails = () => {
    const {
      navigation, place,
    } = this.props;

    if (place.reviews.length > 1) {
      navigation.navigate('PlaceDetailsScreen', { placeUid: place.uid });
    } else {
      navigation.navigate('ReviewDetailsScreen', { reviewUid: place.reviews[0].uid });
    }
  }

  render() {
    const {
      style,
      place: {
        own,
        friends,
        status,
        shortDescription,
        information,
        pictures,
        categories,
        name,
        loading,
      },
      google,
    } = this.props;

    return (
      <View style={style}>
        <View
          style={[
            styles.card,
            google && styles.googleCard,
          ]}
        >
          {!google ? (
            <Review
              onPress={this.goToDetails}
              own={!!own}
              categories={categories}
              createdBy={_.head(friends)}
              friends={_.tail(friends)}
              shortDescription={shortDescription}
              information={information}
              status={status}
              pictures={pictures}
              cover
            />
          ) : (
            <ReviewGoogle
              name={name}
              pictures={pictures}
              loading={loading}
            />
          )}
          <Button
            light
            onPress={this.onActionPress}
            style={styles.cta}
          >
            <Text
              uppercase={false}
              style={styles.ctaText}
            >
              {own ? 'Edit' : 'Add Review'}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

const makeMapStateToProps = () => {
  const placeSelector = selectPlace();

  return (state, props) => ({
    place: props.google ? state.home.gPlace : placeSelector(state, props.placeUid),
  });
};

export default connect(makeMapStateToProps)(Entry);

const styles = StyleSheet.create({
  card: {
    height: carousel.height,
    backgroundColor: colors.white,
    position: 'relative',
    elevation: 6,
  },
  googleCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  cta: {
    backgroundColor: colors.transparent,
    borderWidth: 0,
    alignSelf: 'flex-start',
    alignItems: 'center',
    height: 36,
    paddingVertical: 0,
  },
  ctaText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
