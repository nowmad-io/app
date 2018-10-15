import { createSelector } from 'reselect';
import _ from 'lodash';

import {
  REGION_CHANGE,
  SELECT_PLACE,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  POI_PLACE,
} from '../constants/home';
import { LOGOUT } from '../constants/auth';

import { getPlaces } from './entities';

const getRegion = state => state.home.region;
const getPoiPlace = state => state.home.poiPlace;

export const selectVisiblePlaces = () => createSelector(
  [getPlaces, getRegion, getPoiPlace],
  (places, region, poiPlace) => {
    const southWest = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };

    const northEast = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };
    console.log('yo', [...[poiPlace || []]]);
    return [...(poiPlace && [poiPlace] || []), ..._.filter(places, place => (
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
        poiPlace: action.poi ? {
          ...action.poi,
          loading: action.partial,
        } : null,
        selectedPlace: action.poi && action.poi.uid,
      };
    case `${LOGOUT}_REQUEST`:
      return initialState;
    default:
      return state;
  }
};

export default homeReducer;
