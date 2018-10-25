import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, StyleSheet, Keyboard, Image,
} from 'react-native';

import Content from '../../components/Content';
import Text from '../../components/Text';
import Button from '../../components/Button';
import FormInput from '../../components/FormInput';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

import { apiLogin, updateProfileSuccess } from '../../actions/auth';

import getModalError from '../../modals';
import { colors, fonts, sizes } from '../../constants/parameters';

const logo = require('../../../assets/images/logos/logo_white.png');

export default class LoginScreen extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { params } = this.props.navigation.state;

    this.state = {
      email: params && params.email || '',
      password: '',
      loading: false,
      error: null,
    };

    this._passwordField = React.createRef();
  }

  loginPress = () => {
    const { email, password } = this.state;
    const { navigation, dispatch } = this.props;

    Keyboard.dismiss();
    this.setState({ loading: true });

    apiLogin(email, password)
      .then((user) => {
        dispatch(updateProfileSuccess(user));
        navigation.navigate('App');
      }).catch(({ code, message }) => {
        this.setState({
          loading: false,
          error: getModalError(code, message),
        });
      });
  }

  registerPress = () => {
    const { email } = this.state;

    this.setState(
      { error: null },
      () => {
        this.props.navigation.state.params.setEmail(email);
        this.props.navigation.goBack();
      },
    );
  }

  onShowPasswordPress = () => {
    this.closeModal();
    this._passwordField.current.onShowPasswordPress();
  };

  closeModal = () => this.setState({ error: null });

  render() {
    const {
      email, password, loading, error,
    } = this.state;

    const valid = email && password;

    return (
      <Content>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <Image
              resizeMode="contain"
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
              onPress={this.registerPress}
            >
              <Text>Create an account</Text>
            </Button>
            <Button
              disabled={!valid}
              light
              style={styles.loginButton}
              onPress={this.loginPress}
            >
              <Text style={styles.mainText}>Log in</Text>
            </Button>
          </View>
          <Spinner overlay visible={loading} />
        </View>
        <Modal
          {...(error || {})}
          visible={!!error}
          onRequestClose={this.closeModal}
          onPrimaryAction={this.closeModal}
          onSecondaryAction={this.onShowPasswordPress}
        />
      </Content>
    );
  }
}

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
    ...fonts.medium,
    lineHeight: 34,
  },
  name: {
    fontSize: 32,
    ...fonts.bold,
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
    ...fonts.medium,
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
