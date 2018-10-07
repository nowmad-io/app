import { createStackNavigator } from 'react-navigation';

import ChatList from '../screens/home/ChatList';
import Chat from '../screens/home/Chat';

export default createStackNavigator({
  ChatList,
  Chat,
}, {
  navigationOptions: {
    header: null,
  },
  transitionConfig: () => ({
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const { index } = scene;
      const width = layout.initWidth;

      return {
        opacity: position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [0, 1, 0],
        }),
        transform: [{
          translateX: position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [width, 0, -width],
          }),
        }],
      };
    },
  }),
});
