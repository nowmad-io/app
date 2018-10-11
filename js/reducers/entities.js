import { createSelector } from 'reselect';
import _ from 'lodash';

import { getMe, getFriends } from './users';

import { FETCH_REVIEW_SUCCESS } from '../constants/entities';
import { LOGOUT } from '../constants/users';

const getPlaces = state => state.entities.places;

export const selectPlaces = createSelector(
  [getPlaces, getMe, getFriends],
  (places, me, friends) => _.map(places, ({ longitude, latitude, reviews }, placeUid) => {
    let i = 0;
    let text;
    let picture;

    if (_.size(reviews) <= 1) {
      const userUid = (_.transform(reviews, (result, { createdBy }) => {
        if (i === 0) {
          result.push(createdBy);
          i += 1;
        }

        if (createdBy === me.uid) {
          result.pop();
          result.push(createdBy);
          return true;
        }
        return false;
      }, []))[0];
      const user = friends[userUid] || {};

      text = (userUid === me.uid) ? 'me' : `${user.firstName[0]}${user.lastName[0]}`;
      picture = user && user.photoURL;
    } else {
      text = `${_.size(reviews)}`;
    }

    return {
      uid: placeUid,
      longitude,
      latitude,
      text,
      picture,
    };
  }),
);

const initialState = {
  reviews: {},
  places: {},
};

const updatePlaces = (places, { reviewId, createdBy }, { uid, ...place }, removed) => ({
  ...places,
  [uid]: {
    ...(places[uid] || {}),
    ...place,
    reviews: !removed ? {
      ...(places[uid].reviews || {}),
      [reviewId]: { createdBy },
    } : _.omit(places[uid].reviews, reviewId),
  },
});

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEW_SUCCESS: {
      const { review } = action;
      const reviewId = Object.keys(review)[0];
      const { place, createdBy } = action.review[reviewId];

      return {
        ...state,
        places: updatePlaces(state.places, { reviewId, createdBy }, place, action.removed),
        reviews: !action.removed ? {
          ...state.reviews,
          ...review,
        } : _.omit(state.review, Object.keys(review)[0]),
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default entitiesReducer;
