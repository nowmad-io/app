import { composeWithDevTools } from 'remote-redux-devtools';
import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers';

export default () => {
  const rootPersistConfig = {
    key: 'root',
    storage,
  };

  const rootReducer = combineReducers(reducers);

  const store = createStore(
    persistReducer(rootPersistConfig, rootReducer),
    composeWithDevTools(),
  );

  const persistor = persistStore(store);

  return {
    store, persistor,
  };
};
