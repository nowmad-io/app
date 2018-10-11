import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../../components/Header';
import Map from '../../components/Map';
import Marker from '../../components/Marker';

class HomeScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    me: PropTypes.object,
    places: PropTypes.object,
    friends: PropTypes.object,
  }

  onActionPress = () => this.props.navigation.openDrawer();

  renderMarker = (place, key) => {
    const { longitude, latitude, reviews } = place;
    const { me, friends } = this.props;
    console.log('reviews', reviews);
    console.log('Object.keys(reviews)[0]', Object.keys(reviews || {})[0]);
    console.log('friends', friends);
    const userKey = Object.keys(reviews || {})[0];
    const user = userKey && friends[userKey] || {};
    let text;
    let picture;

    if (_.size(reviews) <= 1 && user && user.firstName && user.lastName) {
      text = (userKey === me.ui) ? 'me' : `${user.firstName[0]}${user.lastName[0]}`;
      picture = user && user.photoURL;
    } else {
      text = `${_.size(reviews)}`;
    }

    console.log('user', user);
    console.log('text', text);
    console.log('picture', picture);

    return (
      <Marker
        key={key}
        coordinates={{ latitude, longitude }}
        text={text}
        picture={picture}
        selected={false}
      />
    );
  }

  render() {
    const { reviews } = this.props;
    console.log('reviews', reviews);
    return (
      <View style={styles.container}>
        <Header onActionPress={this.onActionPress} />
        <Map
          ref={(m) => { this._map = m; }}
          mapPadding={{
            top: 0,
            bottom: 0,
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  me: state.users.me,
  friends: state.users.friends,
  reviews: state.entities.reviews,
});

export default connect(mapStateToProps, null)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
