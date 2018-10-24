import _ from 'lodash';

import { LOGOUT } from '../constants/auth';
import {
  FETCH_REVIEW_SUCCESS,
} from '../constants/entities';

export const getPlace = (state, uid) => state.entities.places[uid];
export const getPlaces = state => state.entities.places;
export const getReviews = state => state.entities.reviews;
export const getReview = (state, uid) => state.entities.reviews[uid];

const initialPlace = {
  own: null,
  reviews: [],
  pictures: [],
  categories: [],
  friends: [],
  shortDescription: '',
  information: '',
  status: '',
};

const addToPlace = (
  prevPlace = initialPlace,
  {
    uid: reviewUid,
    createdBy,
    place,
    shortDescription,
    information,
    status,
    ...review
  },
  own,
) => ({
  ...prevPlace,
  ...place,
  own: own ? reviewUid : prevPlace.own,
  reviews: _.uniqBy([
    { uid: reviewUid, createdBy },
    ...prevPlace.reviews,
  ], 'uid'),
  pictures: _.uniqBy((
    own
      ? [
        ...(_.values(review.pictures) || []),
        ...prevPlace.pictures,
      ] : [
        ...prevPlace.pictures,
        ...(_.values(review.pictures) || []),
      ]
  ), 'uri'),
  friends: _.uniq(own
    ? [createdBy, ...prevPlace.friends]
    : [...prevPlace.friends, createdBy]),
  categories: _.uniq([
    ..._.keys(review.categories),
    ...prevPlace.categories,
  ]),
  shortDescription: (!prevPlace.own || own) ? shortDescription : prevPlace.shortDescription,
  information: (!prevPlace.own || own) ? information : prevPlace.information,
  status: (!prevPlace.own || own) ? status : prevPlace.status,
});

const initialState = {
  reviews: {},
  places: {},
};

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEW_SUCCESS: {
      const { [Object.keys(action.review)[0]]: review } = action.review;
      const { removed, updated } = action;
      let newPlaces;

      if (removed || updated || state.reviews[review.uid]) {
        const place = state.places[review.place.uid];
        const reviews = [
          ..._.filter(place.reviews, ({ uid }) => uid !== review.uid),
          ...(removed ? [] : [review]),
        ];

        const updatedPlace = _.reduce(
          reviews,
          (result, { uid }) => addToPlace(
            result, uid !== review.uid ? state.reviews[uid] : review, place.own === uid,
          ),
          initialPlace,
        );

        newPlaces = (!removed || _.size(reviews))
          ? {
            ...state.places,
            [review.place.uid]: (
              removed ? updatedPlace : addToPlace(updatedPlace, review, action.own)
            ),
          } : _.omit(state.places, review.place.uid);
      } else {
        newPlaces = {
          ...state.places,
          [review.place.uid]: addToPlace(state.places[review.place.uid], review, action.own),
        };
      }

      return {
        ...state,
        places: newPlaces,
        reviews: !removed ? {
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
