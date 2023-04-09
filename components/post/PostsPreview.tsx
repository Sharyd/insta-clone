import {
  collection,
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { modalState, modalTypeState } from '../../atoms/modalAtom';
import { getPostIdState, getPostState } from '../../atoms/postAtom';
import Image from 'next/image';
import useSnapshotWithId from '../../hooks/use-snapshotWithId';
import useSnapshotIDAndOrderBy from '../../hooks/use-snapshotID&OrderBy';
interface Props {
  post: DocumentData;
  id: string;
}

const PostsPreview = ({ id, post }: Props) => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const [postState, setPostState] = useRecoilState(getPostState);
  const [postId, setPostId] = useRecoilState(getPostIdState);

  const { value: likes } = useSnapshotWithId('posts', id, 'likes');
  const { value: comments } = useSnapshotIDAndOrderBy('posts', id, 'comments');

  return (
    <div className="max-w-full ">
      <div className="relative flex items-center justify-center group cursor-pointer ">
        {post?.image ? (
          <Image
            src={post?.image[0]}
            className="h-[125px] md:h-[200px] lg:h-[275px] object-cover rounded-sm"
            alt={post?.text}
            width={300}
            height={200}
          />
        ) : (
          <Image
            alt="placeholder "
            src={'/placeholder.png'}
            width="300"
            height="500"
          />
        )}

        <div
          onClick={() => {
            setModalOpen(true);
            setModalType('modalPost');
            setPostState(post);
            setPostId(id);
          }}
          className="absolute flex flex-col md:flex-row gap-2 md:gap-10 items-center justify-center w-full h-full group-hover:bg-black/30  "
        >
          <div className="group-hover:flex items-center justify-center gap-1 text-white/90 hidden">
            <AiFillHeart className="w-5 h-5 " />
            <p>{likes?.length}</p>
          </div>
          <div className="group-hover:flex items-center justify-center gap-1 text-white/90 hidden">
            <FaComment className="w-4 h-4" />
            <p>{comments?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsPreview;
