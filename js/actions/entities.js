import { eventChannel } from 'redux-saga';

import Firebase from '../libs/firebase';

import {
  FETCH_PLACES_SUCCESS,
} from '../constants/entities';


export function fetchPlacesSuccess(places, removed) {
  return {
    type: FETCH_PLACES_SUCCESS,
    places,
    removed,
  };
}

export function placesListener() {
  const query = Firebase.userPlaces.child(Firebase.userUID());
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
