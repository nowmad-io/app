import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';

import Api from './libs/requests';
import MainNavigator from './navigation/MainNavigator';
import colors from './constants/colors';

import configureStore from './configureStore';
  console.log('yo', Config.API_URL);
Api.initialize(Config.API_URL);

const { persistor, store } = configureStore();

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SafeAreaView style={styles.container}>
        <MainNavigator />
      </SafeAreaView>
    </PersistGate>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
});
