import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';

import Api from '../libs/requests';
import { apiLogin, authenticate } from '../actions/auth';
import Spinner from '../components/Spinner';

class LoginScreen extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
    token: PropTypes.string,
  }

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: 'j@j.com',
      password: 'j',
      error: null,
      loading: false,
    };

    if (props.token) {
      props.navigation.navigate('App');
    }
  }

  onLoginPress = () => {
    const { email, password } = this.state;
    const { dispatch, navigation } = this.props;

    this.setState({ loading: true });

    apiLogin({ email, password })
      .then(({ auth_token: token }) => {
        Api.setAuthorisation(token);
        dispatch(authenticate(token));
        navigation.navigate('App');
      })
      .catch(({ error }) => this.setState({
        error,
        loading: false,
      }));
  }

  render() {
    const {
      email, password, error, loading,
    } = this.state;

    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ email: text })}
          value={email}
        />
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ password: text })}
          value={password}
        />
        <Text onPress={this.onLoginPress}>Login</Text>
        { error && (
          <Text>{error}</Text>
        )}
        <Spinner overlay visible={loading} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
});

export default connect(mapStateToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  input: {
    height: 40,
  },
});
