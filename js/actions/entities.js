import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_USER_REVIEWS_SUCCESS,
} from '../constants/entities';


export function fetchUserReviewsSuccess(review, removed) {
  return {
    type: FETCH_USER_REVIEWS_SUCCESS,
    review,
    removed,
  };
}

export function userReviewsListener(uid) {
  const query = Firebase.reviews.child(uid);
  const listener = eventChannel((emit) => {
    query.on(
      'child_added',
      data => emit({ [data.key]: data.val() }),
    );
    query.on(
      'child_changed',
      data => emit({ [data.key]: data.val() }),
    );
    query.on(
      'child_removed',
      data => emit({ [data.key]: data.val(), removed: true }),
    );

    return () => query.off();
  });

  return listener;
}
