import {
  all, call, fork, put, take, takeLatest, cancel,
} from 'redux-saga/effects';
import _ from 'lodash';

import { fetchUser, fetchFriendships, fetchFriendshipsSuccess } from '../actions/users';

import { RUN_SAGAS, STOP_SAGAS } from '../constants/utils';

function* fetchUsersFlow() {
  const friends = yield call(fetchFriendships);
  let friendsInfo = yield all(_.map(
    friends,
    (val, uid) => call(fetchUser, uid),
  ));

  friendsInfo = _.chain(friendsInfo)
    .keyBy('uid')
    .mapValues(v => _.omit(v, 'uid'))
    .value();

  yield put(fetchFriendshipsSuccess(friendsInfo));
}

function* homeFlow() {
  const fetchUsersFlowSaga = yield fork(fetchUsersFlow);

  yield take(STOP_SAGAS);

  yield cancel(fetchUsersFlowSaga);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
