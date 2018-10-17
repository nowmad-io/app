import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';
import OneSignal from 'react-native-onesignal';

import Api from './libs/requests';
import Firebase from './libs/firebase';

import { apiRestoreSession } from './actions/auth';

import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';

import configureStore from './configureStore';

YellowBox.ignoreWarnings([
  'Remote debugger',
  'Setting a timer',
]);

const { polyfill } = require('rn-fetch-blob').default;

const { Blob, XMLHttpRequest } = polyfill;
window.XMLHttpRequest = XMLHttpRequest;
window.Blob = Blob;

Api.initialize(Config.API_URL).setAuthorisation(Config.API_TOKEN);

Firebase.initialize({
  apiKey: Config.FIREBASE_APIKEY,
  authDomain: Config.FIREBASE_AUTHDOMAIN,
  databaseURL: Config.FIREBASE_DATABASEURL,
  projectId: Config.FIREBASE_PROJECTID,
  storageBucket: Config.FIREBASE_STORAGEBUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGINGSENDERID,
});

const { persistor, store } = configureStore();

export default class App extends Component {
  componentWillMount() {
    OneSignal.init(Config.ONESIGNAL_APPID);
    OneSignal.inFocusDisplaying(2);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          persistor={persistor}
          loading={<SplashScreen />}
          onBeforeLift={apiRestoreSession}
        >
          <MainNavigator ref={this._navigation} />
        </PersistGate>
      </Provider>
    );
  }
}
