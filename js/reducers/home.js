import { createSelector } from 'reselect';
import _ from 'lodash';

import {
  REGION_CHANGE,
  SELECT_PLACE,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  G_PLACE,
  FILTERS_CHANGE,
} from '../constants/home';
import { FETCH_REVIEW_SUCCESS } from '../constants/entities';
import { LOGOUT } from '../constants/auth';

import {
  getPlace, getPlaces, getReviews,
} from './entities';
import { getFriends } from './friends';
import { getMe } from './auth';

const getRegion = state => state.home.region;
const getGPlace = state => state.home.gPlace;
const getFilters = state => state.home.filters;

export const selectReview = createSelector(
  [getReviews, getMe, getFriends],
  (reviews, me, friends) => (uid) => {
    const review = reviews[uid];
    const { [Object.keys(me)[0]]: meObject } = me;
    const own = (review.createdBy === meObject.uid);

    return ({
      ...review,
      createdBy: own ? meObject : friends[review.createdBy],
      categories: _.keys(review.categories || {}),
      pictures: _.map(review.pictures, picture => picture),
      own,
    });
  },
);

export const selectPlaceReviews = () => createSelector(
  [getPlace, getReviews, selectReview, getMe, getFriends],
  (place, reviews, getReview) => place.reviews.map(({ uid }) => getReview(uid)),
);

export const selectFilteredPlaces = createSelector(
  [getPlaces, getFilters],
  (places, { friend }) => (
    friend
      ? _.pickBy(places, place => _.find(place.reviews, { createdBy: friend }))
      : places
  ),
);

export const selectVisiblePlaces = () => createSelector(
  [selectFilteredPlaces, getRegion, getGPlace],
  (places, region, gPlace) => {
    const southWest = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };

    const northEast = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };

    return [...(gPlace && [gPlace] || []), ..._.filter(places, place => (
      place.latitude > southWest.latitude && place.latitude < northEast.latitude
        && place.longitude > southWest.longitude && place.longitude < northEast.longitude
    ))];
  },
);

export const selectPlace = () => createSelector(
  [getPlace, getFriends, getMe],
  (place, friends, me) => ({
    ...place,
    friends: (
      place.own
        ? [_.head(place.friends), ..._.reverse(_.tail(place.friends) || [])]
        : _.reverse(place.friends.slice())
    ).map(uid => ({ ...me, ...friends }[uid] || { uid })),
  }),
);

export const selectMarkers = () => createSelector(
  [selectFilteredPlaces, getMe, getFriends],
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

        if (createdBy === Object.keys(me)[0].uid) {
          result.pop();
          result.push(createdBy);
          return true;
        }
        return false;
      }, []))[0];
      const user = { ...me, ...friends }[userUid] || {};

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
  region: {
    longitudeDelta: 126.56254928559065,
    latitudeDelta: 114.96000427333595,
    longitude: 5.266113225370649,
    latitude: 20.476854784243514,
  },
  geolocation: {
    loading: false,
    location: null,
  },
  selectedPlace: null,
  gPlace: null,
  filters: {
    friend: null,
  },
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGION_CHANGE:
      return {
        ...state,
        region: action.region || initialState.region,
      };
    case SELECT_PLACE:
      return {
        ...state,
        selectedPlace: action.place,
      };
    case GET_GEOLOCATION:
      return {
        ...state,
        geolocation: {
          ...state.geolocation,
          loading: true,
        },
      };
    case SET_GEOLOCATION:
      return {
        ...state,
        geolocation: {
          ...state.geolocation,
          coords: action.coords,
          loading: false,
        },
      };
    case G_PLACE:
      return {
        ...state,
        gPlace: action.gPlace ? {
          ...action.gPlace,
          loading: action.partial,
        } : null,
        selectedPlace: action.gPlace && action.gPlace.uid,
      };
    case FETCH_REVIEW_SUCCESS: {
      const { [Object.keys(action.review)[0]]: review } = action.review;
      return {
        ...state,
        gPlace: state.gPlace && review && review.place.uid !== state.gPlace.uid || null,
      };
    }
    case FILTERS_CHANGE:
      return {
        ...state,
        filters: {
          friend: action.friend,
        },
      };
    case `${LOGOUT}_REQUEST`:
      return initialState;
    default:
      return state;
  }
};

export default homeReducer;
