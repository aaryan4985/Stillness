// src/components/PostInput.jsx
import { useState } from "react";
import { db, auth, storage } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const PostInput = ({ selectedMood }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePost = async () => {
    if (!text && !image) return;

    setUploading(true);

    let imageUrl = null;

    if (image) {
      const imageRef = ref(storage, `posts/${uuidv4()}-${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const user = auth.currentUser;

    const post = {
      userId: anonymous ? "anonymous" : user.uid,
      content: text,
      imageUrl,
      mood: selectedMood,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(
        new Date(Date.now() + 24 * 60 * 60 * 1000)
      ),
    };

    await addDoc(collection(db, "posts"), post);

    // Reset form
    setText("");
    setImage(null);
    setAnonymous(false);
    setUploading(false);
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 shadow">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Share your thoughts..."
        className="w-full bg-transparent text-white p-2 rounded outline-none border border-white/10 focus:ring-2 focus:ring-yellow-400"
      />

      <div className="flex justify-between items-center mt-3 gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm text-white/80"
        />

        <label className="flex items-center text-sm space-x-2">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <span>Post anonymously</span>
        </label>

        <button
          onClick={handlePost}
          disabled={uploading}
          className="ml-auto px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition"
        >
          {uploading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostInput;
