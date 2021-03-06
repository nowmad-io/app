import { createStackNavigator } from 'react-navigation';

import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

export default createStackNavigator({
  RegisterScreen,
  LoginScreen,
  ProfileScreen,
  ForgotPasswordScreen,
}, {
  navigationOptions: {
    header: null,
  },
});
