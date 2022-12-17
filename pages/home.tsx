import React from 'react';
import Layout from '../components/Layout';
import BottomNav from '../components/BottomNav';
import Slider from '../components/Slider/Slider';
import Feed from '../components/Feed';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../components/Sidebar';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import { RotatingLines } from 'react-loader-spinner';
import LoadingSpinner from '../components/LoadingSpinner';

const home = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  if (loading) return <LoadingSpinner />;
  if (!user) router.push('/');

  return (
    <>
      {user && !loading && (
        <Layout>
          <Feed />
        </Layout>
      )}
    </>
  );
};

export default home;
