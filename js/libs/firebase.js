import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import '@firebase/database';

class Firebase {
  instance = firebase;

  auth;

  storage;

  database;

  users;

  friendships;

  reviews;

  initialize(config) {
    this.instance.initializeApp(config);
    this.auth = this.instance.auth;
    this.storage = this.instance.storage;
    this.database = this.instance.database;
    this.users = this.instance.database().ref('users');
    this.friendships = this.instance.database().ref('friendships');
    this.friendRequests = this.instance.database().ref('friendRequests');
    this.reviews = this.instance.database().ref('reviews');
  }

  userUID() {
    return this.auth().currentUser && this.auth().currentUser.email.replace('.', ',');
  }
}

export default new Firebase();
