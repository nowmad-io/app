import { createStackNavigator } from 'react-navigation';

import HomeNavigator from './HomeNavigator';
import AddReviewScreen from '../screens/AddReviewScreen';
import AddImageScreen from '../screens/AddImageScreen';

export default createStackNavigator({
  Home: HomeNavigator,
  AddReviewScreen,
  AddImageScreen,
}, {
  navigationOptions: {
    header: null,
  },
});
