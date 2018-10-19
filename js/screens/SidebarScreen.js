import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, View, Share, TouchableOpacity, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { apiLogout } from '../actions/auth';
import {
  sendNotification,
  apiAcceptRequest,
  apiRejectRequest,
} from '../actions/friends';

import Icon from '../components/Icon';
import Text from '../components/Text';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Accordion from '../components/Accordion';

import { colors, fonts } from '../constants/parameters';

class SidebarScreen extends React.Component {
  static initials({ firstName, lastName }) {
    return (firstName && lastName) ? firstName[0] + lastName[0] : '';
  }

  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    me: PropTypes.object,
    friendsCount: PropTypes.number,
    incomings: PropTypes.object,
  };

  onSharePress = () => {
    Share.share({
      message: `Hi!
Join me in Nowmad and lets start sharing the best places for travelling around the world !
See you soon on Nowmad !
https://play.google.com/store/apps/details?id=com.nowmad`,
    });
  }

  navigateToProfile = () => this.props.navigation.navigate('EditProfileScreen');

  navigateToFriends = () => this.props.navigation.navigate('FriendsScreen');

  onLogoutPress = () => {
    apiLogout(this.props.dispatch)
      .then(() => {
        this.props.navigation.navigate('Auth');
      });
  }

  acceptFriendRequest = (uid, senderId) => () => {
    apiAcceptRequest(uid);
    this.props.dispatch(sendNotification(senderId, 'acceptFriendRequest'));
  };

  rejectFriendRequest = uid => () => apiRejectRequest(uid);

  renderIncomingRequest = request => (
    <View
      key={request.uid}
      style={[
        styles.notification,
        !request.seen && styles.notificationUnseen,
      ]}
    >
      <Avatar
        uri={request.photoURL}
        text={SidebarScreen.initials(request)}
        size={36}
      />
      <View style={styles.notificationTextWrapper}>
        <Text style={styles.notificationText}>
          <Text
            style={[
              styles.notificationText,
              styles.notificationTextPrimary,
            ]}
          >
            {`${request.firstName} ${request.lastName} `}
          </Text>
          sent you a Friend Request.
        </Text>
      </View>
      <View style={styles.notificationActions}>
        <Button
          transparent
          icon="close"
          style={styles.requestButton}
          iconStyle={styles.requestIcon}
          onPress={this.rejectFriendRequest(request.uid)}
        />
        <Button
          transparent
          icon="check"
          style={styles.requestButton}
          iconStyle={styles.requestIcon}
          onPress={this.acceptFriendRequest(request.uid, request.senderId)}
        />
      </View>
    </View>
  );

  render() {
    const {
      me, friendsCount, incomings,
    } = this.props;

    return (
      <View style={styles.container}>
        <View
          activeOpacity={0.6}
          style={styles.profileWrapper}
        >
          <View style={styles.infoWrapper}>
            <View style={styles.info}>
              <Text style={styles.title} onPress={this.navigateToProfile}>
                {`${me.firstName} ${me.lastName}`}
              </Text>
              <Text
                style={styles.subtitle}
                onPress={this.navigateToFriends}
              >
                {`${friendsCount} Friend${friendsCount === 1 ? '' : 's'}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.avatarWrapper} onPress={this.navigateToProfile}>
            <Avatar
              uri={me.photoURL}
              text={SidebarScreen.initials(me)}
              size={56}
            />
            <View style={styles.editProfile}>
              <Icon
                style={styles.editProfileIcon}
                name="camera-alt"
              />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.contentWrapper}>
          <Accordion label="Pending friend requests" style={styles.accordion}>
            {_.map(incomings, this.renderIncomingRequest)}
          </Accordion>
        </ScrollView>
        <View style={styles.shareWrapper}>
          <Button
            transparent
            onPress={this.onSharePress}
          >
            <Text style={styles.shareText} transparent uppercase={false}>
              Invite friends to Nowmad
            </Text>
          </Button>
        </View>
        <View style={styles.footer}>
          <Button
            transparent
            style={styles.footerButton}
            onPress={this.onLogoutPress}
          >
            <Icon name="exit-to-app" style={styles.footerIcon} />
            <Text
              style={styles.footerLabel}
              uppercase={false}
            >
              Log out
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  me: state.auth.me,
  friendsCount: _.size(state.friends.all),
  incomings: state.friends.incomings,
});

export default connect(mapStateToProps, null)(SidebarScreen);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  profileWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.grey,
    borderBottomWidth: 0.5,
  },
  infoWrapper: {
    flex: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    ...fonts.medium,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 20,
    ...fonts.medium,
    color: colors.primary,
    paddingTop: 4,
    alignSelf: 'flex-start',
  },
  contentWrapper: {
    paddingVertical: 16,
    flex: 1,
  },
  accordion: {
    paddingHorizontal: 16,
  },
  notification: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationUnseen: {
    backgroundColor: colors.primaryShadowLight,
  },
  notificationTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 18,
  },
  notificationTextPrimary: {
    color: colors.primary,
  },
  notificationActions: {
    flexDirection: 'row',
  },
  requestButton: {
    height: 20,
    width: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 50,
    backgroundColor: colors.white,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestIcon: {
    color: colors.primary,
    fontSize: 14,
  },
  shareWrapper: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderColor: colors.grey,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfile: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: -4,
    left: -4,
    borderWidth: 0,
    elevation: 0,
    height: 25,
    width: 25,
    paddingHorizontal: 0,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileIcon: {
    fontSize: 15,
    color: colors.primary,
  },
  shareText: {
    color: colors.primary,
    ...fonts.medium,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.primary,
    paddingRight: 4,
    paddingLeft: 20,
  },
  footerButton: {
    alignSelf: 'flex-end',
  },
  footerIcon: {
    marginRight: 8,
    fontSize: 26,
  },
  footerLabel: {
    ...fonts.medium,
  },
});
