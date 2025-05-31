import React from "react";
import TopBar from "../components/TopBar";
import PostBox from "../components/PostBox";
import Feed from "../components/Feed";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fefefe] text-gray-800 transition-colors duration-300">
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <PostBox />
        <Feed />
      </main>
    </div>
  );
};

export default Home;
