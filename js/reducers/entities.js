import _ from 'lodash';

import { FETCH_PLACES_SUCCESS } from '../constants/entities';
import { LOGOUT } from '../constants/users';

const initialState = {
  places: {},
};

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLACES_SUCCESS:

      return {
        ...state,
        places: !action.removed ? {
          ...state.places,
          ...action.places,
        } : _.omit(state.places, Object.keys(action.places)[0]),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default entitiesReducer;
