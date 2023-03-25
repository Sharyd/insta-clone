import type { NextPage } from 'next';
import { useState, useEffect, useContext } from 'react';
import Login from '../components/auth/Login';
import MobileImages from '../components/MobileImages';
import Register from '../components/auth/Register';
import Footer from '../components/layout/Footer';
import { auth, db } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  signInWithPopup,
  FacebookAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { doc, setDoc } from 'firebase/firestore';
import { ChatContext } from '../store/ChatContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home: NextPage = () => {
  const [login, setLogin] = useState(true);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const fbProvider = new FacebookAuthProvider();
  const { dispatch } = useContext(ChatContext);

  const FacebookProvider = async () => {
    try {
      const res = await signInWithPopup(auth, fbProvider);

      const credantial = FacebookAuthProvider.credentialFromResult(res);
      const token = credantial?.accessToken;
      let photoUrl = res.user.photoURL + '?height=500&access_token=' + token;

      await updateProfile(res.user, { photoURL: photoUrl });

      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        following: [],
        followers: [],
        photoURL: res.user.photoURL,
      });
      await setDoc(doc(db, 'userChat', res.user.uid), {});

      router.push('/home');
    } catch (error) {
      console.log(error);
    }
    dispatch({ type: 'CHANGE_USER', payload: {} });
  };

  useEffect(() => {
    if (user) {
      router.push('/home');
    } else {
      console.log('login');
    }
  }, [user]);

  return (
    <>
      {!user ? (
        <section className="bg-gray-100 min-h-screen flex flex-col p-2">
          <main className="flex flex-col items-center justify-end py-2 flex-1">
            <div className="flex justify-center items-center ">
              <MobileImages />
              {login && !user && (
                <Login
                  FacebookProvider={FacebookProvider}
                  setLogin={setLogin}
                />
              )}
              {!login && !user && (
                <Register
                  setLogin={setLogin}
                  FacebookProvider={FacebookProvider}
                />
              )}
            </div>
          </main>
          <Footer />
        </section>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default Home;
