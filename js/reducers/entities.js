import { createSelector } from 'reselect';
import _ from 'lodash';

import { getMe } from './users';

import { UPDATE_PROFILE_SUCCESS, LOGOUT } from '../constants/users';
import { FETCH_REVIEW_SUCCESS, FETCH_FRIENDSHIPS_SUCCESS } from '../constants/entities';

export const getPlaces = state => state.entities.places;
const getFriends = state => state.entities.friends;

export const selectMarkers = () => createSelector(
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
  friends: {},
};

const updatePlaces = (
  places,
  { uid: reviewUid, createdBy, place },
  removed,
) => ({
  ...places,
  [place.uid]: {
    ...(places[place.uid] || {}),
    ...place,
    reviews: !removed ? {
      ...(places[place.uid] && places[place.uid].reviews || {}),
      [reviewUid]: { createdBy },
    } : _.omit(places[place.uid].reviews, reviewUid),
  },
});

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEW_SUCCESS: {
      const { [Object.keys(action.review)[0]]: review } = action.review;

      return {
        ...state,
        places: updatePlaces(state.places, review, action.removed),
        reviews: !action.removed ? {
          ...state.reviews,
          ...review,
        } : _.omit(state.review, review.uid),
      };
    }
    case UPDATE_PROFILE_SUCCESS: {
      const { [Object.keys(action.user)[0]]: me } = action.user;

      return {
        ...state,
        friends: {
          ...state.friends,
          [me.uid]: {
            ...(state.friends[me.uid] || {}),
            ...me,
          },
        },
      };
    }
    case FETCH_FRIENDSHIPS_SUCCESS:
      return {
        ...state,
        friends: {
          ...state.friends,
          ...action.friends,
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default entitiesReducer;
