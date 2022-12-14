import React, { useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

enum ActiveBtn {
  EDITPROFILE,
  CHANGEPASSWORD,
}

const EditProfile = () => {
  const [user, loading] = useAuthState(auth);

  const [activeBtn, setActiveBtn] = useState(ActiveBtn.EDITPROFILE);
  const refFileToElement = useRef<HTMLInputElement>(null);
  return (
    <Layout>
      <section className="flex flex-col max-w-full max-h-full md:flex-row md:pr-10 m-auto justify-center md:h-[700px] md:w-[650px] bg-white border ">
        <div className="flex flex-col flex-1 items-start md:border-r border-b">
          <button
            onClick={() => setActiveBtn(ActiveBtn.EDITPROFILE)}
            className={`${
              activeBtn === ActiveBtn.EDITPROFILE ? 'bg-gray-100' : ''
            } font-[500] py-4 hover:bg-gray-100 w-full`}
          >
            Edit profile
          </button>
          <button
            onClick={() => setActiveBtn(ActiveBtn.CHANGEPASSWORD)}
            className={`${
              activeBtn === ActiveBtn.CHANGEPASSWORD ? 'bg-gray-100' : ''
            } font-[500] py-4 hover:bg-gray-100 w-full`}
          >
            Change password
          </button>
        </div>
        {activeBtn === ActiveBtn.EDITPROFILE ? (
          <div className="w-[400px] h-full mt-4">
            <h2 className="text-center text-xl py-4">Edit your profile</h2>
            <form className="h-full">
              <div className="flex items-center flex-col justify-center">
                <img
                  className="w-40 h-40 object-cover rounded-full"
                  src={user?.photoURL ?? ''}
                  alt="user-profile"
                />
                <div className="flex flex-col items-center p-4">
                  <p>{user?.displayName}</p>
                  <div
                    onClick={() => refFileToElement?.current?.click()}
                    className="text-sm textMainColor py-1.5 px-2.5 font-semibold cursor-pointer"
                  >
                    <p>Change your profile image</p>
                    <input
                      type="file"
                      hidden
                      ref={refFileToElement}
                      multiple
                      // onChange={addImageToPost}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center flex-col h-1/2  ">
                <div className="py-3 px-6 flex gap-4 items-center border-md">
                  <label className="font-[500]" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="bg-gray-100 border p-2"
                    type="text"
                    id="name"
                    placeholder="Name"
                  />
                </div>
                <div className="py-4 px-6 flex gap-4 items-center border-md">
                  <label className="font-[500]" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="bg-gray-100 border p-2"
                    type="email"
                    id="email"
                    placeholder="Email"
                  />
                </div>
                <div className="mainColor  m-6 text-white bg-blue font-medium text-[0.8rem] py-1.5 px-4 rounded-md ">
                  <button type="submit">Submit</button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <form className="flex items-center justify-center mt-6 flex-col h-1/2 w-[400px] ">
            <div className="flex items-center gap-4 justify-center mb-4">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={user?.photoURL ?? ''}
                alt="user-profile"
              />
              <p>{user?.displayName}</p>
            </div>
            <div className="flex items-center flex-col justify-center">
              <div className="py-3 px-6 flex gap-4 items-center border-md">
                <label className="font-[500] w-28" htmlFor="old-password">
                  Old password
                </label>
                <input
                  className="bg-gray-100 border p-2"
                  type="password"
                  id="old-password"
                />
              </div>
              <div className="py-3 px-6 flex gap-4 items-center border-md">
                <label className="font-[500] w-28" htmlFor="new-password">
                  New password
                </label>
                <input
                  className="bg-gray-100 border p-2"
                  type="password"
                  id="new-password"
                />
              </div>
              <div className="py-3 px-6 flex gap-4 items-center border-md">
                <label className="font-[500] w-28" htmlFor="confirm-password">
                  New password
                </label>
                <input
                  className="bg-gray-100 border p-2"
                  type="password"
                  id="confirm-password"
                />
              </div>
              <div className="mainColor  m-6 text-white bg-blue font-medium text-[0.8rem] py-1.5 px-4 rounded-md ">
                <button type="submit">Change password</button>
              </div>
            </div>
          </form>
        )}
      </section>
    </Layout>
  );
};

export default EditProfile;
