// src/pages/UserSetup.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import SplitText from "../components/SplitText";

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
  const [focusedField, setFocusedField] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) navigate("/signin");
  });

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-white/2 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-2xl space-y-8 flex flex-col items-center justify-center mx-auto">
        {/* Header */}
        <div className="text-center space-y-4">
          <SplitText
            text="STILLNESS"
            className="text-2xl font-light tracking-[0.3em] text-white/90"
          />
          <div className="w-16 h-px bg-white/30 mx-auto"></div>
          <SplitText
            text="Complete your journey"
            className="text-xl font-extralight tracking-wide text-white/80"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
        {/* Username */}
        <div className="space-y-3">
            <label className="block text-sm font-light text-white/70 tracking-wide">
                Username <span className="text-white/50">*</span>
            </label>
            <div className="relative group">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Choose your identity"
                    className={`w-full px-4 py-4 bg-white/5 border rounded-lg text-white placeholder-white/40 
                        font-light tracking-wide transition-all duration-300 focus:outline-none backdrop-blur-sm
                        ${focusedField === "username" ? "border-white/40 bg-white/10 shadow-lg" : "border-white/20 hover:border-white/30"}`}
                    required
                />
            </div>
        </div>

        {/* Profile Picture */}
        <div className="space-y-4">
            <p className="text-sm font-light text-white/70 tracking-wide">
                Choose your avatar
            </p>
            <div className="flex justify-center">
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {PFP_OPTIONS.map((pfp, index) => (
                        <div
                            key={pfp}
                            className={`relative transition-all duration-500 ${
                                selectedPfp === pfp ? "scale-110" : ""
                            }`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedPfp(pfp)}
                                className={`w-32 h-32 rounded-full border-3 transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                                    selectedPfp === pfp
                                        ? "border-white shadow-lg shadow-white/20"
                                        : "border-white/20 hover:border-white/40"
                                }`}
                            >
                                {/* Make the image fill the circle more by reducing padding and using object-cover */}
                                <img
                                    src={pfp}
                                    alt="Profile option"
                                    className="w-full h-full object-cover scale-150" // Increased scale for bigger image inside the circle
                                    draggable={false}
                                    style={{ objectPosition: "center" }} // Ensure image is centered
                                />
                            </button>
                            {selectedPfp === pfp && (
                                <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-pulse"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Mood Tags */}
          <div className="space-y-4">
            <p className="text-sm font-light text-white/70 tracking-wide">
              Express your current state
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {MOOD_OPTIONS.map((mood, index) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => toggleMood(mood)}
                  className={`px-4 py-2 rounded-full border font-light text-sm transition-all duration-300 transform hover:scale-105
                    ${
                      moods.includes(mood)
                        ? "bg-white text-black border-white shadow-lg shadow-white/20"
                        : "border-white/30 hover:border-white/50 hover:bg-white/5 backdrop-blur-sm"
                    }`}
                  style={{ transitionDelay: `${index * 20}ms` }}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-3">
            <label className="block text-sm font-light text-white/70 tracking-wide">
              Bio <span className="text-white/40">(optional)</span>
            </label>
            <div className="relative group">
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onFocus={() => setFocusedField("bio")}
                onBlur={() => setFocusedField("")}
                placeholder="Share your essence..."
                className={`w-full px-4 py-4 bg-white/5 border rounded-lg text-white placeholder-white/40 
                  font-light tracking-wide transition-all duration-300 focus:outline-none backdrop-blur-sm resize-none
                  ${focusedField === "bio" ? "border-white/40 bg-white/10 shadow-lg" : "border-white/20 hover:border-white/30"}`}
              />
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="space-y-4">
            <p className="text-sm font-light text-white/70 tracking-wide">
              Privacy preferences
            </p>
            <div className="space-y-4">
              <label className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={anonymousPosts}
                    onChange={() => setAnonymousPosts(!anonymousPosts)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full border transition-all duration-300 ${
                    anonymousPosts 
                      ? "bg-white/20 border-white/40" 
                      : "bg-white/5 border-white/20"
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ${
                      anonymousPosts ? "translate-x-6" : "translate-x-0.5"
                    } mt-0.5`}></div>
                  </div>
                </div>
                <span className="font-light text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                  Allow anonymous posts <span className="text-white/50">(recommended)</span>
                </span>
              </label>
              
              <label className="flex items-center space-x-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={privatePosts}
                    onChange={() => setPrivatePosts(!privatePosts)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full border transition-all duration-300 ${
                    privatePosts 
                      ? "bg-white/20 border-white/40" 
                      : "bg-white/5 border-white/20"
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ${
                      privatePosts ? "translate-x-6" : "translate-x-0.5"
                    } mt-0.5`}></div>
                  </div>
                </div>
                <span className="font-light text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                  Enable private posts
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative w-full py-4 bg-white text-black font-light tracking-[0.2em] 
              rounded-lg hover:bg-white/90 transition-all duration-300 overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`transition-opacity duration-300 ${submitting ? "opacity-0" : "opacity-100"}`}>
              {submitting ? "CREATING..." : "BEGIN JOURNEY"}
            </span>
            {submitting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Philosophy note */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-center text-xs text-white/30 font-extralight italic leading-relaxed">
            "Every beginning is a chance to discover who we truly are"
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;