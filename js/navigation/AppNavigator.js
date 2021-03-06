import { createStackNavigator } from 'react-navigation';

import HomeNavigator from './HomeNavigator';
import AddReviewScreen from '../screens/AddReviewScreen';
import AddImageScreen from '../screens/AddImageScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FriendsScreen from '../screens/FriendsScreen';
import PlaceDetailsScreen from '../screens/PlaceDetailsScreen';
import ReviewDetailsScreen from '../screens/ReviewDetailsScreen';

export default createStackNavigator({
  Home: HomeNavigator,
  FriendsScreen,
  AddReviewScreen,
  AddImageScreen,
  EditProfileScreen,
  PlaceDetailsScreen,
  ReviewDetailsScreen,
}, {
  navigationOptions: {
    header: null,
  },
});
