import Config from 'react-native-config';
import _ from 'lodash';

import Firebase from '../libs/firebase';
import Api from '../libs/requests';

export const COORD_REGEX = /^([-+]?[\d]{1,2}\.\d+),\s*([-+]?[\d]{1,3}\.\d+)?$/;

const photoUrl = ({ photo_reference: ref }) => {
  const url = 'https://maps.googleapis.com/maps/api/place/photo';
  const key = `key=${Config.PLACES_API_KEY}`;
  const maxwidth = 'maxwidth=600';
  const photoreference = `photoreference=${ref}`;

  return {
    uid: ref,
    uri: `${url}?${key}&${maxwidth}&${photoreference}`,
  };
};

const getUid = ({
  latitude, longitude, lat, lng,
}) => `${`${latitude || lat}`.replace('.', ',')}_${`${longitude || lng}`.replace('.', ',')}`;

export const poiToPlace = ({ placeId, name, coordinate }) => ({
  uid: getUid(coordinate),
  placeId,
  name,
  latitude: coordinate.latitude,
  longitude: coordinate.longitude,
  google: true,
});

const autocompleteToPlace = autocomplete => (!autocomplete
  ? []
  : autocomplete.predictions.map(({ place_id: placeId, description }) => ({
    placeId,
    name: description,
  })));

const nearByToPlace = nearby => (!nearby
  ? []
  : nearby.results.map(({ place_id: placeId, name, geometry: { location } }) => ({
    uid: getUid(location),
    placeId,
    name,
    latitude: location.lat,
    longitude: location.lng,
    google: true,
  })));

export function peopleSearch(query) {
  return Api.get(`search?user=${query}`)
    .then(
      ({ hits, nbHits }) => (nbHits ? _.filter(hits, hit => hit.uid !== Firebase.userUID()) : []),
    );
}

export function placesSearch(query) {
  const key = `key=${Config.PLACES_API_KEY}`;
  const coord = COORD_REGEX.exec(query);
  let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  let params = `input=${query}`;
  let parser = autocompleteToPlace;

  if (coord && coord.length >= 3) {
    const location = `location=${coord[1]},${coord[2]}`;
    const rankby = 'rankby=distance';
    const type = 'type=point_of_interest';

    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    params = `${location}&${rankby}&${type}`;
    parser = nearByToPlace;
  }

  return Api.get(`${url}?${key}&${params}`)
    .then(parser);
}

export function placeDetails(placeId, poiName = null) {
  const url = 'https://maps.googleapis.com/maps/api/place/details/json';
  const key = `key=${Config.PLACES_API_KEY}`;
  const placeid = `placeid=${placeId}`;
  const fields = 'fields=name,vicinity,geometry,photos';

  return Api.get(`${url}?${key}&${placeid}&${fields}`)
    .then(({
      result: {
        name, geometry: { location }, photos, vicinity, ...place
      },
    }) => ({
      uid: getUid(location),
      placeId,
      name: poiName || name || '',
      latitude: location.lat,
      longitude: location.lng,
      pictures: photos && photos.map(photoUrl),
      google: true,
      vicinity: vicinity || `${location.lat}, ${location.lng}`,
      ...place,
    }));
}
