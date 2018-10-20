import React, { Component } from 'react';
import {
  StyleSheet, View, ScrollView, BackHandler, TouchableOpacity, Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../components/Header';
import Button from '../components/Button';
import Text from '../components/Text';
import Map from '../components/Map';
import Marker from '../components/Marker';
import Icon from '../components/Icon';
import Review from '../components/Review';

import { colors, sizes } from '../constants/parameters';

import { selectReview } from '../reducers/home';

class ReviewDetailsScreen extends Component {
  static initials({ firstName, lastName }) {
    return (firstName && lastName) ? firstName[0] + lastName[0] : '';
  }

  static propTypes = {
    navigation: PropTypes.object,
    review: PropTypes.object,
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

  onMapReady = () => {
    const { review: { place } } = this.props;

    this._map.animateToCoordinate({
      longitude: place.longitude,
      latitude: place.latitude,
    });
  }

  onAddressLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    this._map.updatePadding({ top: height });
  }

  openUrl = url => () => Linking.openURL(url);

  addOrEditReview = () => {
    const { review } = this.props;

    this.props.navigation.navigate('AddReview', {
      placeId: review.place.uid,
    });
  }

  render() {
    const {
      review: {
        own,
        status,
        shortDescription,
        information,
        pictures,
        categories,
        createdBy,
        place,
        link1,
        link2,
      },
    } = this.props;

    return (
      <View style={styles.container}>
        <Header
          style={styles.header}
          left={(
            <Button
              transparent
              onPress={this.onBackPress}
              icon="close"
              header
            />
          )}
        />
        <ScrollView
          contentContainerStyle={styles.content}
        >
          <View style={styles.infoWrapper}>
            <View>
              <Review
                own={!!own}
                categories={categories || []}
                createdBy={createdBy}
                shortDescription={shortDescription}
                status={status}
                pictures={pictures || []}
                style={styles.review}
                detail
              />
            </View>
            <Text
              style={[
                styles.text,
                styles.information,
              ]}
            >
              {information}
            </Text>
            {!_.isEmpty(link1) && (
              <TouchableOpacity
                onPress={this.openUrl(link1)}
                style={styles.links}
              >
                <Icon name="link" rotate={-40} style={styles.linkIcon} />
                <Text style={styles.text}>
                  {link1}
                </Text>
              </TouchableOpacity>
            )}
            {!_.isEmpty(link1) && (
              <TouchableOpacity
                onPress={this.openUrl(link2)}
                style={[
                  styles.links,
                  styles.link2,
                ]}
              >
                <Icon name="link" rotate={-40} style={styles.linkIcon} />
                <Text
                  style={styles.text}
                >
                  {link2}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.mapWrapper}>
            <Map
              ref={(ref) => { this._map = ref; }}
              onMapReady={this.onMapReady}
            >
              <Marker
                longitude={place.longitude}
                latitude={place.latitude}
                text={ReviewDetailsScreen.initials(createdBy)}
                picture={createdBy.photoURL}
              />
            </Map>
            <View style={styles.addressWrapper} onLayout={this.onAddressLayout}>
              <Icon style={styles.addressIcon} name="location-on" />
              <Text style={styles.addressText}>
                {place.address}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { reviewUid } = props.navigation.state.params;

  return {
    review: selectReview(state)(reviewUid),
  };
};

export default connect(mapStateToProps)(ReviewDetailsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.white,
  },
  actionButton: {
    elevation: 8,
  },
  content: {
    minHeight: sizes.height - sizes.headerHeight,
    backgroundColor: colors.white,
  },
  infoWrapper: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  review: {
    paddingTop: 0,
    marginBottom: 0,
    marginHorizontal: 0,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
  information: {
    marginTop: 12,
  },
  links: {
    flexDirection: 'row',
    marginTop: 22,
  },
  link2: {
    marginTop: 12,
  },
  linkIcon: {
    fontSize: 24,
    color: colors.grey,
    marginRight: 4,
  },
  mapWrapper: {
    height: 178,
  },
  addressWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.whiteTransparent,
  },
  addressIcon: {
    fontSize: 14,
    color: colors.grey,
  },
  addressText: {
    fontSize: 10,
    marginLeft: 8,
  },
});
