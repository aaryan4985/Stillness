// src/pages/Home.jsx
import Sidebar from "../components/Sidebar";
import MoodSelectorSidebar from "../components/MoodSelectorSidebar";
import PostComposer from "../components/PostComposer";
import PostFeed from "../components/PostFeed";
import { useState } from "react";

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background floating orbs for ambiance */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-white/2 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-20 left-1/3 w-48 h-48 bg-white/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex">
        {/* Left Sidebar (User Info) */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-72 mr-72">
          {/* Sticky Composer */}
          <PostComposer selectedMood={selectedMood} />

          {/* Feed */}
          <main className="max-w-2xl mx-auto px-6 pb-8">
            <PostFeed selectedMood={selectedMood} />
          </main>
        </div>

        {/* Right Sidebar (Mood Selector) */}
        <MoodSelectorSidebar onMoodSelect={setSelectedMood} />
      </div>
    </div>
  );
};

export default Home;
