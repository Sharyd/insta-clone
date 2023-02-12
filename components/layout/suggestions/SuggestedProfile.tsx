import Link from 'next/link';
import React from 'react';

interface Props {
  uid: string;
  photoURL: string;
  displayName: string;
  email: string;
}

const SuggestedProfile = ({ uid, photoURL, displayName, email }: Props) => {
  return (
    <div key={uid} className="flex items-center justify-between">
      <div className="p-2 flex gap-3">
        <img
          src={photoURL}
          alt="users profiles"
          className="w-9 h-9 rounded-full"
        />
        <div className="flex flex-col  justify-center">
          <p className="font-[500] text-[0.8rem]">{displayName}</p>
        </div>
      </div>
      <Link
        href={{
          pathname: `/${uid}`,
          query: {
            uid: uid,
            displayName: displayName,
            photoURL: photoURL,
          },
        }}
        className="font-[500] textMainColor"
        onClick={() => localStorage.setItem('uid', uid)}
      >
        Show user
      </Link>
    </div>
  );
};

export default SuggestedProfile;
