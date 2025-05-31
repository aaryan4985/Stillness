import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const moods = ["Calm", "Grateful", "Anxious", "Happy", "Lonely"];

const PostBox = () => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Calm");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db, "posts"), {
      text,
      mood,
      timestamp: serverTimestamp(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    setText("");
    setMood("Calm");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What’s on your mind?"
        className="w-full resize-none p-2 rounded-md border bg-gray-50"
        maxLength={280}
        rows={3}
      />
      <div className="flex justify-between items-center mt-3">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="text-sm rounded bg-gray-100 p-1"
        >
          {moods.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <span className="text-xs text-gray-500">{text.length}/280</span>
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-1 rounded-full text-sm hover:opacity-90"
        >
          Let it go
        </button>
      </div>
    </div>
  );
};

export default PostBox;
