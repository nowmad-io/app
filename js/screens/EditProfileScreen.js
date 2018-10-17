import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Header from '../components/Header';
import Text from '../components/Text';
import Button from '../components/Button';
import ProfilePicker from '../components/ProfilePicker';
import Spinner from '../components/Spinner';
import FormInput from '../components/FormInput';

import { updateProfile } from '../actions/auth';

import { colors, fonts, sizes } from '../constants/parameters';

class EditProfileScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    me: PropTypes.object,
    authLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const { me } = props;

    this.state = {
      firstName: me.firstName || '',
      lastName: me.lastName || '',
      photoURL: me.photoURL || null,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillReceiveProps({ me }) {
    this.setState({
      firstName: me.first_name || '',
      lastName: me.last_name || '',
      photoURL: me.photoURL || null,
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { navigation } = this.props;

    navigation.goBack();

    return true;
  }

  onPictureSelected = photoURL => this.setState({ photoURL });

  onSavePress = () => {
    this.props.dispatch(updateProfile({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      photoURL: this.state.photoURL,
    }));

    this.onBackPress();
  };

  render() {
    const { navigation, me } = this.props;
    const { firstName, lastName, photoURL } = this.state;

    const valid = ((firstName !== me.first_name) && !!firstName)
      || ((lastName !== me.last_name) && !!lastName)
      || (photoURL !== me.photoURL);

    return (
      <Content>
        <View style={styles.container}>
          <Header
            left={(
              <Button transparent onPress={() => navigation.goBack()} icon="arrow-back" header />
            )}
          />
          <View style={styles.pictureWrapper}>
            <Text style={styles.title}>
              Edit your
            </Text>
            <Text style={styles.title}>
              profile information
            </Text>
            <ProfilePicker
              style={styles.profilePicker}
              uri={photoURL}
              onPictureSelected={this.onPictureSelected}
            />
          </View>
          <View style={styles.formWrapper}>
            <FormInput
              style={styles.formField}
              inputStyle={styles.formFieldInput}
              suffixIconStyle={styles.suffixIconStyle}
              underlineColor={colors.white}
              selectionColor={colors.white}
              placeholderColor={colors.primaryLight}
              defaultValue={firstName}
              placeholder="First name"
              onChangeText={text => this.setState({ firstName: text })}
              suffixIcon="edit"
            />
            <FormInput
              style={styles.formField}
              inputStyle={styles.formFieldInput}
              suffixIconStyle={styles.suffixIconStyle}
              underlineColor={colors.white}
              selectionColor={colors.white}
              placeholderColor={colors.primaryLight}
              defaultValue={lastName}
              placeholder="Last name"
              onChangeText={text => this.setState({ lastName: text })}
              suffixIcon="edit"
            />
          </View>
          <View style={styles.actionWrapper}>
            <Button
              light
              disabled={!valid}
              onPress={this.onSavePress}
            >
              <Text style={styles.mainText}>Save changes</Text>
            </Button>
          </View>
          <Spinner overlay visible={this.props.authLoading} />
        </View>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  me: state.auth.me,
  authLoading: state.auth.authLoading,
});

export default connect(mapStateToProps)(EditProfileScreen);

const styles = StyleSheet.create({
  container: {
    height: sizes.height,
    flex: 1,
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.white,
    marginHorizontal: 80,
    fontSize: 24,
    ...fonts.medium,
    textAlign: 'center',
  },
  pictureWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  formWrapper: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  profilePicker: {
    marginTop: 48,
  },
  formField: {
    marginBottom: 22,
  },
  formFieldInput: {
    marginVertical: 2,
    color: colors.white,
    ...fonts.medium,
  },
  actionWrapper: {
    paddingBottom: 52,
    paddingHorizontal: 24,
  },
  suffixIconStyle: {
    color: colors.whiteTransparent,
  },
  mainText: {
    color: colors.black,
  },
});
