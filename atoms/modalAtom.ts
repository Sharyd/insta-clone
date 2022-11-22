import { atom } from "recoil";

export const modalState = atom({
  key: "modalKey",
  default: false,
});

export const modalTypeState = atom({
  key: "modalTypeKey",
  default: "createPost",
});
