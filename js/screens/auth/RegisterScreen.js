import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';

import Api from '../../libs/requests';

import Content from '../../components/Content';
import Text from '../../components/Text';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

import { apiRegister, authenticate } from '../../actions/auth';

import { registerFailed, registerNoNetwork } from '../../modals';
import { colors, fonts, sizes } from '../../constants/parameters';

const logo = require('../../../assets/images/logos/logo_white.png');

class RegisterScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    token: PropTypes.string,
    isConnected: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      email: params && params.email || 'j@j.com',
      password: 'j',
      firstName: 'julien',
      lastName: 'rougeron',
      loading: false,
      error: null,
    };

    this._passwordField = React.createRef();

    if (props.token) {
      Api.setAuthorisation(props.token);
      props.navigation.navigate('App');
    }
  }

  registerPress = () => {
    const {
      email, password, firstName, lastName,
    } = this.state;
    const { navigation, dispatch, isConnected } = this.props;

    if (!isConnected) {
      this.setState({ error: registerNoNetwork });
      return;
    }

    this.setState({ loading: true });

    apiRegister({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    }).then(({ auth_token: authToken }) => {
      dispatch(authenticate(authToken));
      navigation.navigate('ProfileScreen');
      this.setState({ loading: false });
    }).catch(() => {
      this.setState({
        loading: false,
        error: registerFailed,
      });
    });
  }

  loginPress = () => {
    const { email } = this.state;

    this.setState(
      { error: null },
      () => {
        this.props.navigation.navigate('LoginScreen', {
          email,
          setEmail: this.setEmail,
        });
      },
    );
  }

  setEmail = (email) => {
    this.setState({ email });
  }

  closeModal = () => this.setState({ error: null });

  render() {
    const {
      email, password, firstName, lastName, loading, error,
    } = this.state;

    const valid = email && password && firstName.replace(/\s/g, '') && lastName.replace(/\s/g, '');

    return (
      <Content>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={logo}
              style={styles.logo}
            />
            <View>
              <Text style={styles.text}>
                Welcome to
              </Text>
              <Text style={[styles.text, styles.name]}>
                nowmad
              </Text>
            </View>
          </View>
          <View style={styles.formWrapper}>
            <FormInput
              style={styles.formField}
              inputStyle={styles.formFieldInput}
              underlineColor={colors.white}
              selectionColor={colors.white}
              placeholderColor={colors.primaryLight}
              placeholder="First name"
              onChangeText={text => this.setState({ firstName: text })}
            />
            <FormInput
              style={styles.formField}
              inputStyle={styles.formFieldInput}
              underlineColor={colors.white}
              selectionColor={colors.white}
              placeholderColor={colors.primaryLight}
              placeholder="Last name"
              onChangeText={text => this.setState({ lastName: text })}
            />
            <FormInput
              style={styles.formField}
              inputStyle={styles.formFieldInput}
              underlineColor={colors.white}
              selectionColor={colors.white}
              placeholderColor={colors.primaryLight}
              defaultValue={email}
              autoCapitalize="none"
              placeholder="Email"
              onChangeText={text => this.setState({ email: text })}
            />
            <FormInput
              ref={this._passwordField}
              password
              style={styles.formField}
              inputStyle={styles.formFieldInput}
              showPasswordStyle={styles.showPasswordStyle}
              underlineColor={colors.white}
              selectionColor={colors.white}
              placeholderColor={colors.primaryLight}
              defaultValue={password}
              autoCapitalize="none"
              placeholder="Password"
              onChangeText={text => this.setState({ password: text })}
            />
          </View>

          <View style={styles.actionsWrapper}>
            <Button
              disabled={!valid}
              light
              onPress={this.registerPress}
            >
              <Text style={styles.mainText}>Create an account</Text>
            </Button>
            <Button
              style={styles.loginButton}
              onPress={this.loginPress}
            >
              <Text>Log in</Text>
            </Button>
          </View>
          <Spinner overlay visible={loading} />
        </View>
        <Modal
          {...(error || {})}
          visible={!!error}
          onRequestClose={this.closeModal}
          onPrimaryAction={this.closeModal}
          onSecondaryAction={this.loginPress}
        />
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  isConnected: true,
});

export default connect(mapStateToProps)(RegisterScreen);

const styles = StyleSheet.create({
  container: {
    height: sizes.height,
    flex: 1,
    paddingTop: 48,
    paddingBottom: 52,
    backgroundColor: colors.primary,
  },
  logoWrapper: {
    paddingLeft: 52,
    paddingRight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  text: {
    color: colors.white,
    fontSize: 24,
    fontWeight: fonts.fontWeight.medium,
    lineHeight: 34,
  },
  name: {
    fontSize: 32,
    fontWeight: fonts.fontWeight.bold,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 64,
    marginHorizontal: 22,
  },
  formField: {
    marginBottom: 22,
  },
  formFieldInput: {
    marginVertical: 2,
    color: colors.white,
    fontWeight: fonts.fontWeight.medium,
  },
  showPasswordStyle: {
    color: colors.white,
  },
  actionsWrapper: {
    marginHorizontal: 24,
  },
  mainText: {
    color: colors.black,
  },
  loginButton: {
    marginTop: 10,
  },
});
