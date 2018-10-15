import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { selectPlace } from '../../reducers/entities';

import Review from '../../components/Review';
import ReviewGoogle from '../../components/ReviewGoogle';
import Icon from '../../components/Icon';

import { colors, carousel } from '../../constants/parameters';

class Entry extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
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

  render() {
    const {
      style,
      place: {
        own,
        friends,
        status,
        shortDescription,
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
              own={!!own}
              categories={categories}
              createdBy={_.head(friends)}
              friends={_.tail(friends)}
              shortDescription={shortDescription}
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
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.8}
            onPress={this.onActionPress}
          >
            <Icon
              name={own ? 'edit' : 'playlist-add'}
              style={[
                styles.cta_icon,
                own && styles.cta_edit,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const makeMapStateToProps = () => {
  const placeSelector = selectPlace();

  return (state, props) => ({
    place: props.google ? state.home.poiPlace : placeSelector(state, props.placeUid),
  });
};

export default connect(makeMapStateToProps)(Entry);

const styles = StyleSheet.create({
  card: {
    height: carousel.level2,
    backgroundColor: colors.white,
    position: 'relative',
    borderColor: colors.primary,
    borderTopWidth: carousel.border,
    borderRadius: 2,
    elevation: 3,
  },
  googleCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },
  cta: {
    backgroundColor: colors.yellowTransparent,
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 64,
    width: 64,
    borderTopRightRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
  },
  cta_icon: {
    color: colors.white,
    fontSize: 32,
  },
  cta_edit: {
    fontSize: 28,
  },
});
