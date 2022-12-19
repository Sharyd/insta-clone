import React, { Dispatch, KeyboardEventHandler, SetStateAction } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

interface Props {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  handleKey: KeyboardEventHandler<HTMLInputElement>;
}

const InputSearch = ({ username, setUsername, handleKey }: Props) => {
  return (
    <>
      <div className="group-focus:hidden absolute bg-gray-100 w-10 h-10 flex items-center justify-center rounded-l-lg">
        <HiOutlineSearch className=" text-gray-400 bg-gray-100" />
      </div>
      <input
        className="focus:outline-none group-ml-0 bg-gray-100 ml-6  w-full p-4 h-10 rounded-lg placeholder:text-sm placeholder:font-thin"
        type="text"
        placeholder="Search users"
        onKeyUp={handleKey}
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
    </>
  );
};

export default InputSearch;
