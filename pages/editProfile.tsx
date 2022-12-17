import React, { FormEvent, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../firebase';

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import {
  updateEmail,
  updateProfile,
  updatePassword,
  User,
} from 'firebase/auth';
import { FaTruckMonster } from 'react-icons/fa';
import ChangePassword from '../components/ChangePassword';

enum ActiveBtn {
  EDITPROFILE,
  CHANGEPASSWORD,
}

const EditProfile = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [activeBtn, setActiveBtn] = useState(ActiveBtn.EDITPROFILE);
  const refFileToElement = useRef<HTMLInputElement>(null);
  const [selectedFileURL, setSelectedFileURL] = useState<any>({});
  console.log(user);

  const addImageProfile = (e: { target: { files: any } }) => {
    const files = e.target.files[0] as Blob;
    const type = files?.type as string;

    if (
      type === 'image/png' ||
      type === 'image/jpg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/webp' ||
      type === 'image/svg'
    ) {
      setSelectedFileURL({
        urlFile: URL.createObjectURL(e.target.files[0]),
        image: e.target.files[0],
      });
    } else {
      throw new Error('Wrong image format');
    }
  };

  const updateYourProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const storageRef = ref(storage, `/profileImg${selectedFileURL.image}`);

    if (user) {
      if (selectedFileURL.image) {
        try {
          await uploadBytesResumable(storageRef, selectedFileURL.image).then(
            () => {
              getDownloadURL(storageRef).then(async downloadURL => {
                await updateProfile(user, {
                  photoURL: downloadURL,
                });
              });
            }
          );
        } catch (err: any) {
          setError(
            (err as { message?: string })?.message ?? 'Something went wrong'
          );
        }
      }
      if (fullName) {
        try {
          await updateProfile(user, {
            displayName: fullName,
          });
        } catch (err) {
          setError(
            (err as { message?: string })?.message ?? 'Something went wrong'
          );
        }
      }
      if (email) {
        try {
          await updateEmail(user, email);
        } catch (err) {
          setError(
            (err as { message?: string })?.message ?? 'Something went wrong'
          );
        }
      }
    }

    setFullName('');
    setSelectedFileURL(null);
    setEmail('');
    setLoading(false);
  };

  return (
    <Layout>
      <section className="flex flex-col max-w-full max-h-full md:flex-row md:pr-10 m-auto justify-center md:h-[700px] md:w-[650px] bg-white border text-[0.95rem] ">
        <div className="flex flex-col flex-1 items-start md:border-r border-b">
          <button
            onClick={() => setActiveBtn(ActiveBtn.EDITPROFILE)}
            className={`${
              activeBtn === ActiveBtn.EDITPROFILE
                ? 'bg-gray-100 activeEditProfileOrChangePassword'
                : ''
            } font-[500] py-4 hover:bg-gray-100 w-full`}
          >
            Edit profile
          </button>
          <button
            onClick={() => setActiveBtn(ActiveBtn.CHANGEPASSWORD)}
            className={`${
              activeBtn === ActiveBtn.CHANGEPASSWORD
                ? 'bg-gray-100 activeEditProfileOrChangePassword'
                : ''
            } font-[500] py-4 hover:bg-gray-100 w-full`}
          >
            Change password
          </button>
        </div>
        {activeBtn === ActiveBtn.EDITPROFILE ? (
          <div className="w-[400px] h-full mt-4">
            <h2 className="text-center text-xl py-4">Edit your profile</h2>
            <form className="h-full" onSubmit={updateYourProfile}>
              <div className="flex items-center flex-col justify-center">
                <img
                  className="w-40 h-40 object-cover rounded-full"
                  src={
                    selectedFileURL?.urlFile
                      ? selectedFileURL?.urlFile
                      : user?.photoURL ?? ''
                  }
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
                      onChange={addImageProfile}
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
                    required
                    value={fullName ?? ''}
                    onChange={e => setFullName(e.target.value)}
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
                    required
                    value={email ?? ''}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="mainColor  m-6 text-white bg-blue font-medium text-[0.8rem] py-1.5 px-4 rounded-md ">
                  <button type="submit">
                    {loading ? 'Sending...' : 'Submit'}
                  </button>
                </div>
                {error && <p>{error}</p>}
              </div>
            </form>
          </div>
        ) : (
          <ChangePassword user={user} />
        )}
      </section>
    </Layout>
  );
};

export default EditProfile;
