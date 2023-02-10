import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  setDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase/firebase';
import { HiOutlineTrash } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';
import { getPostIdState } from '../../atoms/postAtom';
import useIsAlreadySet from '../../hooks/use-isAlreadySet';
interface Props {
  id: string;
  comment: DocumentData;
}

const Comments = ({ comment, id }: Props) => {
  const postId = useRecoilValue(getPostIdState);
  const [user, loading] = useAuthState(auth);

  const [likes, setLikes] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const { value: liked } = useIsAlreadySet(likes, user?.uid ?? '');

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts', postId, 'comments', id, 'commentsLike')),
        snapshot => {
          setLikes(snapshot.docs);
        }
      ),
    [db]
  );

  const likeComment = async () => {
    if (liked) {
      await deleteDoc(
        doc(
          db,
          'posts',
          postId,
          'comments',
          id,
          'commentsLike',
          user?.uid ?? ''
        )
      );
    } else {
      await setDoc(
        doc(
          db,
          'posts',
          postId,
          'comments',
          id,
          'commentsLike',
          user?.uid ?? ''
        ),
        {
          username: user?.displayName,
        }
      );
    }
  };
  const deleteComment = () => {
    deleteDoc(doc(db, 'posts', postId, 'comments', id));
  };

  return (
    <div className="px-4 py-2 text-[0.8rem] flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 h-full">
          <img
            className="w-8 h-8 object-cover rounded-full "
            src={comment.userImg}
            alt="user profile img"
          />
          <span className="font-[500]">{comment.username}</span>
          <div className="text-gray-400 text-[0.7rem]">
            <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
          </div>
        </div>
        <p className="max-w-[30rem]">{comment.comment}</p>
      </div>
      <div className="flex items-center gap-2">
        {user?.uid === comment?.userId && (
          <HiOutlineTrash
            onClick={deleteComment}
            className="w-4 h-4 cursor-pointer hover:text-gray-400"
          />
        )}

        <div onClick={likeComment}>
          {liked ? (
            <AiFillHeart className="w-4 h-4 cursor-pointer fill-red-500" />
          ) : (
            <AiOutlineHeart className="w-4 h-4 cursor-pointer hover:text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
