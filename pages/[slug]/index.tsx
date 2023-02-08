import React, { useCallback, useEffect, useState } from 'react';

import { useAuthState } from 'react-firebase-hooks/auth';
import { IoSettingsOutline } from 'react-icons/io5';
import { AiOutlineCamera } from 'react-icons/ai';
import { auth, db } from '../../firebase';
import Layout from '../../components/layout/Layout';

import Link from 'next/link';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from 'firebase/firestore';
import PostsPreview from '../../components/post/PostsPreview';
import { useRouter } from 'next/router';
import { RotatingLines } from 'react-loader-spinner';
import { useRecoilState } from 'recoil';
import { modalState, modalTypeState } from '../../atoms/modalAtom';

const ProfilePage = () => {
  // I will refactor this code!

  const [loggedUser, loading] = useAuthState(auth);
  const [isSaved, setIsSaved] = useState(false);
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [error, setError] = useState('');
  const router = useRouter();
  const [user, setUser] = useState<DocumentData>({});

  const [isFollowed, setIsFollowed] = useState(false);

  const [storageUserID, setStorageUserID] = useState<null | string>('');
  const userData: any = router.query;
  const { slug: uid, displayName, photoURL } = userData;
  const { slug: loggedUserId } = router?.query;

  const [createdPosts, setCreatedPosts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [savedPosts, setSavedPosts] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  useEffect(() => {
    if (storageUserID !== uid) {
      setStorageUserID(localStorage.getItem('uid'));
    }
  }, [storageUserID, uid]);

  useEffect(() => {
    if (!user || !loggedUser?.uid) return;
    setIsFollowed(
      user[0]?.followers.findIndex(
        (follow: string) => follow === loggedUser?.uid
      ) !== -1
    );
  }, [user, loggedUser?.uid]);

  const getUserData = useCallback(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), where('uid', '==', storageUserID)),
      snapshot => {
        setUser(snapshot.docs.map(userData => userData.data()));
      }
    );
    return unsubscribe;
  }, [db, storageUserID]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handleFollowUser = async () => {
    //Following - if is followed set in following array the userId of user
    setIsFollowed(prev => !prev);
    try {
      await updateDoc(doc(db, 'users', loggedUser?.uid ?? ''), {
        following: isFollowed ? arrayRemove(uid) : arrayUnion(uid),
      });
    } catch (err) {
      console.log(err);
    }
    //Followers - if is followed set in followers array the userId of the logged user
    try {
      await updateDoc(doc(db, 'users', storageUserID ?? ''), {
        followers: isFollowed
          ? arrayRemove(loggedUser?.uid)
          : arrayUnion(loggedUser?.uid),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getCreatedPosts = () => {
    let unsubscribe;
    setIsSaved(false);
    if (uid) {
      unsubscribe = onSnapshot(
        query(collection(db, 'posts'), where('userid', '==', uid)),
        snapshot => {
          setCreatedPosts(snapshot.docs);
        }
      );
    } else {
      unsubscribe = onSnapshot(
        query(collection(db, 'posts'), where('userid', '==', loggedUser?.uid)),
        snapshot => {
          setCreatedPosts(snapshot.docs);
        }
      );
    }

    return unsubscribe;
  };

  const getSavedPosts = () => {
    if (uid !== loggedUser?.uid) return;
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'posts'),
        where('bookmarked', '==', loggedUser?.uid)
      ),
      snapshot => {
        setSavedPosts(snapshot.docs);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (!loggedUser || !userData || !storageUserID) return;

    getCreatedPosts();
  }, [db, router?.query, storageUserID, loggedUser]);

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
                    src={
                      loggedUser?.uid === loggedUserId
                        ? loggedUser?.photoURL ?? ''
                        : photoURL
                    }
                    alt="loggedUser profile"
                    className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover"
                  />

                  <div className="flex flex-col gap-2 md:gap-4 text-gray-700 w-[20rem]">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
                      <div
                        className={`${
                          loggedUser?.uid !== loggedUserId
                            ? 'flex flex-col md:flex-row justify-center gap-4 items-center w-full'
                            : ''
                        }`}
                      >
                        <h2 className="text-xl md:text-2xl font-thin mb-4 md:mb-0 ">
                          {loggedUser?.uid === loggedUserId
                            ? loggedUser?.displayName
                            : displayName}
                        </h2>
                        {loggedUser?.uid !== loggedUserId ? (
                          <div
                            onClick={handleFollowUser}
                            className={`${
                              isFollowed ? 'bg-[#bae6fd]' : 'mainColor'
                            }  
                          flex-1 cursor-pointer flex items-center justify-center text-white bg-blue font-medium text-[0.8rem] py-1.5 w-full rounded-md`}
                          >
                            <button type="button">
                              {isFollowed ? 'unFollow' : 'Follow'}
                            </button>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>

                      {loggedUser?.uid === loggedUserId ? (
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
                        <span className="font-semibold">
                          {user && user[0]?.followers.length}
                        </span>
                        followers
                      </p>
                      <p className="text-center md:text-start flex gap-2">
                        <span className="font-semibold">
                          {user && user[0]?.following.length}
                        </span>
                        following
                      </p>
                    </div>
                    <p className="font-semibold text-center md:text-start">
                      {loggedUser?.uid === uid ||
                      loggedUser?.uid === loggedUserId
                        ? loggedUser?.email
                        : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`flex items-center justify-center ${
                    loggedUser?.uid === loggedUserId ? 'gap-12' : 'gap-0'
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
                    {loggedUser?.uid === loggedUserId && (
                      <button
                        onClick={() => {
                          setIsSaved(true);
                          getSavedPosts();
                        }}
                      >
                        SAVED
                      </button>
                    )}
                  </div>
                </div>
                {createdPosts?.length !== 0 &&
                  loggedUser?.uid === loggedUserId &&
                  !isSaved && (
                    <button className="text-sm textMainColor font-semibold ml-auto mt-2">
                      Share your photo
                    </button>
                  )}

                {!isSaved ? (
                  <div className="mt-3 md:mt-10 text-center">
                    {createdPosts?.length === 0 &&
                    loggedUser?.uid === loggedUserId ? (
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

                        <button
                          onClick={() => {
                            setModalType('createPost');
                            setModalOpen(true);
                          }}
                          className="text-sm textMainColor font-semibold"
                        >
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
                        {loggedUser?.email !== null &&
                          createdPosts?.map(post => (
                            <PostsPreview
                              key={post.id}
                              post={post.data()}
                              id={post.id}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className={`mt-5 md:mt-10 grid grid-cols-3 max-h-full ${
                        savedPosts?.length === 0
                          ? 'max-w-full md:w-[618px] lg:w-[918px]'
                          : 'max-w-full md:w-[618px] lg:w-[918px]'
                      } gap-2 md:gap-6`}
                    >
                      {loggedUser?.uid !== null && savedPosts.length !== 0
                        ? savedPosts?.map(post => (
                            <PostsPreview
                              key={post.id}
                              post={post.data()}
                              id={post.id}
                            />
                          ))
                        : ''}
                    </div>
                    {savedPosts.length === 0 && (
                      <p className="text-center text-lg">No saved posts!</p>
                    )}
                  </>
                )}
                {loggedUser?.uid !== loggedUserId &&
                  createdPosts.length === 0 && (
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
