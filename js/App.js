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

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived = (notification) => {
    console.log('Notification received: ', notification);
  }

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds = (device) => {
    console.log('Device info: ', device);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          persistor={persistor}
          loading={<SplashScreen />}
          onBeforeLift={apiRestoreSession}
        >
          <MainNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
