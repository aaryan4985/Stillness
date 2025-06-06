// src/pages/Home.jsx
import Sidebar from "../components/Sidebar";
import PostInput from "../components/PostInput";
import PostFeed from "../components/PostFeed";
import { useState } from "react";

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div className="flex">
      <Sidebar selectedMood={selectedMood} setSelectedMood={setSelectedMood} />

      <main className="ml-64 p-6 flex-1 max-w-3xl">
        <PostInput selectedMood={selectedMood} />
        <PostFeed selectedMood={selectedMood} />
      </main>
    </div>
  );
};

export default Home;
