import { createStackNavigator } from 'react-navigation';

import HomeNavigator from './HomeNavigator';
import AddReviewScreen from '../screens/AddReviewScreen';
import AddImageScreen from '../screens/AddImageScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

export default createStackNavigator({
  Home: HomeNavigator,
  AddReviewScreen,
  AddImageScreen,
  EditProfileScreen,
}, {
  navigationOptions: {
    header: null,
  },
});
