import { composeWithDevTools } from 'remote-redux-devtools';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';

export default () => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
  ];

  const rootPersistConfig = {
    key: 'root',
    storage,
  };

  const rootReducer = combineReducers(reducers);

  const store = createStore(
    persistReducer(rootPersistConfig, rootReducer),
    composeWithDevTools(applyMiddleware(...middlewares)),
  );

  sagas.map(saga => sagaMiddleware.run(saga));

  const persistor = persistStore(store);

  return {
    store, persistor,
  };
};
