import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { uploadProfilePicture } from '../../actions/auth';

import Text from '../../components/Text';
import Button from '../../components/Button';
import ProfilePicker from '../../components/ProfilePicker';

import { colors, fonts } from '../../constants/parameters';

class Profile extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { firstName, lastName } = props.navigation.state.params;

    this.state = {
      picture: null,
      firstName,
      lastName,
    };
  }

  onUpdateProfilePress = () => {
    const { firstName, lastName, picture } = this.state;

    this.props.dispatch(uploadProfilePicture({
      firstName,
      lastName,
      picture,
    }));
    this.onSkipButton();
  }

  onPictureSelected = picture => this.setState({ picture });

  onSkipButton = () => this.props.navigation.navigate('App');

  render() {
    const { picture } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.pictureWrapper}>
          <Text style={styles.title}>
            Choose your
          </Text>
          <Text style={styles.title}>
            profile picture
          </Text>
          <ProfilePicker
            style={styles.profilePicker}
            uri={picture}
            onPictureSelected={this.onPictureSelected}
          />
        </View>

        <View style={styles.actionWrapper}>
          <Button
            light
            disabled={!picture}
            onPress={this.onUpdateProfilePress}
          >
            <Text style={styles.mainText}>Enter to Nowmad</Text>
          </Button>

          <Button
            trasnparent
            onPress={this.onSkipButton}
            style={styles.skipButton}
          >
            <Text style={styles.skipText} uppercase={false}>Skip</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = () => ({
  isConnected: true,
});

export default connect(mapStateToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingBottom: 100,
    backgroundColor: colors.primary,
  },
  skipButton: {
    marginTop: 16,
  },
  skipText: {
    color: colors.whiteTransparent,
  },
  actionWrapper: {
    marginHorizontal: 24,
  },
  mainText: {
    color: colors.black,
  },
  title: {
    color: colors.white,
    marginHorizontal: 80,
    fontSize: 24,
    lineHeight: 34,
    fontWeight: fonts.fontWeight.medium,
    textAlign: 'center',
  },
  pictureWrapper: {
    marginTop: 24,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profilePicker: {
    marginTop: 48,
  },
});
