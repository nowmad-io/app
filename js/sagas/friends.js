import {
  call, fork, put, take, takeLatest, cancel, cancelled, select,
} from 'redux-saga/effects';
import OneSignal from 'react-native-onesignal';

import {
  requestsListener, fetchRequestsSuccess, apiSendRequest, apiSeenRequests,
} from '../actions/friends';

import {
  SEND_NOTIFICATION, SEND_REQUEST, SEEN_REQUESTS,
} from '../constants/friends';
import { RUN_SAGAS, STOP_SAGAS } from '../constants/utils';
import { NOTIFICATIONS } from '../lists';

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

const sendNotification = me => action => OneSignal.postNotification(
  ...NOTIFICATIONS[action.notificationType](me, action.senderId),
);

function* seenRequestFlow() {
  const incomings = yield select(state => state.friends.incomings);

  yield call(apiSeenRequests, incomings);
}

function* friendsFlow() {
  const { uid, ...me } = yield select(state => state.auth.me);
  const requestsFork = yield fork(fetchRequestsFlow(uid));

  yield takeLatest(SEND_NOTIFICATION, sendNotification(me));
  yield takeLatest(SEND_REQUEST, apiSendRequest(me));
  yield takeLatest(SEEN_REQUESTS, seenRequestFlow);

  yield take(STOP_SAGAS);
  yield cancel(requestsFork);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, friendsFlow);
}
