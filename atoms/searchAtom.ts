import { atom, RecoilState } from "recoil";

export const searcUsers = atom({
  key: "searchUsersKey",
  default: "",
});
export const searchedUsers = atom({
  key: "searchedUsersKey",
  default: [],
});
