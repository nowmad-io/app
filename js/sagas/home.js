import {
  all, call, fork, put, take, takeLatest, cancel, cancelled, select, takeEvery,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import _ from 'lodash';

import PictureUpload from '../libs/pictureUpload';

import { setGeolocation } from '../actions/home';
import {
  pushReview,
  userReviewsListener,
  fetchReviewSuccess,
} from '../actions/entities';
import { friendshipsListener, fetchFriendshipsSuccess } from '../actions/friends';

import { GET_GEOLOCATION } from '../constants/home';
import { UPLOAD_PICTURES } from '../constants/entities';
import { FETCH_FRIENDSHIPS_SUCCESS } from '../constants/friends';
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

const fetchFrienshipsFlow = uid => (
  function* _fetchFrienshipsFlow() {
    const channel = yield call(friendshipsListener, uid);

    try {
      while (true) {
        const friend = yield take(channel);

        yield put(fetchFriendshipsSuccess(friend));
      }
    } finally {
      if (yield cancelled()) {
        channel.close();
      }
    }
  }
);

function* fetchReviewsFlow(action) {
  const { [Object.keys(action.friends)[0]]: friend } = action.friends;
  const reviewsListeners = yield fork(fetchUserReviewsFlow(friend.uid));

  yield take(STOP_SAGAS);

  yield cancel(reviewsListeners);
}

function* homeFlow() {
  const { uid } = yield select(state => state.auth.me);
  const myReviewsListener = yield fork(fetchUserReviewsFlow(uid, true));
  const frienshipsListener = yield fork(fetchFrienshipsFlow(uid));

  yield take(STOP_SAGAS);

  yield cancel(myReviewsListener);
  yield cancel(frienshipsListener);
}

export default function* root() {
  yield takeLatest(RUN_SAGAS, homeFlow);
  yield takeLatest(GET_GEOLOCATION, currentPosition);
  yield takeLatest(UPLOAD_PICTURES, uploadPicturesFlow);
  yield takeEvery(FETCH_FRIENDSHIPS_SUCCESS, fetchReviewsFlow);
}
