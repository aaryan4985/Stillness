import { useEffect, useState } from "react";

// Mood to flower mapping
const moodFlowers = {
  calm: { color: "from-blue-300 to-blue-500", symbol: "🌸", glow: "shadow-blue-400/30" },
  melancholy: { color: "from-purple-400 to-purple-700", symbol: "🥀", glow: "shadow-purple-400/30" },
  reflective: { color: "from-teal-300 to-teal-600", symbol: "🌺", glow: "shadow-teal-400/30" },
  hopeful: { color: "from-yellow-300 to-orange-400", symbol: "🌻", glow: "shadow-yellow-400/40" },
  anxious: { color: "from-orange-300 to-red-400", symbol: "🌼", glow: "shadow-orange-400/30" },
  content: { color: "from-emerald-300 to-emerald-500", symbol: "🌷", glow: "shadow-emerald-400/30" },
  nostalgic: { color: "from-amber-300 to-yellow-500", symbol: "🌙", glow: "shadow-amber-400/30" },
  lonely: { color: "from-indigo-400 to-purple-600", symbol: "🌹", glow: "shadow-indigo-400/30" },
  peaceful: { color: "from-cyan-300 to-blue-400", symbol: "🏵️", glow: "shadow-cyan-400/30" },
  heartbroken: { color: "from-red-400 to-rose-600", symbol: "💔", glow: "shadow-red-400/30" },
  zen: { color: "from-gray-300 to-slate-500", symbol: "🕉️", glow: "shadow-gray-400/20" },
  "burnt out": { color: "from-gray-400 to-gray-700", symbol: "🌫️", glow: "shadow-gray-500/20" },
  overwhelmed: { color: "from-red-300 to-pink-500", symbol: "🌀", glow: "shadow-pink-400/30" },
  motivated: { color: "from-green-400 to-lime-500", symbol: "⚡", glow: "shadow-green-400/40" },
  detached: { color: "from-slate-300 to-gray-500", symbol: "🌫️", glow: "shadow-slate-400/20" },
  grateful: { color: "from-pink-300 to-rose-400", symbol: "🙏", glow: "shadow-pink-400/30" },
  "in love": { color: "from-pink-400 to-red-400", symbol: "💕", glow: "shadow-pink-400/40" },
  inspired: { color: "from-violet-300 to-purple-500", symbol: "✨", glow: "shadow-violet-400/40" }
};

// Generate non-overlapping positions in a grid-like garden layout
const generateGardenPositions = (postCount) => {
  const positions = [];
  const minDistance = 140; // Increased minimum distance
  const maxAttempts = 50;
  
  for (let i = 0; i < postCount; i++) {
    let position;
    let attempts = 0;
    let validPosition = false;
    
    while (!validPosition && attempts < maxAttempts) {
      // Create more organized positioning with some randomness
      const row = Math.floor(i / 4); // 4 flowers per row roughly
      const col = i % 4;
      
      position = {
        x: (col * 180) - 270 + (Math.random() - 0.5) * 60, // More spread out
        y: (row * 120) - 150 + (Math.random() - 0.5) * 40
      };
      
      // Check if position is valid (no overlaps)
      validPosition = positions.every(pos => {
        const distance = Math.sqrt(
          Math.pow(pos.x - position.x, 2) + Math.pow(pos.y - position.y, 2)
        );
        return distance >= minDistance;
      });
      
      attempts++;
    }
    
    positions.push(position || { x: i * 100 - 200, y: 0 }); // Fallback position
  }
  
  return positions;
};

// Flower component
const Flower = ({ post, position, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const flower = moodFlowers[post.mood?.toLowerCase()] || moodFlowers.calm;
  
  // Handle Firebase timestamp format
  const getCreatedDate = () => {
    if (post.createdAt?.toDate) {
      return post.createdAt.toDate();
    } else if (post.createdAt?.seconds) {
      return new Date(post.createdAt.seconds * 1000);
    } else {
      return new Date(post.createdAt || Date.now());
    }
  };
  
  const createdAt = getCreatedDate();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <div
      className={`absolute transition-all duration-700 ease-out cursor-pointer ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`}
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`,
        transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(post)}
    >
      {/* Flower stem */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
        <div className="w-2 h-16 bg-green-500 rounded-full shadow-sm" />
        {/* Small leaves */}
        <div className="absolute top-1/2 -left-2 text-xs">🍃</div>
        <div className="absolute top-3/4 -right-2 text-xs">🍃</div>
      </div>
      
      {/* Flower petals */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-6 bg-gradient-to-t ${flower.color} rounded-full opacity-70`}
            style={{
              transform: `rotate(${60 * i}deg) translateY(-20px)`,
              transformOrigin: 'center bottom',
            }}
          />
        ))}
      </div>
      
      {/* Flower center */}
      <div
        className={`relative w-16 h-16 bg-gradient-to-br ${flower.color} rounded-full ${flower.glow} shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-white/30`}
        style={{
          boxShadow: isHovered 
            ? `0 0 25px ${flower.glow.split('/')[0].replace('shadow-', '').replace('-', ', ')}/60, 0 8px 20px rgba(0,0,0,0.3)`
            : `0 0 15px ${flower.glow.split('/')[0].replace('shadow-', '').replace('-', ', ')}/40, 0 4px 12px rgba(0,0,0,0.2)`
        }}
      >
        <span className="text-2xl">{flower.symbol}</span>
      </div>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-white/20 shadow-xl">
          <div className="font-medium capitalize">{post.mood}</div>
          <div className="text-xs opacity-75">
            {createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
        </div>
      )}
    </div>
  );
};

// Modal component
const FlowerModal = ({ post, onClose }) => {
  if (!post) return null;
  
  const flower = moodFlowers[post.mood?.toLowerCase()] || moodFlowers.calm;
  
  const getCreatedDate = () => {
    if (post.createdAt?.toDate) {
      return post.createdAt.toDate();
    } else if (post.createdAt?.seconds) {
      return new Date(post.createdAt.seconds * 1000);
    } else {
      return new Date(post.createdAt || Date.now());
    }
  };
  
  const createdAt = getCreatedDate();
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 bg-gradient-to-br ${flower.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl border-2 border-white/20`}>
            {flower.symbol}
          </div>
          <h3 className="text-xl font-bold text-white capitalize mb-2">{post.mood}</h3>
          <p className="text-gray-400 text-sm">
            {createdAt.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-gray-200 leading-relaxed">
              "{post.content}"
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Garden = ({ userPosts = [] }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [flowerPositions, setFlowerPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Demo data for testing - remove this when connecting to real Firebase
  const demoData = [
    { 
      id: '1', 
      mood: 'Anxious', 
      content: 'Feeling worried about the presentation tomorrow.', 
      createdAt: { seconds: Date.now() / 1000 - 86400 },
      userId: 'demo-user'
    },
    { 
      id: '2', 
      mood: 'Hopeful', 
      content: 'Started a new chapter in my life today.', 
      createdAt: { seconds: Date.now() / 1000 - 172800 },
      userId: 'demo-user'
    },
    { 
      id: '3', 
      mood: 'Calm', 
      content: 'Evening meditation brought me peace.', 
      createdAt: { seconds: Date.now() / 1000 - 259200 },
      userId: 'demo-user'
    },
    { 
      id: '4', 
      mood: 'Grateful', 
      content: 'Thankful for family time this weekend.', 
      createdAt: { seconds: Date.now() / 1000 - 345600 },
      userId: 'demo-user'
    },
    { 
      id: '5', 
      mood: 'Reflective', 
      content: 'Thinking about how much I have grown this year.', 
      createdAt: { seconds: Date.now() / 1000 - 432000 },
      userId: 'demo-user'
    }
  ];

  // Use demo data if no user posts provided
  const posts = userPosts.length > 0 ? userPosts : demoData;

  useEffect(() => {
    if (posts.length > 0) {
      const positions = generateGardenPositions(posts.length);
      setFlowerPositions(positions);
      setIsLoaded(true);
    }
  }, [posts]);

  return (
    <div className="h-screen bg-gradient-to-br from-sky-100 via-green-50 to-emerald-100 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-green-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-yellow-200/30 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-4">
        <h1 className="text-4xl font-light text-gray-800 mb-2">
          🌸 Your Garden of Thoughts
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">
          Each flower represents a moment in your emotional journey
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {posts.length} flowers in your garden
        </div>
      </div>

      {/* Garden Container - Fixed height to fit in viewport */}
      <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px]">
        {/* Garden ground */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-200/40 to-transparent" />
        
        {posts.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-500 text-xl">
                No flowers yet. Share your thoughts to grow your garden.
              </p>
            </div>
          </div>
        ) : (
          isLoaded && posts.map((post, index) => (
            <Flower
              key={post.id}
              post={post}
              position={flowerPositions[index] || { x: 0, y: 0 }}
              index={index}
              onClick={setSelectedPost}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {selectedPost && (
        <FlowerModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default Garden;