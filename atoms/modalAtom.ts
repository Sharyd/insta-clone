import { atom } from "recoil";

export const modalState = atom({
  key: "modalKey",
  default: false,
});
export const popupState = atom({
  key: "popupKey",
  default: false,
});

export const modalTypeState = atom({
  key: "modalTypeKey",
  default: "createPost",
});
