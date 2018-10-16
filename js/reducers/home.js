import { createSelector } from 'reselect';
import _ from 'lodash';

import {
  REGION_CHANGE,
  SELECT_PLACE,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  G_PLACE,
} from '../constants/home';
import { FETCH_REVIEW_SUCCESS } from '../constants/entities';
import { LOGOUT } from '../constants/auth';

import { getPlaces } from './entities';

const getRegion = state => state.home.region;
const getGPlace = state => state.home.gPlace;

export const selectVisiblePlaces = () => createSelector(
  [getPlaces, getRegion, getGPlace],
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
    case `${LOGOUT}_REQUEST`:
      return initialState;
    default:
      return state;
  }
};

export default homeReducer;
