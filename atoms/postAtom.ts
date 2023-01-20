import { atom } from 'recoil';

export const handlePostState = atom({
  key: 'handlePostKey',
  default: false,
});

export const getSelectedImgLengthState = atom({
  key: 'getSelectedImgKey',
  default: 0,
});

export const getPostState = atom({
  key: 'getPostKey',
  default: {},
});
export const getPostIdState = atom({
  key: 'getPostIdKey',
  default: '',
});
