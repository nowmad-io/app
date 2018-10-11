import {
  all, call, fork, put, take, takeLatest, cancel, cancelled, select,
} from 'redux-saga/effects';
import _ from 'lodash';

import { fetchUser, fetchFriendships, fetchFriendshipsSuccess } from '../actions/users';
import { userReviewsListener, fetchReviewSuccess } from '../actions/entities';

import { RUN_SAGAS, STOP_SAGAS } from '../constants/utils';

const fetchUserReviewsFlow = uid => (
  function* _fetchUserReviewsFlow() {
    const channel = yield call(userReviewsListener, uid);

    try {
      while (true) {
        const { removed, ...review } = yield take(channel);

        yield put(fetchReviewSuccess(review, removed));
      }
    } finally {
      if (yield cancelled()) {
        channel.close();
      }
    }
  }
);

function* homeFlow() {
  const { uid } = yield select(state => state.users.me);
  const myReviewsListener = yield fork(fetchUserReviewsFlow(uid));

  // Ftech all users
  const friends = yield call(fetchFriendships);
  let friendsInfo = yield all(_.map(
    friends,
    (val, myUid) => call(fetchUser, myUid),
  ));

  friendsInfo = _.chain(friendsInfo)
    .keyBy('uid')
    .mapValues(v => _.omit(v, 'uid'))
    .value();

  yield put(fetchFriendshipsSuccess(friendsInfo));

  const reviewsListeners = yield all(_.map(
    friends,
    (val, friendUid) => fork(fetchUserReviewsFlow(friendUid)),
  ));

  yield take(STOP_SAGAS);

  yield cancel(myReviewsListener);
  yield all(_.map(
    reviewsListeners,
    reviewsListener => cancel(reviewsListener),
  ));
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
}
