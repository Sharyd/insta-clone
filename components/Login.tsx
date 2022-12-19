import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { AiFillFacebook } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import useInput from '../hooks/use-input';
import { includesFunction } from '../lib/emailValidationFunc';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface Props {
  setLogin: Dispatch<SetStateAction<boolean>>;
  FacebookProvider: () => Promise<void>;
}

const Login = ({ setLogin, FacebookProvider }: Props) => {
  const [error, setError] = useState(false);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailInputBlurHandler,
    reset: resetEmailInput,
  } = useInput(
    value =>
      value.trim() !== '' && includesFunction(value) && value.includes('@')
  );
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput(value => value.trim() !== '' && value.length >= 6);

  let formIsValid = false;
  if (enteredEmailIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formIsValid) {
      return;
    }

    const email = enteredEmail;
    const password = enteredPassword;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError(true);
    }

    router.replace('/home');

    resetEmailInput();
    resetPasswordInput();
  };

  return (
    <div className="flex flex-col w-[18.5rem] text-sm sm:min-w-[20.5rem] ">
      <div className="bg-white p-10 pb-5 pt-5 border border-gray-300">
        <form className="flex flex-col items-center" onSubmit={submitHandler}>
          <h1 className="font-insta text-[3.5rem] p-8 mb-8">Instagram</h1>
          <div className="flex flex-col flex-1 w-full text-[0.7rem]">
            <div className="relative">
              <input
                className="w-full bg-gray-100 border border-gray-300 p-2 mb-2 focus:outline-none focus:border-gray-500"
                type="email"
                placeholder="Your email"
                onChange={emailChangeHandler}
                onBlur={emailInputBlurHandler}
                value={enteredEmail}
                required
              />
              {emailInputHasError && (
                <TiDeleteOutline className="w-7 h-7 absolute right-1 top-1 text-red-500" />
              )}

              {enteredEmailIsValid && (
                <AiOutlineCheckCircle className="w-6 h-6 absolute right-1.5 top-2 text-gray-400" />
              )}
            </div>
            <div className="relative">
              <input
                className="w-full bg-gray-100 border border-gray-300 p-2 focus:outline-none focus:border-gray-500"
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
            {error && <p>Something went wrong.</p>}
            <button
              type="submit"
              disabled={!formIsValid}
              className="text-[0.9rem] flex-1 bg-[#0094f6] disabled:bg-[#bae6fd] text-white p-1 mt-3.5 rounded-[0.3rem] font-semibold cursor-pointer"
            >
              Log in
            </button>
          </div>
          <div>
            <p className="relative font-semibold text-gray-400 text-xs mt-4 mb-5 lineAfter lineBefore ">
              OR
            </p>
          </div>
          <div
            onClick={FacebookProvider}
            className="cursor-pointer flex items-center gap-1.5 text-[#32508d] font-medium "
          >
            <AiFillFacebook className="h-5 w-5" />
            <button type="button">Log in with Facebook</button>
          </div>
          <p className="cursor-pointer text-xs mt-5 mb-0 text-[#173e8a] inset-[#427aeb]">
            Forgot password?
          </p>
        </form>
      </div>
      <div>
        <div className="flex items-center justify-center bg-white border border-gray-300 p-5 mt-3">
          <p>
            Don't have an account?
            <span
              onClick={() => setLogin(false)}
              className=" text-[#0094f6] cursor-pointer"
            >
              {' '}
              Sign up
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
  );
};

export default Login;
