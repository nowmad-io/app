import {
  take, put, race, call,
} from 'redux-saga/effects';

// Utility function to delay effects
export function delay(millis) {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(true), millis);
  });
  return promise;
}

// Fetch data every 5 seconds
export const fetchSaga = api => function* _fetchSagas() {
  yield call(delay, 8000);
  yield put(api());
};

// Wait for successful response, then fire another request
// Cancel polling if user logs out
export const pollSaga = (api, success, stop) => function* _watchFetch() {
  yield put(api());

  while (true) {
    yield take(success);
    yield race([
      call(fetchSaga(api)),
      take(stop),
    ]);
  }
};
