import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Login from "../components/Login";
import MobileImages from "../components/MobileImages";
import Register from "../components/Register";
import Footer from "../components/Footer";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  signInWithPopup,
  FacebookAuthProvider,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/router";
import { RotatingLines } from "react-loader-spinner";
import { doc, setDoc } from "firebase/firestore";
const Home: NextPage = () => {
  const [login, setLogin] = useState(true);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const fbProvider = new FacebookAuthProvider();

  const FacebookProvider = async () => {
    try {
      const res = await signInWithPopup(auth, fbProvider);

      const credantial = await FacebookAuthProvider.credentialFromResult(res);

      const token = credantial?.accessToken;
      let photoUrl = res.user.photoURL + "?height=500&access_token=" + token;
      await updateProfile(res.user, { photoURL: photoUrl });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
      });
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/home");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <>
      {!user ? (
        <section className="bg-gray-100 min-h-screen flex flex-col p-2">
          <main className="flex flex-col items-center justify-end py-2 flex-1">
            <div className="flex justify-center ">
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
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="48"
            visible={true}
          />
        </div>
      )}
    </>
  );
};

export default Home;
