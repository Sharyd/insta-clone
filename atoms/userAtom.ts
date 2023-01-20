import { atom } from 'recoil';

export const updateUser = atom({
  key: 'isUserUpdated',
  default: false,
});
