import {
  call, fork, put, take, takeLatest,
} from 'redux-saga/effects';

// import { fetchUsers, fetchUsersSuccess } from '../actions/users';
import { fetchChats, chatsListener, fetchChatsSuccess } from '../actions/chat';

import { RUN_SAGAS } from '../constants/utils';

// function* fetchUserFlow() {
//   const users = yield call(fetchUsers);
//
//   yield put(fetchUsersSuccess(users));
// }

function* fetchChatsFlow() {
  const users = yield call(fetchChats);

  yield put(fetchChatsSuccess(users, false, true));

  while (true) {
    const { removed, ...chats } = yield take(chatsListener());
    yield put(fetchChatsSuccess(chats, removed));
  }
}

function* homeFlow() {
  // yield fork(fetchUserFlow);
  yield fork(fetchChatsFlow);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
