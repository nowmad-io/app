import { createStackNavigator } from 'react-navigation';

import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';

export default createStackNavigator({
  RegisterScreen,
  LoginScreen,
  ProfileScreen,
}, {
  navigationOptions: {
    header: null,
  },
});
