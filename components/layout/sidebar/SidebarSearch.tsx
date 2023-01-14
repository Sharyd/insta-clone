import { DocumentData } from 'firebase/firestore';
import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import useSearchUsers from '../../../hooks/use-searchUsers';
import SearchedUsers from '../../SearchedUsers';
const SidebarSearch = () => {
  const { username, setUsername, filteredUsers } = useSearchUsers();
  return (
    <>
      <div className="border-b p-4">
        <h2 className="font-[500] text-xl mb-8">Search</h2>
        <div className="relative flex items-center mb-2 group">
          <div className="group-focus:hidden absolute bg-gray-100 w-10 h-10 flex items-center justify-center rounded-l-lg">
            <HiOutlineSearch className=" text-gray-400 bg-gray-100" />
          </div>
          <input
            className="focus:outline-none group-ml-0 bg-gray-100 ml-6  w-full p-4 h-10 rounded-lg placeholder:text-sm placeholder:font-thin"
            type="text"
            placeholder="Search"
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
        </div>
      </div>
      <div className="md:mt-2 h-full overflow-y-auto">
        {filteredUsers.map((users: DocumentData) => (
          <SearchedUsers users={users} key={users.uid} />
        ))}
      </div>
    </>
  );
};

export default SidebarSearch;
