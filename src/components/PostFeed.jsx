// src/components/PostFeed.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const PostFeed = ({ selectedMood }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Create query to get posts - either public posts or private posts by current user
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter posts based on privacy settings
        const visiblePosts = allPosts.filter(post => {
          // If post is not private, show it to everyone
          if (!post.privatePosts) {
            return true;
          }
          // If post is private, only show to the author
          if (post.privatePosts && user && post.userId === user.uid) {
            return true;
          }
          // Hide private posts from other users
          return false;
        });

        setPosts(visiblePosts);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredPosts = selectedMood
    ? [
        ...posts.filter((post) => post.mood === selectedMood),
        ...posts.filter((post) => post.mood !== selectedMood),
      ]
    : posts;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm animate-pulse">Loading your stillness...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Clean Feed Container */}
      <div 
        className="h-full overflow-y-auto px-1 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent'
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
          }
        `}</style>
        
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white/70 text-lg font-medium mb-3">The silence speaks volumes</h3>
            <p className="text-white/50 text-sm max-w-sm leading-relaxed">
              Be the first to share your stillness. Your thoughts matter in this quiet space.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {filteredPosts.map((post, index) => (
              <Post 
                key={post.id} 
                post={post} 
                index={index}
                isHighlighted={selectedMood && post.mood === selectedMood}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Post = ({ post, index, isHighlighted, currentUser }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const timestamp = post.createdAt?.toDate
    ? new Date(post.createdAt.toDate()).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : "Just now";

  const isAnonymous = post.anonymousPosts;
  const username = isAnonymous ? "Anonymous" : post.username || "User";
  const avatarSrc = isAnonymous ? null : post.selectedPfp || null;
  const isOwnPost = currentUser && post.userId === currentUser.uid;

  const getMoodColor = (mood) => {
    const colors = {
      calm: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      melancholy: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      reflective: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
      hopeful: 'text-green-400 bg-green-400/10 border-green-400/20',
      anxious: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
      content: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      nostalgic: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      lonely: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
      peaceful: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
      heartbroken: 'text-red-400 bg-red-400/10 border-red-400/20',
      zen: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    };
    return colors[mood?.toLowerCase()] || 'text-white/60 bg-white/5 border-white/10';
  };

  return (
    <div 
      className={`
        transform transition-all duration-600 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
        ${isHighlighted ? 'scale-[1.01] ring-1 ring-white/20 shadow-xl shadow-white/5' : ''}
        ${post.privatePosts ? 'ring-1 ring-amber-400/20' : ''}
      `}
    >
      <article className={`
        group relative backdrop-blur-sm rounded-2xl border overflow-hidden shadow-lg shadow-black/10 transition-all duration-400
        ${post.privatePosts 
          ? 'bg-gradient-to-br from-amber-500/[0.08] via-amber-400/[0.04] to-amber-300/[0.02] border-amber-400/[0.15] hover:border-amber-400/[0.25] hover:from-amber-500/[0.12] hover:via-amber-400/[0.06] hover:to-amber-300/[0.03]' 
          : 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.05] hover:border-white/[0.12] hover:from-white/[0.05] hover:to-white/[0.02]'
        }
      `}>
        
        <div className="relative p-6">
          {/* Header with privacy indicator */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] group-hover:border-white/[0.15] transition-all duration-300 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-white/[0.03] text-white flex items-center justify-center rounded-xl font-medium text-base border border-white/[0.08] group-hover:border-white/[0.15] transition-all duration-300 shadow-sm">
                    {isAnonymous ? "?" : username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`
                    text-white/90 text-base font-medium tracking-wide truncate
                    ${isAnonymous ? 'italic font-normal text-white/70' : ''}
                  `}>
                    {username}
                    {isOwnPost && <span className="text-white/50 text-sm ml-2">(You)</span>}
                  </span>
                  <span className="text-white/30 text-sm">•</span>
                  <span className="text-white/50 text-sm">{timestamp}</span>
                </div>
                
                {/* Mood badge */}
                <div className={`
                  inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm w-fit
                  ${getMoodColor(post.mood)}
                `}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                  <span className="capitalize tracking-wide">{post.mood}</span>
                </div>
              </div>
            </div>

            {/* Privacy indicator - moved to top right */}
            {post.privatePosts && (
              <div className="flex items-center gap-2 text-amber-400/80 text-xs px-3 py-1.5 bg-amber-400/[0.08] rounded-full border border-amber-400/20 backdrop-blur-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                </svg>
                <span className="font-medium">Private</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-white/85 text-base leading-relaxed whitespace-pre-wrap font-light tracking-wide">
              {post.content}
            </p>

            {/* Image */}
            {post.imageUrl && (
              <div className="relative rounded-xl overflow-hidden border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-300 shadow-md">
                <img
                  src={post.imageUrl}
                  alt="post visual"
                  className="w-full max-h-80 object-cover transition-transform duration-400 group-hover:scale-[1.01]"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* Subtle border animation for private posts */}
        {post.privatePosts && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-amber-400/5 to-transparent animate-pulse"></div>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostFeed;