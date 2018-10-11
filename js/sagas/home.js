import {
  all, call, fork, put, take, takeLatest, cancel, cancelled,
} from 'redux-saga/effects';
import _ from 'lodash';

import { fetchUser, fetchFriendships, fetchFriendshipsSuccess } from '../actions/users';
import { placesListener, fetchPlacesSuccess } from '../actions/entities';

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

function* fetchPlacesFlow() {
  const channel = yield call(placesListener);

  try {
    while (true) {
      const { removed, ...places } = yield take(channel);

      yield put(fetchPlacesSuccess(places, removed));
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

function* homeFlow() {
  const fetchUsersFlowSaga = yield fork(fetchUsersFlow);
  const fetchPlacesFlowSaga = yield fork(fetchPlacesFlow);

  yield take(STOP_SAGAS);

  yield cancel(fetchUsersFlowSaga);
  yield cancel(fetchPlacesFlowSaga);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
