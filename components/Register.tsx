import { Dispatch, SetStateAction, useState, useRef } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { useRouter } from "next/router";
import { TiDeleteOutline } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import useInput from "../hooks/use-input";
import { includesFunction } from "../lib/emailValidationFunc";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

interface Props {
  setLogin: Dispatch<SetStateAction<boolean>>;
  FacebookProvider: () => Promise<void>;
}

const Register = ({ setLogin, FacebookProvider }: Props) => {
  const router = useRouter();
  const [error, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailInputBlurHandler,
    reset: resetEmailInput,
  } = useInput(
    (value) =>
      value.trim() !== "" && includesFunction(value) && value.includes("@")
  );
  const {
    value: enteredFullName,
    isValid: enteredFullNameIsValid,
    hasError: fullNameInputHasError,
    valueChangeHandler: fullNameChangeHandler,
    valueBlurHandler: fullNameBlurHandler,
    reset: resetFullNameInput,
  } = useInput((value) => value.trim() !== "" && value.length <= 25);
  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangeHandler,
    valueBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput((value) => value.trim() !== "");
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== "" && value.length >= 7);

  let formIsValid = false;
  if (
    enteredEmailIsValid &&
    enteredPasswordIsValid &&
    enteredFullNameIsValid &&
    enteredUsernameIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formIsValid) {
      return;
    }

    const displayName = enteredFullName;
    const userName = enteredUsername;
    const email = enteredEmail;
    const password = enteredPassword;

    setLoading(true);
    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      try {
        //Update profile
        await updateProfile(res.user, {
          displayName: displayName,
          // userName: userName
        });

        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
        });

        router.replace("/home");
      } catch (err) {
        console.log(err);
        setErr(true);
        setLoading(false);
      }
    } catch (err) {
      setErr(true);
      setLoading(false);
    }

    resetEmailInput();
    resetPasswordInput();
    resetFullNameInput();
    resetUsernameInput();
  };

  // const activeKeystroke =
  //   enteredEmail &&
  //   "text-[0.7rem] top-[-14px] absolute left-0 pl-2.5 text-gray-400 transition-all";

  return (
    <div className="flex">
      <div className="flex flex-col w-[18.5rem] text-sm sm:min-w-[20.5rem] ">
        <div className="bg-white p-8 pb-5 pt-5 border border-gray-300">
          <form
            className="flex flex-col items-center text-[0.7rem]"
            onSubmit={submitHandler}
          >
            <h1 className="font-insta text-[3.5rem] p-8 mb-4">Instagram</h1>
            <h3 className="text-gray-400 text-[1rem] font-semibold text-lg text-center mb-4">
              Sign up to see photos and videos from your friends.
            </h3>
            <div className="flex items-center justify-center gap-1.5 mainColor text-white bg-blue font-medium text-[0.8rem] py-1.5 w-full rounded-md ">
              <AiFillFacebook className="h-5 w-5" />
              <button type="button" onClick={FacebookProvider}>
                Log in with Facebook
              </button>
            </div>
            <div>
              <p className="relative font-semibold text-gray-400 text-xs mt-4 mb-5 lineAfter lineBefore ">
                OR
              </p>
            </div>
            <div className="flex flex-col flex-1 w-full">
              <div className="relative">
                {/* <label htmlFor="email" className="relative"> */}
                {/* <span
                    className={`transition-all absolute top-[-2px] left-0 pl-2.5 text-gray-400 ${activeKeystroke}`}
                  >
                    Your email
                  </span> */}
                <input
                  className=" w-full bg-gray-100 border border-gray-300 p-2 mb-2 focus:outline-none focus:border-gray-400"
                  type="email"
                  placeholder="Your email"
                  onChange={emailChangeHandler}
                  onBlur={emailInputBlurHandler}
                  value={enteredEmail}
                  required
                />
                {/* </label> */}
                {emailInputHasError && (
                  <TiDeleteOutline className="w-7 h-7 absolute right-1 top-1 text-red-500" />
                )}

                {enteredEmailIsValid && (
                  <AiOutlineCheckCircle className="w-6 h-6 absolute right-1.5 top-2 text-gray-400" />
                )}
              </div>

              <div className="relative">
                <input
                  className=" w-full bg-gray-100 border border-gray-300 p-2 mb-2 focus:outline-none focus:border-gray-400"
                  type="text"
                  placeholder="Full Name"
                  onChange={fullNameChangeHandler}
                  onBlur={fullNameBlurHandler}
                  value={enteredFullName}
                  required
                />
                {fullNameInputHasError && (
                  <TiDeleteOutline className="w-7 h-7 absolute right-1 top-1 text-red-500" />
                )}

                {enteredFullNameIsValid && (
                  <AiOutlineCheckCircle className="w-6 h-6 absolute right-1.5 top-2 text-gray-400" />
                )}
              </div>
              <div className="relative">
                <input
                  className="w-full bg-gray-100 border border-gray-300 p-2 mb-2 focus:outline-none focus:border-gray-400"
                  type="text"
                  placeholder="Username"
                  onChange={usernameChangeHandler}
                  value={enteredUsername}
                  onBlur={usernameBlurHandler}
                  required
                />
                {usernameInputHasError && (
                  <TiDeleteOutline className="w-7 h-7 absolute right-1 top-1 text-red-500" />
                )}

                {enteredUsernameIsValid && (
                  <AiOutlineCheckCircle className="w-6 h-6 absolute right-1.5 top-2 text-gray-400" />
                )}
              </div>
              <div className="relative">
                <input
                  className="w-full bg-gray-100 border border-gray-300 p-2 focus:outline-none focus:border-gray-400"
                  type="password"
                  placeholder="Password"
                  onChange={passwordChangeHandler}
                  value={enteredPassword}
                  onBlur={passwordBlurHandler}
                  required
                />
                {passwordInputHasError && (
                  <TiDeleteOutline className="w-7 h-7 absolute right-1 top-1 text-red-500" />
                )}

                {enteredPasswordIsValid && (
                  <AiOutlineCheckCircle className="w-6 h-6 absolute right-1.5 top-2 text-gray-400" />
                )}
              </div>

              <div className="text-[0.67rem] text-center text-gray-400 mt-3">
                <p>
                  By signing up you agree to our terms.Learn how we collect, use
                  and share your data in our Privacy Policy and how we use
                  cookies and similar technology in our Cookies Policy .
                </p>
              </div>
              <button
                type="submit"
                disabled={!formIsValid}
                className="text-[0.8rem] flex-1 disabled:bg-[#bae6fd] mainColor text-white p-1 mt-3.5 rounded-[0.3rem] font-semibold cursor-pointer mb-4"
              >
                Register
              </button>
            </div>
          </form>
        </div>
        <div>
          <div className="flex items-center justify-center bg-white border border-gray-300 p-5 mt-3">
            <p>
              Have an account?
              <span
                onClick={() => setLogin(true)}
                className="text-[#0094f6] cursor-pointer"
              >
                {" "}
                Log in
              </span>
            </p>
          </div>
          <p className="text-center p-4">Get the app.</p>
          <div className="flex items-center justify-center gap-3 p-2">
            <a
              href="https://apps.apple.com/app/instagram/id389801252?vt=lo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white "
            >
              <img
                src="appleStore.png"
                alt=""
                className="w-36 h-10 object-cover blur-[0.5px] rounded-md"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D8B0FDD8C-6902-415F-9A4F-156B6F5F0548%26utm_content%3Dlo%26utm_medium%3Dbadge"
              className="text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="googlePlay.png"
                alt=""
                className="w-36 h-10 object-cover blur-[0.5px] rounded-md"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
