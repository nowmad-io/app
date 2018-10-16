import {
  call, fork, put, take, takeLatest, cancel, cancelled, select,
} from 'redux-saga/effects';

import { requestsListener, fetchRequestsSuccess } from '../actions/friends';

import { RUN_SAGAS, STOP_SAGAS } from '../constants/utils';

const fetchRequestsFlow = uid => (
  function* _fetchRequestsFlow() {
    const channel = yield call(requestsListener, uid);

    try {
      while (true) {
        const requests = yield take(channel);

        yield put(fetchRequestsSuccess(requests));
      }
    } finally {
      if (yield cancelled()) {
        channel.close();
      }
    }
  }
);

function* friendsFlow() {
  const { uid } = yield select(state => state.auth.me);
  const requestsFork = yield fork(fetchRequestsFlow(uid));

  yield take(STOP_SAGAS);

  yield cancel(requestsFork);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, friendsFlow);
}
