import { useEffect, useState } from "react";

// Mood to flower mapping with colors, shapes, and symbols
const moodFlowers = {
  calm: { color: "bg-blue-400", symbol: "🌸", shape: "rounded-full", glow: "shadow-blue-400/50" },
  melancholy: { color: "bg-purple-500", symbol: "🥀", shape: "rounded-full", glow: "shadow-purple-500/50" },
  reflective: { color: "bg-teal-400", symbol: "🌺", shape: "rounded-full", glow: "shadow-teal-400/50" },
  hopeful: { color: "bg-green-400", symbol: "🌻", shape: "rounded-full", glow: "shadow-green-400/50" },
  anxious: { color: "bg-orange-400", symbol: "🌼", shape: "rounded-full", glow: "shadow-orange-400/50" },
  content: { color: "bg-emerald-400", symbol: "🌷", shape: "rounded-full", glow: "shadow-emerald-400/50" },
  nostalgic: { color: "bg-yellow-400", symbol: "🌙", shape: "rounded-full", glow: "shadow-yellow-400/50" },
  lonely: { color: "bg-indigo-500", symbol: "🌹", shape: "rounded-full", glow: "shadow-indigo-500/50" },
  peaceful: { color: "bg-cyan-400", symbol: "🏵️", shape: "rounded-full", glow: "shadow-cyan-400/50" },
  heartbroken: { color: "bg-red-500", symbol: "💔", shape: "rounded-full", glow: "shadow-red-500/50" },
  zen: { color: "bg-gray-400", symbol: "🕉️", shape: "rounded-full", glow: "shadow-gray-400/50" },
};

// Generate random position for organic garden layout
const generatePosition = (index) => {
  const seed = index * 137.508; // Golden angle for natural distribution
  const radius = Math.sqrt(index) * 40;
  const angle = seed * (Math.PI / 180);
  
  return {
    x: Math.cos(angle) * radius + Math.random() * 100 - 50,
    y: Math.sin(angle) * radius + Math.random() * 100 - 50,
  };
};

// Flower component with hover interactions
const Flower = ({ post, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position] = useState(() => generatePosition(index, 100));
  
  const flower = moodFlowers[post.mood?.toLowerCase()] || moodFlowers.calm;
  const createdAt = new Date(post.createdAt?.seconds * 1000 || Date.now());
  
  return (
    <div
      className="absolute transition-all duration-700 ease-out cursor-pointer"
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1}) rotate(${isHovered ? 5 : 0}deg)`,
        animationDelay: `${index * 150}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(post)}
    >
      {/* Flower stem */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div className="w-1 h-12 bg-green-500/60 rounded-full"></div>
      </div>
      
      {/* Flower bloom */}
      <div
        className={`
          w-16 h-16 ${flower.color} ${flower.shape} ${flower.glow}
          flex items-center justify-center text-2xl
          shadow-lg animate-pulse
          transition-all duration-500
          ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
        `}
        style={{
          animation: `flowerGrow 0.8s ease-out ${index * 150}ms both, 
                     gentle-sway 4s ease-in-out infinite ${index * 200}ms`,
        }}
      >
        {flower.symbol}
      </div>
      
      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm">
          <div className="font-medium capitalize">{post.mood}</div>
          <div className="text-xs opacity-75">
            {createdAt.toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

// Modal for flower details
const FlowerModal = ({ post, onClose }) => {
  if (!post) return null;
  
  const flower = moodFlowers[post.mood?.toLowerCase()] || moodFlowers.calm;
  const createdAt = new Date(post.createdAt?.seconds * 1000 || Date.now());
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="text-center mb-6">
          <div className={`w-24 h-24 ${flower.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-4 ${flower.glow} shadow-2xl`}>
            {flower.symbol}
          </div>
          <h3 className="text-2xl font-bold text-white capitalize mb-2">{post.mood}</h3>
          <p className="text-gray-400 text-sm">
            {createdAt.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 mb-6 leading-relaxed">
            {post.content}
          </p>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Garden = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  // const [currentUser] = useState({ uid: 'demo-user' }); // Demo user

  // Demo data - replace with Firebase integration
  useEffect(() => {
    const demoFlowers = [
      { id: 1, mood: 'calm', content: 'Watching the sunset from my window, feeling grateful for this peaceful moment.', createdAt: { seconds: Date.now() / 1000 - 86400 } },
      { id: 2, mood: 'hopeful', content: 'Started a new book today. Excited to see where this journey takes me.', createdAt: { seconds: Date.now() / 1000 - 172800 } },
      { id: 3, mood: 'reflective', content: 'Thinking about old friendships and how people change over time.', createdAt: { seconds: Date.now() / 1000 - 259200 } },
      { id: 4, mood: 'nostalgic', content: 'Found my old photo album. So many beautiful memories.', createdAt: { seconds: Date.now() / 1000 - 345600 } },
      { id: 5, mood: 'peaceful', content: 'Morning meditation session. The mind feels clear and centered.', createdAt: { seconds: Date.now() / 1000 - 432000 } },
      { id: 6, mood: 'content', content: 'Simple dinner with family. These moments are everything.', createdAt: { seconds: Date.now() / 1000 - 518400 } },
      { id: 7, mood: 'zen', content: 'Sitting in silence, listening to the rain. Perfect afternoon.', createdAt: { seconds: Date.now() / 1000 - 604800 } },
      { id: 8, mood: 'melancholy', content: 'Some days feel heavier than others. That\'s okay too.', createdAt: { seconds: Date.now() / 1000 - 691200 } },
    ];
    
    setUserPosts(demoFlowers);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes flowerGrow {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(-90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes gentle-sway {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_50%)] pointer-events-none"></div>
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'><circle cx='50' cy='50' r='0.5' fill='%23ffffff' opacity='0.02'/></pattern></defs><rect width='100' height='100' fill='url(%23grain)'/></svg>")`,
          }}
        ></div>
        
        {/* Header */}
        <div className="relative z-10 text-center py-12">
          <h1 className="text-5xl font-light text-white mb-4">
            🌸 Your Garden of Thoughts
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto px-4">
            Each flower represents a moment in your emotional journey. Click to revisit your thoughts.
          </p>
          <div className="mt-8 text-sm text-gray-500">
            {userPosts.length} flowers blooming in your garden
          </div>
        </div>

        {/* Garden Container */}
        <div className="relative w-full h-[70vh] min-h-[500px]">
          {userPosts.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-gray-400 text-xl">
                  No flowers yet. Share your stillness to grow your garden.
                </p>
              </div>
            </div>
          ) : (
            userPosts.map((post, index) => (
              <Flower
                key={post.id}
                post={post}
                index={index}
                onClick={setSelectedPost}
              />
            ))
          )}
        </div>

        {/* Garden Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Flower Detail Modal */}
      {selectedPost && (
        <FlowerModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
};

export default Garden;