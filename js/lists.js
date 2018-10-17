import _ from 'lodash';

export const STATUS = [
  'Travelling here',
  'Living here',
  'Local',
];

export const CATEGORIES = [
  'Adventure',
  'Nature shows',
  'Culture',
  'City',
];

export const NOTIFICATIONS = {
  friendRequest: (me, senderId) => [
    { en: 'sent you a Friend Request' },
    {},
    senderId,
    { headings: { en: `${_.upperFirst(me.firstName)} ${_.upperFirst(me.lastName)}` } },
  ],
};
