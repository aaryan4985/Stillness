// src/components/Sidebar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { MOOD_OPTIONS } from "../constants"; // or define it here

const Sidebar = () => {
  const [selectedMood, setSelectedMood] = useState("Calm");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <aside className="w-64 min-h-screen bg-white/5 p-6 border-r border-white/10 fixed">
      <div className="mb-6">
        <h2 className="text-xl font-light mb-2">Welcome, User</h2>
        <p className="text-sm text-white/70">What's your current mood?</p>
        <div className="mt-3 space-y-2">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                selectedMood === mood
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm">
          Home
        </button>
        <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm">
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
