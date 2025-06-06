// src/components/PostFeed.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

const PostFeed = ({ selectedMood }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedMood) return;

    const now = Timestamp.now();
    const postsRef = collection(db, "posts");

    const q = query(
      postsRef,
      where("mood", "==", selectedMood),
      where("expiresAt", ">", now),
      orderBy("expiresAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedMood]);

  if (!selectedMood) {
    return (
      <div className="text-center py-10 text-white/60">
        Please select a mood from the sidebar.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-white/70">
        <Loader2 className="animate-spin inline mr-2" />
        Loading posts...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-white/60">
        No posts yet for <strong>{selectedMood}</strong> mood.
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white/5 p-4 rounded-lg border border-white/10 shadow"
        >
          <div className="text-sm text-white/60 mb-1">
            {post.userId === "anonymous" ? "Anonymous" : "User"} ·{" "}
            {formatDistanceToNow(post.createdAt?.toDate?.() || new Date(), {
              addSuffix: true,
            })}
          </div>

          <div className="text-white text-base whitespace-pre-line mb-2">
            {post.content}
          </div>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Uploaded"
              className="rounded-lg max-h-96 object-cover border border-white/10"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
