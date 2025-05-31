// src/components/MainFeedArea.jsx
import PostInput from "./PostInput";

const MainFeedArea = ({ selectedMood = "Calm" }) => {
  return (
    <div className="ml-64 max-w-2xl mx-auto">
      {/* Posting area */}
      <div className="mb-6">
        <PostInput selectedMood={selectedMood} />
      </div>

      {/* Feed area */}
      <div>
        <h2 className="text-lg font-light mb-3">Your mood-based feed</h2>
        {/* PostFeed component will go here */}
      </div>
    </div>
  );
};

export default MainFeedArea;
