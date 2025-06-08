// src/components/MoodSelectorSidebar.jsx
import { useState, useEffect } from "react";
import { MOOD_OPTIONS } from "../constants";

const MoodSelectorSidebar = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [visibleMoods, setVisibleMoods] = useState(0);

  // Animate moods appearing one by one on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMoods(prev => {
        if (prev >= MOOD_OPTIONS.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 80); // Stagger delay between each mood

    return () => clearInterval(timer);
  }, []);

  const handleMoodClick = (mood) => {
    const newMood = mood === selectedMood ? null : mood;
    setSelectedMood(newMood);
    onMoodSelect?.(newMood);
  };

  return (
    <aside className="fixed right-0 top-0 h-screen w-80 bg-black/95 backdrop-blur-xl border-l border-white/20 flex flex-col py-6 px-6 text-white select-none overflow-hidden z-40">
      {/* Floating background orbs */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-white/8 to-white/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 -left-24 w-48 h-48 bg-gradient-to-tr from-white/5 to-white/2 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 right-1/3 w-56 h-56 bg-gradient-to-tl from-white/6 to-white/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-2/3 -right-16 w-32 h-32 bg-white/4 rounded-full blur-2xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extralight tracking-[0.4em] text-white/90 mb-3">
            CHOOSE MOOD
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
          <p className="text-xs font-extralight italic text-white/50 mt-4 tracking-wide">
            "Let your mood shape your feed"
          </p>
        </div>

        {/* Mood Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 max-w-full pb-4">
            {MOOD_OPTIONS.map((mood, index) => (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                className={`px-4 py-3 rounded-xl text-sm font-light border transition-all duration-500 transform hover:scale-105 hover:shadow-lg relative group
                  ${index < visibleMoods 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                  }
                  ${selectedMood === mood
                    ? "bg-white text-black border-white shadow-xl shadow-white/30 scale-105"
                    : "border-white/30 text-white/80 hover:border-white/50 hover:bg-white/10 hover:text-white/95 bg-white/5 backdrop-blur-sm"
                  }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                
                <span className="relative z-10 tracking-wide">
                  {mood}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          {selectedMood && (
            <div className="animate-fade-in">
              <p className="text-sm font-light text-white/70 tracking-wide">
                Current mood: <span className="text-white/90 font-medium">{selectedMood}</span>
              </p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-2"></div>
            </div>
          )}
          
          <p className="text-xs font-extralight text-white/40 tracking-wide">
            Select a mood to filter your experience
          </p>
        </div>
      </div>

      {/* Subtle animated border */}
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
    </aside>
  );
};

export default MoodSelectorSidebar;