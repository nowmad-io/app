import { call, put, takeLatest } from 'redux-saga/effects';

import { fetchUsers, fetchUsersSuccess } from '../actions/users';

import { RUN_SAGAS } from '../constants/utils';

function* homeFlow() {
  const users = yield call(fetchUsers);

  yield put(fetchUsersSuccess(users));
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
