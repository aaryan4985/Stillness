// src/pages/UserSetup.jsx
import { useState } from "react";

const PFP_OPTIONS = [
  "/assets/1 (1).jpg",
  "/assets/1 (2).jpg",
  "/assets/1 (4).jpg",
  "/assets/1 (5).jpg",
  "/assets/1 (6).jpg",
  "/assets/1 (7).jpg",
];

const MOOD_OPTIONS = [
  "Calm",
  "Reflective",
  "Melancholy",
  "Hopeful",
  "Anxious",
  "Content",
];

const UserSetup = () => {
  const [username, setUsername] = useState("");
  const [selectedPfp, setSelectedPfp] = useState(PFP_OPTIONS[0]);
  const [moods, setMoods] = useState([]);
  const [bio, setBio] = useState("");
  const [anonymousPosts, setAnonymousPosts] = useState(true);
  const [privatePosts, setPrivatePosts] = useState(false);

  const toggleMood = (mood) => {
    setMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Username is required.");
      return;
    }
    // Here you would typically save to Firestore or your backend
    console.log({
      username,
      selectedPfp,
      moods,
      bio,
      anonymousPosts,
      privatePosts,
    });
    alert("Setup complete! (Saving logic to be added)");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-3xl font-light mb-8 tracking-widest">User Setup</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-8 bg-white/5 p-8 rounded-xl backdrop-blur-md"
      >
        {/* Username */}
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-light">
            Username <span className="text-yellow-400">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className="w-full rounded-md p-3 bg-white/10 border border-white/20 focus:outline-none focus:border-yellow-400"
            required
          />
        </div>

        {/* Profile Picture */}
        <div>
          <p className="mb-2 font-light text-sm">Choose a profile picture</p>
          <div className="flex space-x-4 overflow-x-auto">
            {PFP_OPTIONS.map((pfp) => (
              <button
                type="button"
                key={pfp}
                onClick={() => setSelectedPfp(pfp)}
                className={`w-16 h-16 rounded-full border-2 transition-all duration-300 ${
                  selectedPfp === pfp
                    ? "border-yellow-400 shadow-lg"
                    : "border-white/20 hover:border-yellow-400"
                }`}
              >
                <img
                  src={pfp}
                  alt="Profile option"
                  className="w-full h-full object-cover rounded-full"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Moods */}
        <div>
          <p className="mb-2 font-light text-sm">Select your mood(s)</p>
          <div className="flex flex-wrap gap-3">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => toggleMood(mood)}
                className={`px-4 py-2 rounded-full border-2 font-light text-sm transition-all duration-300
                  ${
                    moods.includes(mood)
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "border-white/20 hover:border-yellow-400"
                  }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block mb-2 text-sm font-light">
            Bio (optional)
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share a little about yourself..."
            className="w-full rounded-md p-3 bg-white/10 border border-white/20 focus:outline-none focus:border-yellow-400 resize-none"
          />
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              id="anonymousPosts"
              type="checkbox"
              checked={anonymousPosts}
              onChange={() => setAnonymousPosts(!anonymousPosts)}
              className="w-5 h-5 text-yellow-400 bg-black border-white/30 rounded focus:ring-yellow-400"
            />
            <label htmlFor="anonymousPosts" className="font-light text-sm">
              Allow posts to be anonymous (recommended)
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              id="privatePosts"
              type="checkbox"
              checked={privatePosts}
              onChange={() => setPrivatePosts(!privatePosts)}
              className="w-5 h-5 text-yellow-400 bg-black border-white/30 rounded focus:ring-yellow-400"
            />
            <label htmlFor="privatePosts" className="font-light text-sm">
              Allow private posts visible only to me
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-yellow-400 text-black font-light tracking-wide rounded-lg hover:bg-yellow-500 transition-colors duration-300"
        >
          Complete Setup
        </button>
      </form>
    </div>
  );
};

export default UserSetup;
