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

    return () => unsubscribe();
  }, []);

  const filteredPosts = selectedMood
    ? [
        ...posts.filter((post) => post.mood === selectedMood),
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
        filteredPosts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

const Post = ({ post }) => {
  const timestamp = post.createdAt?.toDate
    ? new Date(post.createdAt.toDate()).toLocaleString()
    : "Just now";

  const isAnonymous = post.anonymousPosts;
  const username = isAnonymous ? "Anonymous" : post.username || "User";
  const avatarSrc = isAnonymous
    ? null
    : post.selectedPfp || null;

  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 bg-white/20 text-white flex items-center justify-center rounded-full font-semibold text-lg">
              {isAnonymous ? "?" : username.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Username & Mood */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span className={isAnonymous ? "italic font-light text-white/60" : "font-medium"}>
                {username}
              </span>
              <span className="text-white/40 text-xs">· {timestamp}</span>
            </div>
            <span className="text-[11px] text-white/40 uppercase tracking-wider">
              {post.mood}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-white/90 text-[15px] whitespace-pre-wrap mb-3">{post.content}</p>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post visual"
          className="rounded-lg max-h-64 object-cover w-full border border-white/10"
        />
      )}

      {/* Meta */}
      {post.privatePosts && (
        <p className="text-xs mt-3 text-yellow-400 italic">Private Post</p>
      )}
    </div>
  );
};

export default PostFeed;
