// src/components/MoodSelectorSidebar.jsx
import { useState } from "react";
import { MOOD_OPTIONS } from "../constants";

const MoodSelectorSidebar = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodClick = (mood) => {
    const newMood = mood === selectedMood ? null : mood; // toggle if clicked again
    setSelectedMood(newMood);
    onMoodSelect?.(newMood);
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-72 bg-black backdrop-blur-sm border-l border-white/20 flex flex-col items-center py-8 px-6 text-white select-none overflow-hidden z-50">
      {/* Background floating orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 right-1/2 w-60 h-60 bg-white/3 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full w-full space-y-6">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-lg font-extralight tracking-[0.2em] text-white/80">
            Choose Mood
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2"></div>
        </div>

        {/* Mood Buttons */}
        <div className="w-full flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="flex flex-wrap justify-center gap-2">
            {MOOD_OPTIONS.map((mood, index) => (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                className={`px-4 py-2 rounded-full text-xs font-light border transition-all duration-300 transform hover:scale-105
                  ${
                    selectedMood === mood
                      ? "bg-white text-black border-white shadow-lg shadow-white/20"
                      : "border-white/30 text-white/80 hover:border-white/50 hover:bg-white/5 hover:text-white/90"
                  }`}
                style={{
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-auto">
          <p className="text-xs font-extralight italic text-white/40 tracking-wide">
            "Let your mood shape your feed"
          </p>
        </div>
      </div>
    </aside>
  );
};

export default MoodSelectorSidebar;
