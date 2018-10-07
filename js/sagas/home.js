import {
  all, call, fork, put, take, takeLatest,
} from 'redux-saga/effects';
import _ from 'lodash';

import { fetchUser, fetchUsers, fetchUsersSuccess } from '../actions/users';
import { fetchChats, chatsListener, fetchChatsSuccess } from '../actions/chat';

import { RUN_SAGAS } from '../constants/utils';

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
  const initChats = yield call(fetchChats);

  yield put(fetchChatsSuccess(initChats, false, true));

  while (true) {
    const { removed, ...chats } = yield take(chatsListener());
    yield put(fetchChatsSuccess(chats, removed));
  }
}

function* homeFlow() {
  yield fork(fetchUsersFlow);
  yield fork(fetchChatsFlow);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
