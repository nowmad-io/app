import {
  REGION_CHANGE,
  SELECT_PLACE,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
  G_PLACE,
  FILTERS_CHANGE,
} from '../constants/home';

export function getGeolocation() {
  return {
    type: GET_GEOLOCATION,
  };
}

export function setGeolocation(coords) {
  return {
    type: SET_GEOLOCATION,
    coords,
  };
}

export function regionChanged(region) {
  return {
    type: REGION_CHANGE,
    region,
  };
}

export function selectPlace(place) {
  return {
    type: SELECT_PLACE,
    place,
  };
}

export function setGPlace(gPlace, partial) {
  return {
    type: G_PLACE,
    gPlace,
    partial,
  };
}

export function filtersChange(filters) {
  return {
    type: FILTERS_CHANGE,
    ...filters,
  };
}
