// src/components/PostFeed.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const PostFeed = ({ selectedMood }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // Listen to posts realtime
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(allPosts);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
        setLoading(false);
      }
    );

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  // Separate posts based on mood selection
  const filteredPosts = selectedMood
    ? [
        // Posts matching selected mood first
        ...posts.filter((post) => post.mood === selectedMood),
        // Then posts not matching
        ...posts.filter((post) => post.mood !== selectedMood),
      ]
    : posts;

  if (loading) return <p className="text-white text-center py-4">Loading posts...</p>;
  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-6 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {filteredPosts.length === 0 ? (
        <p className="text-white/60 text-center py-4">No posts yet.</p>
      ) : (
        filteredPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

// Simple Post component example
const Post = ({ post }) => {
  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-light text-white/70 uppercase">{post.mood}</span>
        <span className="text-[10px] text-white/50">
          {post.createdAt?.toDate
            ? post.createdAt.toDate().toLocaleString()
            : "Just now"}
        </span>
      </div>
      <p className="text-white text-sm whitespace-pre-wrap">{post.content}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post image"
          className="mt-3 rounded-md max-h-64 object-contain"
        />
      )}
      <div className="mt-2 text-xs text-white/50">
        {post.isAnonymous ? "Anonymous" : post.userId}
        {post.isPrivate && " • Private"}
      </div>
    </div>
  );
};

export default PostFeed;
