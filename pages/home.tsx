import React from "react";
import Layout from "../components/Layout";
import BottomNav from "../components/BottomNav";
import Slider from "../components/Slider/Slider";
import Feed from "../components/Feed";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from "../components/Sidebar";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { RotatingLines } from "react-loader-spinner";

const home = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  if (loading)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="48"
          visible={true}
        />
      </div>
    );
  if (!user) router.push("/");
  console.log(user);
  return (
    <>
      {user && (
        <Layout>
          <Feed />
        </Layout>
      )}
    </>
  );
};

export default home;
