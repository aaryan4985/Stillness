// src/components/PostCard.jsx
import React from "react";

const moodColors = {
  Calm: "bg-[#c3e4f2]",
  Grateful: "bg-[#fceeb5]",
  Anxious: "bg-[#f8c1c1]",
  Happy: "bg-[#c9f5d9]",
  Lonely: "bg-[#d8c8f0]",
};

const PostCard = ({ text, mood, expiresAt }) => {
  const timeLeft = Math.max((expiresAt - Date.now()) / 1000 / 60 / 60, 0).toFixed(1); // hours left

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl shadow-md ${moodColors[mood] || "bg-white"}`}
    >
      <p className="text-sm mb-2">{text}</p>
      <div className="text-xs text-gray-600 flex justify-between">
        <span>{mood}</span>
        <span>⏳ {timeLeft}h left</span>
      </div>
    </motion.div>
  );
};

export default PostCard;
