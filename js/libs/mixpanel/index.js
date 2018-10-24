import Mixpanel from './instance';

export function identifyEvent(email) {
  Mixpanel.identify(email);
}

export function setProfile({ email, firstName, lastName }) {
  Mixpanel.set({
    $distinct_id: email,
    $email: email,
    $first_name: firstName,
    $last_name: lastName,
  });
}

export function registerSuperProperties({ email, firstName, lastName }) {
  Mixpanel.registerSuperProperties({
    $distinct_id: email,
    $email: email,
    $first_name: firstName,
    $last_name: lastName,
  });
}

export function registerEvent(properties) {
  registerSuperProperties(properties);

  Mixpanel.track('Create an account', properties);
}

export function loginEvent() {
  Mixpanel.track('Log-in');
}

export function publishReviewEvent({ country, timeSpent, categories }) {
  Mixpanel.trackWithProperties('Publish Review', {
    Country: country,
    'Time spent till publish': timeSpent,
    categories,
  });
}

export function inviteFriendsEvent() {
  Mixpanel.trackWithProperties('Add Friends');
  Mixpanel.increment('nbOutgoings', 1);
}

export function incrementFriends() {
  Mixpanel.increment('nbFriends', 1);
}

export default Mixpanel;
