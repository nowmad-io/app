import {
  RUN_SAGAS,
  STOP_SAGAS,
} from '../constants/utils';

export function runSagas() {
  return {
    type: RUN_SAGAS,
  };
}

export function stopSagas() {
  return {
    type: STOP_SAGAS,
  };
}
