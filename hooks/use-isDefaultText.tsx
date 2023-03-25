import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

interface Props {
  posts: QueryDocumentSnapshot<DocumentData>[];
  followingUsers?: DocumentData[];
}

const useIsDefaultText = ({ posts, followingUsers }: Props) => {
  const [message, setMessage] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (posts?.length === 0 || followingUsers?.length === 0) {
        return setMessage(true);
      } else {
        return setMessage(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [posts, followingUsers]);

  return {
    message,
  };
};

export default useIsDefaultText;
