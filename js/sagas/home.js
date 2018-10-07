import {
  all, call, fork, put, take, takeLatest, cancel, cancelled,
} from 'redux-saga/effects';
import _ from 'lodash';

import { fetchUser, fetchUsers, fetchUsersSuccess } from '../actions/users';
import { chatsListener, fetchChatsSuccess } from '../actions/chat';

import { RUN_SAGAS, STOP_SAGAS } from '../constants/utils';

function* fetchUsersFlow() {
  const users = yield call(fetchUsers);
  let fullUsers = yield all(_.map(
    users,
    (val, uid) => call(fetchUser, uid),
  ));

  fullUsers = _.chain(fullUsers)
    .keyBy('uid')
    .mapValues(v => _.omit(v, 'uid'))
    .value();

  yield put(fetchUsersSuccess(fullUsers));
}

function* fetchChatsFlow() {
  const channel = yield call(chatsListener);

  try {
    while (true) {
      const { removed, ...chats } = yield take(channel);

      yield put(fetchChatsSuccess(chats, removed));
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* homeFlow() {
  const fetchUsersFlowSaga = yield fork(fetchUsersFlow);
  const fetchChatsFlowSaga = yield fork(fetchChatsFlow);

  yield take(STOP_SAGAS);

  yield cancel(fetchUsersFlowSaga);
  yield cancel(fetchChatsFlowSaga);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
