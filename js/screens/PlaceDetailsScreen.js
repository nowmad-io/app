import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet, BackHandler, View, ScrollView,
} from 'react-native';

import Header from '../components/Header';
import Review from '../components/Review';
import Button from '../components/Button';

import { selectPlaceReviews } from '../reducers/home';

import { colors } from '../constants/parameters';

class PlaceDetailsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    reviews: PropTypes.array,
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    this.props.navigation.goBack();
    return true;
  }

  goToDetails = reviewUid => () => {
    this.props.navigation.navigate('ReviewDetailsScreen', { reviewUid });
  }

  render() {
    const { reviews } = this.props;

    return (
      <View style={styles.container}>
        <Header left={<Button transparent onPress={this.onBackPress} icon="arrow-back" header />} />
        <ScrollView contentContainerStyle={styles.scrollView}>
          {reviews.map(({
            uid, own, status, shortDescription, pictures, categories, createdBy,
          }) => (
            <View
              key={uid}
              style={styles.review}
            >
              <Review
                own={!!own}
                categories={categories}
                createdBy={createdBy}
                shortDescription={shortDescription}
                status={status}
                pictures={pictures || []}
                onPress={this.goToDetails(uid)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const makeMapStateToProps = () => {
  const placeSelector = selectPlaceReviews();

  const mapStateToProps = (state, props) => {
    const { placeUid } = props.navigation.state.params;

    return {
      reviews: placeSelector(state, placeUid),
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(PlaceDetailsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 4,
  },
  actionButton: {
    elevation: 8,
  },
  review: {
    flex: 0,
    minHeight: 164,
    marginVertical: 4,
    marginHorizontal: 8,
    borderColor: colors.transparent,
    backgroundColor: colors.white,
    elevation: 2,
  },
});
