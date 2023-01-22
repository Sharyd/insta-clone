import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Layout from '../components/layout/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateEmail, updateProfile } from 'firebase/auth';
import ChangePassword from '../components/ChangePassword';
import { isImageValid } from '../helpers/isImageValid';
import { doc, updateDoc } from 'firebase/firestore';
import useSnapshot from '../hooks/use-snapshot';
import { useRecoilState } from 'recoil';
import { updateUser } from '../atoms/userAtom';

enum ActiveBtn {
  EDITPROFILE,
  CHANGEPASSWORD,
}

const EditProfile = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUserUpdated, setIsUserUpdated] = useRecoilState(updateUser);

  const [fullName, setFullName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);

  const [activeBtn, setActiveBtn] = useState(ActiveBtn.EDITPROFILE);
  const refFileToElement = useRef<HTMLInputElement>(null);
  const [selectedFileURL, setSelectedFileURL] = useState<any>({});

  const addImageProfile = (e: { target: { files: any } }) => {
    const files = e.target.files[0] as Blob;
    const type = files?.type as string;

    if (isImageValid(type)) {
      setSelectedFileURL({
        imageToPreview: URL.createObjectURL(e.target.files[0]),
        imageToDB: e.target.files[0],
      });
      setError('');
    } else {
      setError('Wrong image format!');
    }
  };

  const updateUserProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const storageRef = ref(
      storage,
      `/profileImg/${user?.uid}/${selectedFileURL?.imageToDB?.name}`
    );

    if (user) {
      if (selectedFileURL?.imageToDB) {
        try {
          await uploadBytesResumable(
            storageRef,
            selectedFileURL.imageToDB
          ).then(() => {
            getDownloadURL(storageRef).then(async downloadURL => {
              await updateProfile(user, {
                photoURL: downloadURL,
              });
            });
          });
        } catch (err) {
          setError(
            (err as { message?: string })?.message ?? 'Something went wrong'
          );
          setLoading(false);
        }
      }
      if (email || fullName) {
        try {
          await updateProfile(user, {
            displayName: fullName,
          });
          await updateEmail(user, email ?? '');
        } catch (err) {
          setError(
            (err as { message?: string })?.message ?? 'Something went wrong'
          );
          setLoading(false);
        }
      }

      setSuccess('Successfully updated!');
    }
    setIsUserUpdated(true);
    setError('');
    setFullName('');
    setSelectedFileURL(null);
    setEmail('');
    setLoading(false);
  };

  const updateUsers = useCallback(async () => {
    try {
      await updateDoc(doc(db, 'users', user?.uid ?? ''), {
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        email: user?.email,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (isUserUpdated && user) {
      updateUsers();
      () => setIsUserUpdated(false);
    }
  }, [isUserUpdated, updateUsers, user]);

  return (
    <Layout>
      <section className="p-2 m-auto">
        <div className="mt-16 sm:mt-0 flex flex-col max-w-full max-h-full md:flex-row md:pr-10 justify-center md:h-[700px] md:w-[650px] bg-white border text-[0.95rem] ">
          <div className="flex flex-col flex-1 items-center md:border-r border-b">
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
              <form className="h-full" onSubmit={updateUserProfile}>
                <div className="flex items-center flex-col justify-center">
                  <img
                    className="w-40 h-40 object-cover rounded-full"
                    src={
                      selectedFileURL?.imageToPreview
                        ? selectedFileURL?.imageToPreview
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
                      {loading ? 'Updating...' : 'Submit'}
                    </button>
                  </div>
                  {error && <p className="text-red-500 capitalize">{error}</p>}
                  {success && <p className="capitalize">{success}</p>}
                </div>
              </form>
            </div>
          ) : (
            <ChangePassword user={user} />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EditProfile;
