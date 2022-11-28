import React, { useEffect, useMemo } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import SearchedUsers from "./SearchedUsers";
import { motion } from "framer-motion";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useRecoilState } from "recoil";
import { searchedUsers, searcUsers } from "../atoms/searchAtom";
import {
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  type: string;
}

const SidebarSearch = ({ type }: Props) => {
  const [username, setUsername] = useRecoilState(searcUsers);
  const [users, setUsers] = useRecoilState<any>(searchedUsers);
  const [user, loading] = useAuthState(auth);
  console.log(users);

  useEffect(
    () =>
      onSnapshot(query(collection(db, "users")), (snapshot) =>
        setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    [db]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((userr: { displayName: string; uid: string }) => {
      if (userr.uid !== user?.uid)
        return userr.displayName.toLowerCase().includes(username.toLowerCase());
    });
  }, [users, username]);

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0.5 }}
      animate={{ x: "85px", opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-[350px] left-[0px] top-0 h-screen absolute bg-white rounded-r-xl -z-20"
      exit={{ x: "-100%", opacity: 0.5 }}
    >
      {type === "search" ? (
        <>
          <div className="border-b p-4">
            <h2 className="font-[500] text-xl mb-8">Search</h2>
            <div className="relative flex items-center mb-2 group">
              <div className="group-focus:hidden absolute bg-gray-100 w-10 h-10 flex items-center justify-center rounded-l-lg">
                <HiOutlineSearch className=" text-gray-400 bg-gray-100" />
              </div>
              <input
                className="focus:outline-none group-ml-0 bg-gray-100 ml-6  w-full p-4 h-10 rounded-lg placeholder:text-sm placeholder:font-thin"
                type="text"
                placeholder="Search"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
          </div>
          <div className="mt-2">
            {filteredUsers.map((users: DocumentData) => (
              <SearchedUsers users={users} key={users.uid} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-xs">
          <div className="border-b p-4 ">
            <h2 className="font-[500] text-xl mb-8">Notifications</h2>
            <div className="flex items-center justify-between  gap-2">
              <div className="flex gap-2 items-center">
                <img
                  src="user-5.jpg"
                  alt="user img"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-[500]">Follow requests</h3>
                  <p className="text-gray-400">MichaelXXX + 3 others</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <p className="w-[0.43rem] h-[0.43rem] mainColor rounded-full"></p>
                <MdOutlineKeyboardArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="p-4 pt-2">
            <h3 className="font-[500] mb-3">Earlier</h3>
            <div className="flex justify-between items-center gap-2 ">
              <div className="flex items-center gap-2 justify-between w-full">
                <img
                  src="user-3.jpeg"
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />

                <p className="w-full">
                  <span className="font-[500]">MichaelXXX</span> started
                  following you. <span className="text-gray-400">10w</span>
                </p>
              </div>
              <button className="py-1.5 px-3 border rounded-md font-[500]">
                Following
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SidebarSearch;
