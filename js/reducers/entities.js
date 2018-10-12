import { createSelector } from 'reselect';
import _ from 'lodash';

import { getMe } from './users';

import { UPDATE_PROFILE_SUCCESS, LOGOUT } from '../constants/users';
import { FETCH_REVIEW_SUCCESS, FETCH_FRIENDSHIPS_SUCCESS } from '../constants/entities';

const getPlace = (state, uid) => state.entities.places[uid];
export const getPlaces = state => state.entities.places;
export const getFriends = state => state.entities.friends;

export const selectPlace = () => createSelector(
  [getPlace, getFriends],
  (place, friends) => ({
    ...place,
    friends: (
      place.own
        ? [_.head(place.friends), ..._.reverse(_.tail(place.friends) || [])]
        : _.reverse(place.friends.slice())
    ).map(uid => (friends[uid] || { uid })),
  }),
);

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
      text = reviews.length;
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
  {
    uid: reviewUid,
    createdBy,
    place,
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
    shortDescription: !(places[place.uid] || {}).own ? review.shortDescription : (places[place.uid] && places[place.uid].shortDescription || ''),
    status: !(places[place.uid] || {}).own ? review.status : (places[place.uid] && places[place.uid].status || ''),
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
