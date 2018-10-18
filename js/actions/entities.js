import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_REVIEW_SUCCESS,
  UPLOAD_PICTURES,
} from '../constants/entities';

export function fetchReviewSuccess(review, removed, own) {
  return {
    type: FETCH_REVIEW_SUCCESS,
    review,
    removed,
    own,
  };
}

export function uploadPictures(reviewUid, pictures) {
  return {
    type: UPLOAD_PICTURES,
    uid: reviewUid,
    pictures,
  };
}

export function pushReview(review) {
  Firebase.reviews.child(Firebase.userUID()).child(review.uid).update(review);
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

    return () => query.off();
  });

  return listener;
}
