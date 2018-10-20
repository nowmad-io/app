import { createSelector } from 'reselect';
import _ from 'lodash';

import { LOGOUT } from '../constants/auth';
import { FETCH_REVIEW_SUCCESS } from '../constants/entities';

export const getPlace = (state, uid) => state.entities.places[uid];
export const getPlaces = state => state.entities.places;
export const getReviews = state => state.entities.reviews;
const getReview = (state, uid) => state.entities.reviews[uid];

export const selectReview = () => createSelector(
  [getReview],
  review => review,
);

const initialState = {
  reviews: {},
  places: {},
};

const updatePlaces = (
  places,
  {
    uid: reviewUid,
    createdBy,
    place,
    shortDescription,
    status,
    ...review
  },
  removed,
  own,
) => ({
  ...places,
  [place.uid]: {
    ...(places[place.uid] || {}),
    ...place,
    reviews: !removed ? _.uniqBy([
      { uid: reviewUid, createdBy },
      ...(places[place.uid] && places[place.uid].reviews || []),
    ], 'uid') : _.filter(places[place.uid].reviews, { uid: reviewUid }),
    own: own && reviewUid || (places[place.uid] || {}).own,
    pictures: _.uniqBy((
      own
        ? [
          ...(_.values(review.pictures) || []),
          ...(places[place.uid] && places[place.uid].pictures || []),
        ] : [
          ...(places[place.uid] && places[place.uid].pictures || []),
          ...(_.values(review.pictures) || []),
        ]
    ), 'uri'),
    friends: _.uniq(own
      ? [own, ...(places[place.uid] && places[place.uid].friends || [])]
      : [...(places[place.uid] && places[place.uid].friends || []), createdBy]),
    categories: _.uniq(own
      ? [
        ...(_.keys(review.categories) || []),
        ...(places[place.uid] && places[place.uid].categories || []),
      ] : [
        ...(places[place.uid] && places[place.uid].categories || []),
        ...(_.keys(review.categories) || []),
      ]),
    shortDescription: (!(places[place.uid] || {}).own || own) ? shortDescription : (places[place.uid] && places[place.uid].shortDescription || ''),
    status: (!(places[place.uid] || {}).own || own) ? status : (places[place.uid] && places[place.uid].status || ''),
  },
});

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEW_SUCCESS: {
      const { [Object.keys(action.review)[0]]: review } = action.review;

      return {
        ...state,
        places: updatePlaces(state.places, review, action.removed, action.own),
        reviews: !action.removed ? {
          ...state.reviews,
          [review.uid]: review,
        } : _.omit(state.review, review.uid),
      };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default entitiesReducer;
