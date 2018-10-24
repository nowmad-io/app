import { AppRegistry, Alert } from 'react-native';
import { Sentry } from 'react-native-sentry';
import Config from 'react-native-config';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';

import { persistor, App } from './js/App';
import { name as appName } from './app.json';

if (Config.NODE_ENV !== 'development') {
  Sentry.config(Config.SENTRY_API_KEY).install();
}

const onRestartPress = () => persistor.purge().then(() => RNRestart.Restart());

// Set global error handler
setJSExceptionHandler((e, isFatal) => {
  Alert.alert(
    'Unexpected error occurred',
    `Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}

    We will need to restart the app.`,
    [{
      text: 'Restart',
      onPress: onRestartPress,
    }],
  );
});

setNativeExceptionHandler((exceptionString) => {
  if (Config.NODE_ENV !== 'development') {
    Sentry.captureException(new Error(exceptionString), {
      logger: 'NativeExceptionHandler',
    });
  }
}, false);

AppRegistry.registerComponent(appName, () => App);
