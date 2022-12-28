import React, { useEffect, useState } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { IoSettingsOutline } from 'react-icons/io5';
import { AiOutlineCamera } from 'react-icons/ai';
import { auth, db } from '../../firebase';
import Layout from '../../components/Layout';

import Link from 'next/link';
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import PostsQuery from '../../components/PostsQuery';
import { useRouter } from 'next/router';
import { RotatingLines } from 'react-loader-spinner';

const ProfilePage = () => {
  const [user, loading] = useAuthState(auth);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  // if (!user) return router.push("/");
  const [createdPosts, setCreatedPosts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [savedPosts, setSavedPosts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  const data: any = router.query;

  const { displayName, email, uid, photoURL } = data;
  const { slug } = router?.query;

  const getCreatedData = () => {
    let unsubscribe;

    if (email) {
      unsubscribe = onSnapshot(
        query(collection(db, 'posts'), where('email', '==', email)),
        snapshot => {
          setCreatedPosts(snapshot?.docs);
        }
      );
    } else {
      unsubscribe = onSnapshot(
        query(collection(db, 'posts'), where('email', '==', user?.email)),
        snapshot => {
          setCreatedPosts(snapshot?.docs);
        }
      );
    }

    return unsubscribe;
  };
  const getSavedData = () => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), where('bookmarked', '==', user?.uid)),
      snapshot => {
        setSavedPosts(snapshot?.docs);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (!user || !data) return;

    getCreatedData();
  }, [db, router?.query, data]);

  return (
    <Layout>
      {loading ? (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="48"
            visible={true}
          />
        </div>
      ) : (
        <div className="flex flex-col text-sm items-center justify-center w-full pt-20 md:pt-0">
          <section className="p-4  tracking-wider text-gray-800 flex flex-col items-center md:max-w-[950px] m-auto">
            <div className="w-full md:mb-[45rem] flex flex-col">
              <div className="flex w-full border-b mb-4 items-center justify-center">
                <div className="flex w-full items-center gap-10 md:gap-20 xl:ml-10 flex-col md:flex-row mb-10">
                  <img
                    src={user?.uid === slug ? user?.photoURL ?? '' : photoURL}
                    alt="user profile"
                    className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover"
                  />

                  <div className="flex flex-col gap-2 md:gap-4 text-gray-700 ">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
                      <h2 className="text-xl md:text-2xl font-thin mb-4 md:mb-0 ">
                        {user?.uid === slug ? user?.displayName : displayName}
                      </h2>
                      {user?.uid === slug ? (
                        <div className="flex items-centerjustify-center">
                          <Link
                            href="/editProfile"
                            className="flex items-center  justify-center gap-3 font-semibold text-sm border px-3 py-1 rounded-sm"
                          >
                            Edit profile
                            <IoSettingsOutline className="w-5 h-5 cursor-pointer " />
                          </Link>
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="flex justify-center md:justify-between items-center gap-6">
                      <p className="text-center md:text-start flex gap-2">
                        <span className="font-semibold">
                          {createdPosts?.length}
                        </span>
                        posts
                      </p>
                      <p className="text-center md:text-start flex gap-2">
                        <span className="font-semibold">0</span> followers
                      </p>
                      <p className="text-center md:text-start flex gap-2">
                        <span className="font-semibold">0</span> following
                      </p>
                    </div>
                    <p className="font-semibold text-center md:text-start">
                      {email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`flex items-center justify-center ${
                    user?.uid === slug ? 'gap-12' : 'gap-0'
                  }`}
                >
                  <div className={`${!isSaved && 'lineActivePostsOrSaved'}`}>
                    <button
                      onClick={() => {
                        setIsSaved(false);
                      }}
                    >
                      POSTS
                    </button>
                  </div>
                  <div className={`${isSaved && 'lineActivePostsOrSaved'}`}>
                    {user?.uid === slug && (
                      <button
                        onClick={() => {
                          setIsSaved(true);
                          getSavedData();
                        }}
                      >
                        SAVED
                      </button>
                    )}
                  </div>
                </div>
                {createdPosts?.length !== 0 &&
                  user?.uid === slug &&
                  !isSaved && (
                    <button className="text-sm textMainColor font-semibold ml-auto mt-2">
                      Share your photo
                    </button>
                  )}

                {!isSaved ? (
                  <div className="mt-3 md:mt-10 text-center">
                    {createdPosts?.length === 0 && user?.uid === slug ? (
                      <div
                        className={`${
                          createdPosts?.length === 0
                            ? 'flex max-w-full md:w-[618px] lg:w-[918px]'
                            : 'hidden'
                        }  gap-4 flex-col items-center justify-center mt-10`}
                      >
                        <AiOutlineCamera className="w-20 h-20 font-thin" />
                        <h2 className="text-xl font-thin">Share Photos</h2>
                        <p className="text-sm">
                          When you share photos, they will appear on your
                          profile.
                        </p>
                        <button className="text-sm textMainColor font-semibold">
                          Share your first photo
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`mt-5 md:mt-10 grid grid-cols-3 max-h-full ${
                          createdPosts?.length === 0
                            ? 'max-w-full md:w-[618px] lg:w-[918px]'
                            : 'max-w-full'
                        } gap-2 md:gap-6`}
                      >
                        {user?.email !== null &&
                          createdPosts?.map(post => (
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
                  <div
                    className={`mt-5 md:mt-10 grid grid-cols-3 max-h-full ${
                      savedPosts?.length === 0
                        ? 'max-w-full md:w-[618px] lg:w-[918px]'
                        : 'max-w-full md:w-[618px] lg:w-[918px]'
                    } gap-2 md:gap-6`}
                  >
                    {user?.uid !== null &&
                      savedPosts?.map(post => (
                        <PostsQuery
                          key={post.id}
                          post={post.data()}
                          id={post.id}
                        />
                      ))}
                  </div>
                )}
                {user?.uid !== slug && createdPosts.length === 0 && (
                  <p className="text-lg">User has no posts!</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;
