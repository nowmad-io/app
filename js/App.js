import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Config from 'react-native-config';

import Api from './libs/requests';
import MainNavigator from './navigation/MainNavigator';
import SplashScreen from './screens/SplashScreen';
import { colors } from './constants/parameters';

import configureStore from './configureStore';

Api.initialize(Config.API_URL);

const { persistor, store } = configureStore();

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={<SplashScreen />}>
      <SafeAreaView style={styles.container}>
        <MainNavigator />
      </SafeAreaView>
    </PersistGate>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
