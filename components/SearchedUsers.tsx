import { DocumentData } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';

interface Props {
  users: DocumentData;
}

const SearchedUsers = ({ users }: Props) => {
  // const [user, loading] = useAuthState(auth);
  console.log(users);
  return (
    <Link
      href={{
        pathname: `/${users?.email}`,
        query: {
          uid: users.uid,
          displayName: users.displayName,
          email: users?.email,
          photoURL: users?.photoURL,
        },
      }}
    >
      <div className="p-2 flex items-center gap-2 w-full  hover:bg-gray-100 cursor-pointer">
        <img
          src={users?.photoURL ?? ''}
          alt=""
          className="w-11 h-11 ml-2 object-cover rounded-full"
        />
        <div className="flex flex-col text-sm ">
          <p className="font-[500]">{users?.displayName}</p>
          <p className="text-gray-400 text-xs">{users?.email}</p>
        </div>
      </div>
    </Link>
  );
};

export default SearchedUsers;
