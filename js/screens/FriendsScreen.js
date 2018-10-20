import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, View, ScrollView, BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import Header from '../components/Header';
import Button from '../components/Button';
import Text from '../components/Text';
import Avatar from '../components/Avatar';

import { colors, fonts } from '../constants/parameters';

class FriendsScreen extends Component {
  static initials({ firstName, lastName }) {
    return (firstName && lastName) ? firstName[0] + lastName[0] : '';
  }

  static propTypes = {
    navigation: PropTypes.object,
    friends: PropTypes.object,
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

  render() {
    const { friends } = this.props;

    return (
      <View style={styles.container}>
        <Header
          left={(
            <View style={styles.row}>
              <Button transparent onPress={this.onBackPress} icon="arrow-back" header />
              <Text style={styles.headerText}>Friends</Text>
            </View>
          )}
        />
        <ScrollView style={styles.scrollView}>
          {_.map(friends, friend => (
            <View
              key={friend.uid}
              style={styles.row}
            >
              <Avatar
                uri={friend.photoURL}
                text={FriendsScreen.initials(friend)}
                size={36}
              />
              <Text style={styles.friendText}>
                {`${friend.firstName} ${friend.lastName}`}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  friends: state.friends.all,
});

export default connect(mapStateToProps)(FriendsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 4,
    ...fonts.medium,
    color: colors.white,
  },
  scrollView: {
    padding: 16,
  },
  friendText: {
    marginLeft: 10,
  },
});
