import {
  put, takeLatest, call, take,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import PictureUpload from '../libs/pictureUpload';

import {
  LOGOUT,
  UPDATE_PROFILE,
} from '../constants/auth';
import { STOP_SAGAS } from '../constants/utils';

import { apiUpdateProfile, sessionSuccess } from '../actions/auth';

function* uploadSaga(path) {
  const channel = yield call(() => eventChannel((emit) => {
    PictureUpload(
      path,
      uri => emit({ uri }),
      error => emit({ error }),
    );
    return () => {};
  }));

  const { uri, error } = yield take(channel);

  return { uri, error };
}

function* profileFlow(action) {
  let { photoURL } = action.user;

  if (photoURL) {
    const { uri, error } = yield uploadSaga(photoURL);

    photoURL = !error ? uri : null;
  }

  const user = yield call(apiUpdateProfile, {
    photoURL,
  });

  yield put(sessionSuccess(user));
}

export function* logoutFlow() {
  yield put({ type: STOP_SAGAS });
}

// Bootstrap sagas
export default function* root() {
  yield takeLatest(UPDATE_PROFILE, profileFlow);
  yield takeLatest(LOGOUT, logoutFlow);
}
