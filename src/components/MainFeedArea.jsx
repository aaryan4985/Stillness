// src/components/MainFeedArea.jsx
const MainFeedArea = () => {
  return (
    <div className="ml-64 max-w-2xl mx-auto">
      {/* Posting area */}
      <div className="mb-6">
        <h2 className="text-xl font-light mb-2">Post your thoughts</h2>
        {/* PostInput component will go here */}
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
