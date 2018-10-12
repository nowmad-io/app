import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { selectPlace } from '../../reducers/entities';

import Review from '../../components/Review';
import Icon from '../../components/Icon';

import { colors, carousel } from '../../constants/parameters';

class Entry extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    // eslint-disable-next-line
    placeUid: PropTypes.string,
    place: PropTypes.object,
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
      },
    } = this.props;

    return (
      <View style={style}>
        <View style={styles.card}>
          <Review
            own={!!own}
            categories={categories}
            createdBy={_.head(friends)}
            friends={_.tail(friends)}
            shortDescription={shortDescription}
            status={status}
            pictures={pictures}
          />
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.8}
            onPress={this.addOrEditReview}
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
    place: placeSelector(state, props.placeUid),
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
