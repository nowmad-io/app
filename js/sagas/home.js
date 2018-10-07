import {
  call, fork, put, takeLatest,
} from 'redux-saga/effects';

// import { fetchUsers, fetchUsersSuccess } from '../actions/users';
import { fetchChats, fetchChatsSuccess } from '../actions/chat';

import { RUN_SAGAS } from '../constants/utils';

// function* fetchUserFlow() {
//   const users = yield call(fetchUsers);
//
//   yield put(fetchUsersSuccess(users));
// }

function* fetchChatsFlow() {
  const users = yield call(fetchChats);

  yield put(fetchChatsSuccess(users));
}

function* homeFlow() {
  // yield fork(fetchUserFlow);
  yield fork(fetchChatsFlow);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
