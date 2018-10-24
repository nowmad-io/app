import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, View, ScrollView, BackHandler, TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { DrawerActions } from 'react-navigation';
import _ from 'lodash';

import { filtersChange } from '../actions/home';

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
    dispatch: PropTypes.func,
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

  onFriendPress = friend => () => {
    this.props.dispatch(filtersChange({ friend }));
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this.onBackPress();
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
            <TouchableHighlight
              key={friend.uid}
              underlayColor={colors.primaryShadowLight}
              onPress={this.onFriendPress(friend)}
            >
              <View style={styles.row}>
                <Avatar
                  uri={friend.photoURL}
                  text={FriendsScreen.initials(friend)}
                  size={36}
                />
                <Text style={styles.friendText}>
                  {`${friend.firstName} ${friend.lastName}`}
                </Text>
              </View>
            </TouchableHighlight>
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
  headerText: {
    marginLeft: 4,
    ...fonts.medium,
    color: colors.white,
  },
  scrollView: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  friendText: {
    marginLeft: 10,
  },
});
