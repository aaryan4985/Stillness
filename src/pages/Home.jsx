// src/pages/Home.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PostInput from "../components/PostInput";
import PostFeed from "../components/PostFeed";

const Home = () => {
  const [selectedMood, setSelectedMood] = useState("");

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 fixed top-0 left-0 h-full z-20">
        <Sidebar selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6 max-w-2xl mx-auto">
        <PostInput selectedMood={selectedMood} />
        <div className="mt-8">
          <PostFeed selectedMood={selectedMood} />
        </div>
      </div>
    </div>
  );
};

export default Home;
