import {
  all, call, fork, put, take, takeLatest, cancel, cancelled, select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import _ from 'lodash';

import PictureUpload from '../libs/pictureUpload';

import { setGeolocation } from '../actions/home';
import { fetchUser } from '../actions/users';
import {
  pushReview,
  userReviewsListener,
  fetchReviewSuccess,
  fetchFriendships,
  fetchFriendshipsSuccess,
} from '../actions/entities';

import { GET_GEOLOCATION } from '../constants/home';
import { UPLOAD_PICTURES } from '../constants/entities';
import { RUN_SAGAS, STOP_SAGAS } from '../constants/utils';

function getCurrentPosition() {
  return eventChannel((emit) => {
    const observer = navigator.geolocation.getCurrentPosition(
      position => emit(setGeolocation(position.coords)),
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    );
    return () => observer.stopObserving();
  });
}

function* currentPosition() {
  const channel = yield call(getCurrentPosition);

  const action = yield take(channel);
  yield put(action);
}

function uploadPicture({ uri, ...picture }) {
  return uri.startsWith('http')
    ? ({ uri, ...picture })
    : PictureUpload(uri)
      .then(res => ({ uri: res, ...picture }));
}

function* uploadPicturesFlow(action) {
  const { uid, pictures } = action;

  const uploadedPictures = yield all(_.map(
    pictures,
    picture => call(uploadPicture, picture),
  ));

  pushReview({
    uid,
    pictures: _.keyBy(uploadedPictures, 'uid'),
  });
}

const fetchUserReviewsFlow = (uid, own) => (
  function* _fetchUserReviewsFlow() {
    const channel = yield call(userReviewsListener, uid);

    try {
      while (true) {
        const { removed, ...review } = yield take(channel);

        yield put(fetchReviewSuccess(review, removed, own && uid));
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
  const myReviewsListener = yield fork(fetchUserReviewsFlow(uid, true));

  // Ftech all users
  const friends = yield call(fetchFriendships);
  let friendsInfo = yield all(_.map(
    friends,
    (val, myUid) => call(fetchUser, myUid),
  ));

  friendsInfo = _.chain(friendsInfo)
    .keyBy('uid')
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
  yield takeLatest(GET_GEOLOCATION, currentPosition);
  yield takeLatest(UPLOAD_PICTURES, uploadPicturesFlow);
}
