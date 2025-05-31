// src/components/MainFeedArea.jsx
import PostInput from "./PostInput";
import PostFeed from "./PostFeed";

const MainFeedArea = ({ selectedMood }) => {
  return (
    <div className="ml-64 max-w-2xl mx-auto py-8 px-4">
      <PostInput selectedMood={selectedMood} />
      <div className="mt-6">
        <PostFeed selectedMood={selectedMood} />
      </div>
    </div>
  );
};

export default MainFeedArea;
