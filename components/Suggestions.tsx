import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import Link from "next/link";
const Suggestions = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const getFullYear = new Date().getFullYear();

  return (
    <div className="flex flex-col text-[0.7rem] mt-10 ml-4 w-[325px] text-gray-700">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Link
            href={`/profile/${user?.uid}`}
            className="flex items-center cursor-pointer"
          >
            <img
              src={
                user?.photoURL === null
                  ? "https://graph.facebook.com/9002313636460828/picture"
                  : user?.photoURL
              }
              alt="user-profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col ml-4">
              <p className="font-[500] text-[0.8rem]">{user?.displayName}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </Link>
          <button
            onClick={() => {
              auth.signOut();
              router.push("/");
            }}
            className="ml-auto text-[0.7rem] font-[500] textMainColor"
          >
            Switch
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 gap-4 mb-4">
          <h3 className="text-gray-500 font-[500] text-[0.8rem] tracking-wide">
            Suggestions For You
          </h3>
          <button className="text-black">See All</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="p-2 flex gap-3">
            <img
              src="user-5.jpg"
              alt="user-profile"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-[500] text-[0.8rem]">MichaelXXX</p>
              <p className="text-gray-500">Followed by Alex + 3 more</p>
            </div>
          </div>
          <button className="font-[500] textMainColor">Follow</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="p-2 flex gap-3">
            <img
              src="user-5.jpg"
              alt="user-profile"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-[500] text-sm text-[0.8rem]">MichaelXXX</p>
              <p className=" text-gray-500">Followed by Alex + 3 more</p>
            </div>
          </div>
          <button className=" font-[500] textMainColor">Follow</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="p-2 flex gap-3">
            <img
              src="user-5.jpg"
              alt="user-profile"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-[500] text-sm text-[0.8rem]">MichaelXXX</p>
              <p className=" text-gray-500">Followed by Alex + 3 more</p>
            </div>
          </div>
          <button className="font-[500] textMainColor">Follow</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="p-2 flex gap-3">
            <img
              src="user-5.jpg"
              alt="user-profile"
              className="w-9 h-9 rounded-full"
            />
            <div className="flex flex-col">
              <p className="font-[500] text-sm text-[0.8rem]">MichaelXXX</p>
              <p className="text-gray-500">Followed by Alex + 3 more</p>
            </div>
          </div>
          <button className="font-[500] textMainColor">Follow</button>
        </div>

        <nav className="mt-6 text-gray-400 opacity-60 text-[0.65rem] ">
          <ul className="flex gap-2 flex-wrap">
            <li className="hover:underline">
              <a href="#">About</a>
            </li>
            <li className="hover:underline">
              <a href="#">Help</a>
            </li>
            <li className="hover:underline ">
              <a href="#">Press</a>
            </li>
            <li className="hover:underline">
              <a href="#">API</a>
            </li>
            <li className="hover:underline">
              <a href="#">Jobs</a>
            </li>
            <li className="hover:underline">
              <a href="#">Privacy</a>
            </li>
            <li className="hover:underline">
              <a href="#">Terms</a>
            </li>
            <li className="hover:underline">
              <a href="#">Locations</a>
            </li>
            <li className="hover:underline">
              <a href="#">Language</a>
            </li>
          </ul>
        </nav>
        <p className="mt-5 text-gray-400 opacity-60 text-[0.7rem]">
          &copy; {getFullYear} INSTAGRAM CLONE FOR EDUCATION PURPOSIES
        </p>
      </div>
    </div>
  );
};

export default Suggestions;
