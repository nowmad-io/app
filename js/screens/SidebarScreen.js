import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet, View, Share, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import _ from 'lodash';

import { apiLogout } from '../actions/auth';
import { runSagas, stopSagas } from '../actions/utils';

import Icon from '../components/Icon';
import Text from '../components/Text';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

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
    friends: PropTypes.object,
  };

  componentWillMount() {
    this.props.navigation.openDrawer();
    OneSignal.addEventListener('opened', () => this.props.navigation.openDrawer());
  }

  componentDidMount() {
    this.props.dispatch(runSagas());
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened);
    this.props.dispatch(stopSagas());
  }

  onSharePress = () => {
    Share.share({
      message: `Hi!
Join me in Nowmad and lets start sharing the best places for travelling around the world !
See you soon on Nowmad !
https://play.google.com/store/apps/details?id=com.nowmad`,
    });
  }

  navigateToProfile = () => this.props.navigation.navigate('EditProfileScreen');

  onLogoutPress = () => {
    apiLogout(this.props.dispatch)
      .then(() => {
        this.props.navigation.navigate('Auth');
      });
  }

  render() {
    const { me, friends } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.profileWrapper}
          onPress={this.navigateToProfile}
        >
          <View style={styles.info}>
            <Text style={styles.title}>
              {`${me.firstName} ${me.lastName}`}
            </Text>
            <Text
              style={styles.subtitle}
              onPress={this.navigateToFriends}
            >
              {`${_.size(friends)} Friend${_.size(friends) === 1 ? '' : 's'}`}
            </Text>
          </View>
          <View style={styles.avatarWrapper}>
            <Avatar
              uri={me.photoURL}
              text={SidebarScreen.initials(me)}
              size={50}
            />
            <View style={styles.editProfile}>
              <Icon
                style={styles.editProfileIcon}
                name="camera-alt"
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.contentWrapper} />
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
              Logout
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  me: state.auth.me,
  friends: state.friends.all,
});

export default connect(mapStateToProps, null)(SidebarScreen);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  info: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 20,
    ...fonts.medium,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    ...fonts.medium,
    color: colors.primary,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  contentWrapper: {
    paddingTop: 32,
    paddingHorizontal: 20,
    flex: 1,
    width: '100%',
  },
  shareWrapper: {
    width: '100%',
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
    ...fonts.regular,
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
    fontSize: 12,
    ...fonts.light,
  },
});
