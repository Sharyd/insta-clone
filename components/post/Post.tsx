import React, { useEffect, useState, useCallback } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineHeart, AiFillHeart, AiOutlineSmile } from 'react-icons/ai';
import { SlPaperPlane } from 'react-icons/sl';
import { FaRegComment } from 'react-icons/fa';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { HiOutlineTrash } from 'react-icons/hi';
import { motion } from 'framer-motion';
import useSlider from '../../hooks/use-slider';
import BtnSlider from '../stories/SliderBtn';
import Moment from 'react-moment';
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase/firebase';
import { useRecoilState, useRecoilValue } from 'recoil';
import { modalState, modalTypeState } from '../../atoms/modalAtom';
import { getPostState, getPostIdState } from '../../atoms/postAtom';
import EmojiPicker from 'emoji-picker-react';
import { EmojiStyle } from 'emoji-picker-react';
import useEmoji from '../../hooks/use-emoji';
import Comments from './Comments';

import Image from 'next/image';
import useIsAlreadySet from '../../hooks/use-isAlreadySet';
import useSnapshotWithId from '../../hooks/use-snapshotWithId';
import useSnapshotIDAndOrderBy from '../../hooks/use-snapshotID&OrderBy';
import Link from 'next/link';
import { updateUser } from '../../atoms/userAtom';

interface Props {
  post: DocumentData;
  id: string;
  modalPost: boolean;
}

const Post = ({ post, id, modalPost }: Props) => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);

  const [postState, setPostState] = useRecoilState(getPostState);
  const [postId, setPostId] = useRecoilState(getPostIdState);
  const [isUserUpdated, setIsUserUpdated] = useRecoilState(updateUser);

  const { image, text, userImg, username, userid, email } = post;
  const [bookmarks, setBookmarks] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  const [showComments, setShowComments] = useState(false);

  const [user, loading] = useAuthState(auth);
  const { setSlideIndex, slideIndex, prevSlide, nextSlide } = useSlider(
    image?.length - 1
  );

  const { value: likes } = useSnapshotWithId('posts', id, 'likes');
  const { value: comments } = useSnapshotIDAndOrderBy('posts', id, 'comments');

  const { value: liked } = useIsAlreadySet(likes, user?.uid ?? '');
  const { value: bookmarked } = useIsAlreadySet(bookmarks, id);

  const {
    text: comment,
    setText: setComment,
    addEmoji,
    resetEmojiAndText,
    showEmojis,
    setShowEmojis,
  } = useEmoji();

  const moveDot = (index: number) => {
    setSlideIndex(index);
  };

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), where('bookmarked', '==', user?.uid)),
        snapshot => {
          setBookmarks(snapshot.docs);
        }
      ),
    [db]
  );

  const sendLike = async () => {
    if (liked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', user?.uid ?? ''));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', user?.uid ?? ''), {
        username: user?.displayName,
        userImg: user?.photoURL,
      });
    }
  };

  const bookmarkedPosts = async () => {
    if (!bookmarked) {
      await updateDoc(doc(db, 'posts', id), {
        bookmarked: user?.uid,
      });
    } else {
      await updateDoc(doc(db, 'posts', id), {
        bookmarked: deleteField(),
      });
    }
  };

  const sendComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: comment,
      userId: user?.uid,
      username: user?.displayName,
      userImg: user?.photoURL,
      timestamp: serverTimestamp(),
    });

    resetEmojiAndText();
  };

  const deletePost = () => {
    deleteDoc(doc(db, 'posts', id));
  };

  const updateUserInPost = useCallback(async () => {
    if (user?.uid === post?.userid) {
      try {
        await updateDoc(doc(db, 'posts', id), {
          username: user?.displayName,
          userImg: user?.photoURL,
          email: user?.email,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [user?.uid, post?.userid]);

  useEffect(() => {
    if (isUserUpdated) {
      updateUserInPost();
      setIsUserUpdated(false);
    }
  }, [isUserUpdated, updateUserInPost]);

  return (
    <div
      className={
        'flex flex-col mt-4 border-[1px] rounded-md bg-white overflow-hidden'
      }
    >
      <div className="flex items-center justify-between">
        <Link
          href={{
            pathname: `/${userid === user?.uid ? user?.uid : userid}`,
            query: {
              uid: userid,
              displayName: username,
              email: email,
              photoURL: userImg,
            },
          }}
          className="flex items-center gap-2"
          onClick={() => {
            localStorage.setItem('uid', userid);
            setModalOpen(false);
          }}
        >
          <img
            src={userImg}
            alt="user image profile"
            className="w-9 h-9 rounded-full m-2 object-cover"
          />
          <p className="font-[500] text-[0.8rem]">{username}</p>
        </Link>
        <BsThreeDots className="mr-4 w-5 h-5" />
      </div>

      <div className="relative flex w-full cursor-pointer">
        {image?.map((data: string, index: number) => (
          <Image
            onClick={() => {
              setModalOpen(true);
              setModalType('modalPost');
              setPostState(post);
              setPostId(id);
            }}
            width={500}
            height={500}
            key={index}
            src={data}
            priority
            alt="some Post"
            className={`min-w-full transition max-h-[375px] lg:max-h-[445px] ease-in-out duration-500 object-contain bg-black  
           `}
            style={{ transform: `translateX(${-100 * slideIndex}%)` }}
          />
        ))}
        {slideIndex !== image?.length - 1 && (
          <BtnSlider moveSlide={nextSlide} direction={'next'} />
        )}
        {slideIndex !== 0 && (
          <BtnSlider moveSlide={prevSlide} direction={'prev'} />
        )}
      </div>

      <div className="flex items-center justify-between px-4 pt-4 ">
        <div className="flex gap-4  items-center justify-center">
          <div onClick={sendLike}>
            {liked ? (
              <AiFillHeart className="w-7 h-7 cursor-pointer fill-red-500 animate-bounce" />
            ) : (
              <AiOutlineHeart className="w-7 h-7 cursor-pointer hover:text-gray-400" />
            )}
          </div>
          <FaRegComment
            onClick={() => {
              setModalOpen(true);
              setModalType('modalPost');
              setPostState(post);
              setPostId(id);
            }}
            className="w-6 h-6 cursor-pointer hover:text-gray-400 "
          />
          <SlPaperPlane className="w-6 h-6 cursor-pointer hover:text-gray-400" />
        </div>
        {image?.length >= 2 && (
          <div className="flex gap-1">
            {image?.map((_: string, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => moveDot(index)}
                  className={`w-1.5 h-1.5 mt-auto rounded-full bg-gray-400 cursor-pointer ${
                    slideIndex === index && 'bg-blue-600'
                  }`}
                ></div>
              );
            })}
          </div>
        )}
        <div className="flex items-center gap-2 justify-center">
          {user?.uid === post?.userid && (
            <HiOutlineTrash
              onClick={() => {
                deletePost();
                modalOpen && setModalOpen(false);
              }}
              className="w-7 h-7 cursor-pointer hover:text-gray-400"
            />
          )}
          <div onClick={bookmarkedPosts}>
            {bookmarked ? (
              <FaBookmark className="w-6 h-6 cursor-pointer hover:text-gray-400 text-black " />
            ) : (
              <FaRegBookmark className="w-6 h-6 cursor-pointer hover:text-gray-400" />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4 pb-0 text-sm">
        <p className="font-[500] text-[0.8rem]">
          {likes.length === 0 ? 'No' : likes.length}{' '}
          {likes.length === 1 ? 'like' : 'likes'}
        </p>
        <p>
          <span className="font-[500] text-[0.8rem]">{username}</span> {text}
        </p>

        {comments.length >= 1 && (
          <p
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              setModalOpen(true);
              setModalType('modalPost');
              setPostState(post);
              setPostId(id);

              modalOpen && setShowComments(prev => !prev);
            }}
          >
            {showComments ? 'Hide' : 'Show'}{' '}
            <span>
              {comments.length >= 2 && 'all'} {comments?.length}
            </span>{' '}
            comments
          </p>
        )}
      </div>
      {showComments && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          className={`overflow-y-scroll scrollbar-hide ${
            comments.length >= 2 && 'h-[8.5rem]  md:h-28'
          }`}
        >
          {comments.map(comment => (
            <Comments
              key={comment.id}
              id={comment.id}
              comment={comment.data()}
            />
          ))}
        </motion.div>
      )}
      <span className="text-[0.7rem] text-gray-400 p-4">
        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
      </span>
      <form onSubmit={sendComment}>
        <div className="relative flex items-center justify-between  h-full w-full border-t">
          <div className="flex w-full gap-2 pl-2 items-center justify-center">
            <AiOutlineSmile
              onClick={() => setShowEmojis(prev => !prev)}
              className="w-6 h-6 cursor-pointer"
            />

            <textarea
              placeholder="Add a comment..."
              className={`h-max w-full outline-none text-sm resize-none mt-6 scrollbar-hide`}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />

            {showEmojis && (
              <div className="absolute bottom-0 right-0 ml-2">
                <EmojiPicker
                  onEmojiClick={addEmoji}
                  width={300}
                  height={350}
                  emojiStyle={EmojiStyle.FACEBOOK}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!comment.trim()}
            className="disabled:text-[#bae6fd] textMainColor text-sm flex-1 px-4"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Post;
