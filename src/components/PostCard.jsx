// src/components/PostCard.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!post.isAnonymous && post.userId) {
        const userDoc = await getDoc(doc(db, "users", post.userId));
        if (userDoc.exists()) {
          setAuthor(userDoc.data());
        }
      }
    };
    fetchAuthor();
  }, [post.userId, post.isAnonymous]);

  const isCurrentUser = auth.currentUser?.uid === post.userId;

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 text-white">
      <div className="flex items-center justify-between mb-2 text-sm text-white/60">
        <span>{post.mood}</span>
        <span>
          {new Date(post.createdAt?.toDate()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!post.isAnonymous && author && (
        <div className="flex items-center gap-3 mb-3">
          <img
            src={author.photoURL}
            alt="user"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-white text-sm font-medium">{author.displayName}</span>
        </div>
      )}

      <p className="text-white mb-3 whitespace-pre-wrap">{post.content}</p>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="rounded-lg max-h-[300px] w-full object-cover mt-2"
        />
      )}

      {post.isPrivate && isCurrentUser && (
        <p className="text-xs text-pink-400 mt-3">Private post (only you can see)</p>
      )}
    </div>
  );
};

export default PostCard;
