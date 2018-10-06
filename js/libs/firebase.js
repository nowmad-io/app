import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';

class Firebase {
  instance = firebase;

  auth;

  storage;

  database;

  constructor() {
    this.auth = this.instance.auth;
    this.storage = this.instance.storage;
    this.database = this.instance.database;
  }

  initialize(config) {
    this.instance.initializeApp(config);
  }
}

export default new Firebase();
