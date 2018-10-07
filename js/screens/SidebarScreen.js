import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Share } from 'react-native';
import { connect } from 'react-redux';

import { apiLogout } from '../actions/users';
import { runSagas, stopSagas } from '../actions/utils';

import Icon from '../components/Icon';
import Text from '../components/Text';
import Button from '../components/Button';

import { colors, fonts } from '../constants/parameters';

class SidebarScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  static initials({ first_name: firstName, last_name: lastName }) {
    if (!firstName && !lastName) {
      return '';
    }
    return `${firstName[0]}${lastName[0]}`;
  }

  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    me: PropTypes.object,
  };

  componentDidMount() {
    this.props.dispatch(runSagas());
  }

  componentWillUnmount() {
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

  onLogoutPress = () => {
    apiLogout(this.props.dispatch)
      .then(() => {
        this.props.navigation.navigate('Auth');
      });
  }

  render() {
    const { me } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={styles.profileWrapper}
        >
          <View style={styles.info}>
            <Text style={styles.title}>
              {me.displayName}
            </Text>
          </View>
        </View>
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
  me: state.users.me ? state.users.all[state.users.me] : {},
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
    marginHorizontal: 20,
    marginTop: 16,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.grey,
    borderBottomWidth: 0.5,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: 26,
    marginBottom: 8,
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
  shareText: {
    color: colors.primary,
    fontWeight: fonts.fontWeight.regular,
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
    lineHeight: 14,
    fontWeight: fonts.fontWeight.light,
  },
});
