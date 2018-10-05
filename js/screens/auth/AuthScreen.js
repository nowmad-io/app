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

import { apiLogin, apiRegister, authenticate } from '../../actions/auth';

import {
  loginFailed, loginNoNetwork, registerFailed, registerNoNetwork,
} from '../../modals';
import { colors, fonts } from '../../constants/parameters';

const logo = require('../../../assets/images/logos/logo_white.png');

class AuthScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    token: PropTypes.string,
    me: PropTypes.object,
    isConnected: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      email: params && params.email || '',
      password: '',
      firstName: '',
      lastName: '',
      loading: false,
      error: null,
    };

    this._passwordField = React.createRef();

    if (props.token) {
      Api.setAuthorisation(props.token);
      props.navigation.navigate('App');
    }
  }

  mainButtonPress = () => {
    const {
      email, password, firstName, lastName,
    } = this.state;
    const { navigation, dispatch, isConnected } = this.props;
    const { params } = this.props.navigation.state;
    const login = params && params.login;

    if (!isConnected) {
      this.setState({
        error: login ? loginNoNetwork : registerNoNetwork,
      });
      return;
    }

    this.setState({ loading: true });

    if (login) {
      apiLogin({
        email,
        password,
      }).then(({ auth_token: authToken }) => {
        dispatch(authenticate(authToken));
        navigation.navigate('App');
      }).catch(() => {
        this.setState({
          loading: false,
          error: loginFailed,
        });
      });
    } else {
      const credentials = {
        email,
        first_name: firstName,
        last_name: lastName,
      };

      apiRegister({
        ...credentials,
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
  }

  secondButtonPress = () => {
    const { email, password } = this.state;
    const { params } = this.props.navigation.state;
    const login = params && params.login;

    if (!login) {
      this.setState(
        { error: null },
        () => {
          this.props.navigation.navigate('LoginScreen', {
            login: true,
            email,
            password,
            setEmail: this.setEmail,
          });
        },
      );
    } else {
      this.setState(
        { error: null },
        () => {
          this.props.navigation.state.params.setEmail(this.state.email);
          this.props.navigation.goBack();
        },
      );
    }
  }

  secondaryActionPress = () => {
    const { params } = this.props.navigation.state;
    const login = params && params.login;

    if (login) {
      this.setState({ error: null });
      this._passwordField.current.onShowPasswordPress();
    } else {
      this.secondButtonPress();
    }
  }

  setEmail = (email) => {
    this.setState({ email });
  }

  closeModal = () => this.setState({ error: null });


  render() {
    const {
      email, password, firstName, lastName, loading, error,
    } = this.state;

    const { params } = this.props.navigation.state;
    const login = params && params.login;
    const valid = email && password && (login || (firstName.replace(/\s/g, '') && lastName.replace(/\s/g, '')));

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
            {!login && (
              <View>
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
              </View>
            )}
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
              disabled={!login && !valid}
              light={!login}
              onPress={!login ? this.mainButtonPress : this.secondButtonPress}
            >
              <Text style={!login && styles.mainText}>Create an account</Text>
            </Button>
            <Button
              disabled={login && !valid}
              light={login}
              style={styles.loginButton}
              onPress={login ? this.mainButtonPress : this.secondButtonPress}
            >
              <Text style={login && styles.mainText}>Log in</Text>
            </Button>
          </View>
          <Spinner overlay visible={loading} />
        </View>
        <Modal
          {...(error || {})}
          visible={!!error}
          onRequestClose={this.closeModal}
          onPrimaryAction={this.closeModal}
          onSecondaryAction={this.secondaryActionPress}
        />
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  me: state.auth.me,
  isConnected: true,
});

export default connect(mapStateToProps)(AuthScreen);

const styles = StyleSheet.create({
  container: {
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
