// src/components/PostComposer.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { MOOD_OPTIONS } from "../constants";

const PostComposer = () => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [userMeta, setUserMeta] = useState({ username: "", selectedPfp: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { username, selectedPfp } = userSnap.data();
        setUserMeta({ username, selectedPfp });
      }
    };

    fetchUserData();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (!mood.trim()) return alert("Please select a mood.");
    if (!content.trim()) return alert("Please share your thoughts.");

    setSubmitting(true);

    try {
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000); // 24 hours

      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        username: userMeta.username || "User",
        selectedPfp: userMeta.selectedPfp || null,
        content: content.trim(),
        mood,
        privatePosts: isPrivate,
        createdAt: serverTimestamp(),
        expiresAt,
      });

      // Reset form
      setContent("");
      setMood("");
      setIsPrivate(false);
      setIsExpanded(false);
      setIsFocused(false);
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setIsFocused(false);
    setContent("");
    setMood("");
    setIsPrivate(false);
  };

  const getMoodColor = (selectedMood) => {
    const colors = {
      calm: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
      melancholy: 'border-purple-400/30 bg-purple-400/10 text-purple-300',
      reflective: 'border-teal-400/30 bg-teal-400/10 text-teal-300',
      hopeful: 'border-green-400/30 bg-green-400/10 text-green-300',
      anxious: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
      content: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
      nostalgic: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
      lonely: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300',
      peaceful: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
      heartbroken: 'border-red-400/30 bg-red-400/10 text-red-300',
      zen: 'border-gray-400/30 bg-gray-400/10 text-gray-300',
    };
    return colors[selectedMood?.toLowerCase()] || 'border-white/20 bg-white/5 text-white/70';
  };

  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/95 border-b border-white/[0.08]">
      {/* Floating orbs for ambiance */}
      <div className="absolute -top-16 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -top-8 right-1/3 w-20 h-20 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>

      <div className="relative max-w-2xl mx-auto px-4 py-4">
        <form onSubmit={handlePostSubmit}>
          {/* Main Composer Card */}
          <div className={`
            relative bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] 
            backdrop-blur-sm border transition-all duration-500 ease-out
            ${isExpanded 
              ? 'rounded-3xl border-white/20 shadow-2xl shadow-white/5 scale-[1.01]' 
              : 'rounded-2xl border-white/[0.08] hover:border-white/[0.15] hover:shadow-lg shadow-black/10'
            }
          `}>
            
            {/* Subtle glow effect */}
            <div className={`
              absolute inset-0 rounded-3xl bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02] 
              transition-opacity duration-500
              ${isFocused || isExpanded ? 'opacity-100' : 'opacity-0'}
            `}></div>

            <div className={`relative transition-all duration-300 ${
              isExpanded ? 'p-6' : 'p-4'
            }`}>
              {/* Header with Avatar and Input */}
              <div className="flex items-start gap-3">
                {/* Compact Avatar */}
                <div className="flex-shrink-0 relative">
                  {userMeta.selectedPfp ? (
                    <div className="relative">
                      <img
                        src={userMeta.selectedPfp}
                        alt="profile"
                        className={`object-cover border-2 border-white/10 shadow-md transition-all duration-300 ${
                          isExpanded ? 'w-12 h-12 rounded-xl' : 'w-10 h-10 rounded-lg'
                        }`}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 ${
                        isExpanded ? 'rounded-xl' : 'rounded-lg'
                      }`}></div>
                    </div>
                  ) : (
                    <div className={`bg-gradient-to-br from-white/15 via-white/8 to-white/5 border-2 border-white/10 flex items-center justify-center text-white/70 font-light shadow-md transition-all duration-300 ${
                      isExpanded ? 'w-12 h-12 rounded-xl text-lg' : 'w-10 h-10 rounded-lg text-base'
                    }`}>
                      ✨
                    </div>
                  )}
                  {/* Online indicator */}
                  <div className={`absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-black/80 shadow-sm transition-all duration-300 ${
                    isExpanded ? 'w-4 h-4' : 'w-3 h-3'
                  }`}></div>
                </div>

                {/* Main Input Area */}
                <div className="flex-1 space-y-3">
                  <textarea
                    rows={isExpanded ? 3 : 1}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Share your stillness..."
                    className={`w-full bg-transparent text-white/90 placeholder-white/40 resize-none focus:outline-none font-light tracking-wide leading-relaxed transition-all duration-300 ${
                      isExpanded ? 'text-lg' : 'text-base'
                    }`}
                  />

                  {/* Quick action hint for collapsed state */}
                  {!isExpanded && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>Click to expand</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                  )}

                  {/* Expanded Options */}
                  {isExpanded && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-400">
                      {/* Mood Selector */}
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium tracking-wider text-white/60 uppercase">
                            Choose your mood
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {MOOD_OPTIONS.map((moodOption) => (
                            <button
                              key={moodOption}
                              type="button"
                              onClick={() => setMood(moodOption)}
                              className={`
                                px-3 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm
                                transition-all duration-300 hover:scale-105 focus:outline-none
                                ${mood === moodOption 
                                  ? getMoodColor(moodOption) + ' ring-1 ring-current/30 shadow-md' 
                                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8 hover:text-white/80'
                                }
                              `}
                            >
                              {moodOption}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                        {/* Privacy Toggle */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPrivate(!isPrivate)}
                            className={`
                              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                              transition-all duration-300 border backdrop-blur-sm
                              ${isPrivate 
                                ? 'border-amber-400/30 bg-amber-400/10 text-amber-300' 
                                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
                              }
                            `}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                            </svg>
                            Private
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-1.5 text-xs font-medium text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg transition-all duration-300"
                          >
                            Cancel
                          </button>
                          
                          <button
                            type="submit"
                            disabled={submitting || !content.trim() || !mood}
                            className="group relative px-4 py-1.5 bg-gradient-to-r from-white to-white/90 text-black text-xs font-medium rounded-lg hover:shadow-md hover:shadow-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
                          >
                            {/* Button glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="relative flex items-center gap-1.5">
                              {submitting ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                  <span>Sharing...</span>
                                </>
                              ) : (
                                <>
                                  <span>Share</span>
                                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                </>
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expand Hint for Collapsed State with Content */}
              {!isExpanded && content && (
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    onClick={handleFocus}
                    className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white/70 transition-colors duration-300 px-3 py-1.5 rounded-full hover:bg-white/5"
                  >
                    <span>Continue writing</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostComposer;