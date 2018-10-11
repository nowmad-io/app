import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_REVIEW_SUCCESS,
} from '../constants/entities';


export function fetchReviewSuccess(review, removed) {
  return {
    type: FETCH_REVIEW_SUCCESS,
    review,
    removed,
  };
}

export function userReviewsListener(uid) {
  const query = Firebase.reviews.child(uid);
  const emitData = (emit, data, removed) => emit({
    [data.key]: {
      ...data.val(),
      createdBy: data.ref.parent.key,
    },
    removed,
  });

  const listener = eventChannel((emit) => {
    query.on(
      'child_added',
      data => emitData(emit, data),
    );
    query.on(
      'child_changed',
      data => emitData(emit, data),
    );
    query.on(
      'child_removed',
      data => emitData(emit, data, true),
    );

    return () => query.off();
  });

  return listener;
}