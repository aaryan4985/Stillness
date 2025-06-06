// src/pages/Home.jsx
import Sidebar from "../components/Sidebar";
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
        {/* Fixed Sidebar */}
        <Sidebar onMoodSelect={setSelectedMood} />

        {/* Main Content Area */}
        <div className="flex-1 ml-72">
          {/* Sticky Post Composer */}
          <PostComposer selectedMood={selectedMood} />

          {/* Scrollable Feed Area */}
          <main className="max-w-2xl mx-auto px-6 pb-8">
            <PostFeed selectedMood={selectedMood} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;