// src/components/PostComposer.jsx
import { useState } from "react";
import { db, auth, storage } from "../firebase/config";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MOOD_OPTIONS } from "../constants";
import { v4 as uuidv4 } from "uuid";

const PostComposer = () => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (!mood.trim()) {
      alert("Please select a mood.");
      return;
    }
    if (!content.trim() && !imageFile) {
      alert("Post must contain text or an image.");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const imageRef = ref(storage, `posts/${auth.currentUser.uid}/${uuidv4()}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000); // 24 hours later

      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        content: content.trim(),
        mood,
        imageUrl,
        isAnonymous,
        isPrivate,
        createdAt: serverTimestamp(),
        expiresAt,
      });

      // Reset form
      setContent("");
      setMood("");
      setImageFile(null);
      setIsAnonymous(true);
      setIsPrivate(false);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error posting:", error);
      alert("Failed to post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent("");
    setMood("");
    setImageFile(null);
    setIsAnonymous(true);
    setIsPrivate(false);
  };

  return (
    <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-lg border-b border-white/10 mb-1">
      {/* Background floating orbs */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/3 rounded-full blur-3xl"></div>
      <div className="absolute -top-5 right-1/3 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-2xl mx-auto px-6 py-4">
        <form onSubmit={handlePostSubmit} className="space-y-4">
          
          {/* Compact Header */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
                <span className="text-white/60 text-sm">✨</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <textarea
                rows={isExpanded ? 3 : 1}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={handleFocus}
                placeholder="Share your stillness..."
                className="w-full bg-transparent text-white/90 placeholder-white/40 resize-none focus:outline-none text-lg font-light tracking-wide leading-relaxed"
              />
            </div>
          </div>

          {/* Expanded Options */}
          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              
              {/* Mood Selection */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-extralight tracking-[0.1em] text-white/60 uppercase min-w-[60px]">
                  Mood
                </span>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="flex-1 bg-white/5 text-white/80 py-2 px-3 rounded-lg border border-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 text-sm font-light"
                  required
                >
                  <option value="" className="bg-black text-white/60">Select mood...</option>
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m} value={m} className="bg-black text-white">{m}</option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="flex items-center space-x-3">
                <span className="text-xs font-extralight tracking-[0.1em] text-white/60 uppercase min-w-[60px]">
                  Image
                </span>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-2 py-2 px-3 rounded-lg border border-white/20 hover:border-white/30 hover:bg-white/5 transition-all duration-300">
                    <span className="text-white/60 text-sm">📷</span>
                    <span className="text-white/60 text-sm font-light">
                      {imageFile ? imageFile.name : "Add image"}
                    </span>
                  </div>
                </label>
              </div>

              {/* Privacy Toggles */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border transition-all duration-300 ${
                        isAnonymous 
                          ? 'bg-white border-white' 
                          : 'border-white/30 hover:border-white/50'
                      }`}>
                        {isAnonymous && (
                          <svg className="w-3 h-3 text-black m-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-light text-white/70 group-hover:text-white/90 transition-colors">
                      Anonymous
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border transition-all duration-300 ${
                        isPrivate 
                          ? 'bg-white border-white' 
                          : 'border-white/30 hover:border-white/50'
                      }`}>
                        {isPrivate && (
                          <svg className="w-3 h-3 text-black m-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-light text-white/70 group-hover:text-white/90 transition-colors">
                      Private
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-xs font-light text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg transition-all duration-300 tracking-[0.1em]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || (!content.trim() && !imageFile) || !mood}
                    className="px-6 py-2 bg-white text-black text-xs font-light tracking-[0.1em] rounded-lg hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-white/20"
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Sharing...</span>
                      </div>
                    ) : (
                      "Share Stillness"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Compact Action Bar (when not expanded) */}
          {!isExpanded && content && (
            <div className="flex justify-end">
              <button
                onClick={handleFocus}
                className="text-xs font-light text-white/60 hover:text-white/80 transition-colors tracking-[0.1em]"
              >
                Continue writing...
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default PostComposer;