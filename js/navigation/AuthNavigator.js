import { createStackNavigator } from 'react-navigation';

import AuthScreen from '../screens/auth/AuthScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';

export default createStackNavigator({
  LoginScreen: AuthScreen,
  RegisterScreen: AuthScreen,
  ProfileScreen,
});
