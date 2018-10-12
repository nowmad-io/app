import {
  REGION_CHANGE,
  SELECT_PLACE,
} from '../constants/home';


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
