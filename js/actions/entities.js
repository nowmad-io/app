import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_REVIEW_SUCCESS,
  FETCH_FRIENDSHIPS_SUCCESS,
} from '../constants/entities';

export function fetchFriendships() {
  return Firebase.friendships.child(Firebase.userUID()).once('value')
    .then(friends => friends.val());
}

export function fetchFriendshipsSuccess(friends) {
  return {
    type: FETCH_FRIENDSHIPS_SUCCESS,
    friends,
  };
}

export function fetchReviewSuccess(review, removed, own) {
  return {
    type: FETCH_REVIEW_SUCCESS,
    review,
    removed,
    own,
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
    query.on(
      'child_removed',
      data => emitData(emit, data, true),
    );

    return () => query.off();
  });

  return listener;
}
