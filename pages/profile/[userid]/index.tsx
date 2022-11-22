import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineCamera } from "react-icons/ai";
import { auth, db } from "../../../firebase";
import Layout from "../../../components/Layout";
import Footer from "../../../components/Footer";
import Link from "next/link";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import PostsQuery from "../../../components/PostsQuery";
import { useRouter } from "next/router";
const ProfilePage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const routerSaved = router.asPath;
  // if (!user) return router.push("/");
  const [createdPosts, setCreatedPosts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [savedPosts, setSavedPosts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  console.log(createdPosts);
  console.log(user);
  const getCreatedData = () => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), where("email", "==", user?.email)),
      (snapshot) => {
        setCreatedPosts(snapshot?.docs);
      }
    );
    return unsubscribe;
  };
  const getSavedData = () => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), where("bookmarked", "==", user?.uid)),
      (snapshot) => {
        setSavedPosts(snapshot?.docs);
      }
    );
    return unsubscribe;
  };

  useEffect(() => {
    if (!user) return;
    getCreatedData();
  }, [db, user]);

  console.log(createdPosts);
  return (
    <Layout>
      <div className="flex flex-col text-sm items-center justify-center w-full  pt-20 md:pt-0">
        <section className="p-4 tracking-wider text-gray-800 flex flex-col items-center md:max-w-[950px] m-auto">
          <div className="w-full md:mb-96 flex flex-col">
            <div className="flex w-full border-b mb-4 items-center justify-center">
              <div className="flex w-full items-center gap-10 md:gap-20 xl:ml-10 flex-col md:flex-row mb-10">
                <img
                  src={
                    user?.photoURL === null
                      ? "https://graph.facebook.com/9002313636460828/picture"
                      : user?.photoURL
                  }
                  alt="user profile"
                  className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover"
                />

                <div className="flex flex-col gap-2 md:gap-4 text-gray-700 ">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-thin mb-4 md:mb-0">
                      {user?.displayName}
                    </h2>
                    <div className="flex items-center gap-2 justify-center">
                      <button className="font-semibold text-sm border px-3 py-1 rounded-sm">
                        Edit profile
                      </button>
                      <IoSettingsOutline className="w-6 h-6 cursor-pointer mr-4" />
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-between items-center gap-6">
                    <p className="text-center md:text-start flex gap-2">
                      <span className="font-semibold">0</span> posts
                    </p>
                    <p className="text-center md:text-start flex gap-2">
                      <span className="font-semibold">120</span> followers
                    </p>
                    <p className="text-center md:text-start flex gap-2">
                      <span className="font-semibold">190</span> following
                    </p>
                  </div>
                  <p className="font-semibold text-center md:text-start">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-12 ">
                <Link href={`/profile/${user?.uid}`}>POSTS</Link>
                <Link
                  onClick={getSavedData}
                  href={`/profile/${user?.uid}?saved`}
                >
                  SAVED
                </Link>
              </div>
              {createdPosts?.length !== 0 && (
                <button className="text-sm textMainColor font-semibold ml-auto">
                  Share your photo
                </button>
              )}

              {!routerSaved.includes("?saved") ? (
                <div className="mt-5 md:mt-10 text-center">
                  {createdPosts?.length === 0 ? (
                    <div className="flex gap-4 flex-col items-center justify-center">
                      <AiOutlineCamera className="w-20 h-20 font-thin" />
                      <h2 className="text-xl font-thin">Share Photos</h2>
                      <p className="text-sm">
                        When you share photos, they will appear on your profile.
                      </p>
                      <button className="text-sm textMainColor font-semibold">
                        Share your first photo
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 max-h-full max-w-full gap-2 md:gap-6">
                      {user?.email !== null &&
                        createdPosts?.map((post) => (
                          <PostsQuery
                            key={post.id}
                            post={post.data()}
                            id={post.id}
                          />
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5 md:mt-10 grid grid-cols-3 max-h-full max-w-full gap-2 md:gap-6">
                  {user?.uid !== null &&
                    savedPosts?.map((post) => (
                      <PostsQuery
                        key={post.id}
                        post={post.data()}
                        id={post.id}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
