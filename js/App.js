import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';

import Api from './libs/requests';
import PictureUpload from './libs/pictureUpload';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';

import configureStore from './configureStore';

const { polyfill } = require('rn-fetch-blob').default;

const { Blob, XMLHttpRequest } = polyfill;
window.XMLHttpRequest = XMLHttpRequest;
window.Blob = Blob;

Api.initialize(Config.API_URL);

PictureUpload.initialize({
  apiKey: Config.FIREBASE_APIKEY,
  authDomain: Config.FIREBASE_AUTHDOMAIN,
  databaseURL: Config.FIREBASE_DATABASEURL,
  projectId: Config.FIREBASE_PROJECTID,
  storageBucket: Config.FIREBASE_STORAGEBUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGINGSENDERID,
});

const { persistor, store } = configureStore();

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<SplashScreen />}>
      <MainNavigator />
    </PersistGate>
  </Provider>
);
