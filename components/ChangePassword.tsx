import { updatePassword, User } from 'firebase/auth';
import React, { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
  user: null | undefined | User;
}

const ChangePassword = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const updateYourPassword = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setLoading(false);
      return setError('Passwords are not the same"');
    }

    try {
      if (password && confirmPassword) {
        await updatePassword(user as User, confirmPassword).then(() =>
          setSuccess('Successfully updated')
        );
      }
    } catch (err) {
      setError(
        (err as { message?: string })?.message ?? 'Something went wrong'
      );
    }

    setLoading(false);
    setOldPassword('');
    setConfirmPassword('');
    setPassword('');
  };

  return (
    <form
      onSubmit={updateYourPassword}
      className="flex items-center justify-center mt-6 flex-col h-1/2 w-[400px] "
    >
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
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            required
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
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="py-3 px-6 flex gap-4 items-center border-md">
          <label className="font-[500] w-28" htmlFor="confirm-password">
            New password
          </label>
          <input
            className="bg-gray-100 border p-2"
            type="password"
            required
            id="confirm-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mainColor  m-6 text-white bg-blue font-medium text-[0.85rem] py-1.5 px-4 rounded-md ">
          <button type="submit">
            {loading ? 'sending...' : 'Change password'}
          </button>
        </div>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </div>
    </form>
  );
};

export default ChangePassword;
