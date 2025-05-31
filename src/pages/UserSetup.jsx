// src/pages/UserSetup.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

const PFP_OPTIONS = [
  "/assets/1 (1).jpg",
  "/assets/1 (2).jpg",
  "/assets/1 (4).jpg",
  "/assets/1 (5).jpg",
  "/assets/1 (6).jpg",
  "/assets/1 (7).jpg",
];

const MOOD_OPTIONS = [
  "Calm", "Reflective", "Melancholy", "Hopeful", "Anxious", "Content",
  "Lonely", "Nostalgic", "Peaceful", "Burnt Out", "Overwhelmed",
  "Motivated", "Detached", "Grateful", "In Love", "Heartbroken",
  "Inspired", "Zen",
];

const UserSetup = () => {
  const [username, setUsername] = useState("");
  const [selectedPfp, setSelectedPfp] = useState(PFP_OPTIONS[0]);
  const [moods, setMoods] = useState([]);
  const [bio, setBio] = useState("");
  const [anonymousPosts, setAnonymousPosts] = useState(true);
  const [privatePosts, setPrivatePosts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) navigate("/signin");
  }, []);

  const toggleMood = (mood) => {
    setMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      alert("Username is required.");
      return;
    }

    setSubmitting(true);

    const userData = {
      username: trimmedUsername,
      selectedPfp,
      moods,
      bio: bio.trim(),
      anonymousPosts,
      privatePosts,
    };

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, userData);
      alert("Setup complete!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save setup.");
    } finally {
      setSubmitting(false);
    }
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
                    ? "border-yellow-400 ring-2 ring-yellow-400 shadow-md"
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

        {/* Mood Tags */}
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
            Bio <span className="text-white/40">(optional)</span>
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

        {/* Privacy Toggles */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg font-light tracking-wide transition-colors duration-300 ${
            submitting
              ? "bg-yellow-200 text-black cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-500"
          }`}
        >
          {submitting ? "Saving..." : "Complete Setup"}
        </button>
      </form>
    </div>
  );
};

export default UserSetup;
