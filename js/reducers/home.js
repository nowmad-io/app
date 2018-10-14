import { createSelector } from 'reselect';
import _ from 'lodash';

import {
  REGION_CHANGE,
  SELECT_PLACE,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  POI_PLACE,
} from '../constants/home';
import { LOGOUT } from '../constants/users';

import { getPlaces } from './entities';

const getRegion = state => state.home.region;

export const selectVisiblePlaces = () => createSelector(
  [getPlaces, getRegion],
  (places, region) => {
    const southWest = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };

    const northEast = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };

    return _.filter(places, place => (
      place.latitude > southWest.latitude && place.latitude < northEast.latitude
        && place.longitude > southWest.longitude && place.longitude < northEast.longitude
    ));
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
  poiPlace: null,
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
    case POI_PLACE:
      return {
        ...state,
        poiPlace: {
          ...action.poi,
          loading: action.partial,
        },
        selectedPlace: action.poi && action.poi.uid,
      };
    case `${LOGOUT}_REQUEST`:
      return initialState;
    default:
      return state;
  }
};

export default homeReducer;
