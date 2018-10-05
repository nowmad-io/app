import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';

import Api from './libs/requests';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';

import configureStore from './configureStore';

Api.initialize(Config.API_URL);

const { persistor, store } = configureStore();

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<SplashScreen />}>
      <MainNavigator />
    </PersistGate>
  </Provider>
);
