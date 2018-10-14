import {
  REGION_CHANGE,
  SELECT_PLACE,
  GET_GEOLOCATION,
  SET_GEOLOCATION,
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
