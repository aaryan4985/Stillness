import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

// Mood to flower mapping
const moodFlowers = {
  calm: { color: "#93c5fd", symbol: "🌸", type: "flower1" },
  melancholy: { color: "#a78bfa", symbol: "🥀", type: "flower2" },
  reflective: { color: "#5eead4", symbol: "🌺", type: "flower3" },
  hopeful: { color: "#fcd34d", symbol: "🌻", type: "sunflower" },
  anxious: { color: "#fdba74", symbol: "🌼", type: "flower4" },
  content: { color: "#6ee7b7", symbol: "🌷", type: "tulip" },
  nostalgic: { color: "#fbbf24", symbol: "🌙", type: "flower5" },
  lonely: { color: "#818cf8", symbol: "🌹", type: "rose" },
  peaceful: { color: "#67e8f9", symbol: "🏵️", type: "flower6" },
  heartbroken: { color: "#f87171", symbol: "💔", type: "flower7" },
  zen: { color: "#d1d5db", symbol: "🕉️", type: "flower8" },
  "burnt out": { color: "#9ca3af", symbol: "🌫️", type: "flower9" },
  overwhelmed: { color: "#fca5a5", symbol: "🌀", type: "flower10" },
  motivated: { color: "#86efac", symbol: "⚡", type: "flower11" },
  detached: { color: "#cbd5e1", symbol: "🌫️", type: "flower12" },
  grateful: { color: "#f9a8d4", symbol: "🙏", type: "flower13" },
  "in love": { color: "#f472b6", symbol: "💕", type: "flower14" },
  inspired: { color: "#c4b5fd", symbol: "✨", type: "flower15" }
};

// Generate non-overlapping positions in a grid-like garden layout
const generateGardenPositions = (postCount) => {
  const positions = [];
  
  // Calculate rows and columns based on count
  const cols = Math.ceil(Math.sqrt(postCount));
  const rows = Math.ceil(postCount / cols);
  
  for (let i = 0; i < postCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    positions.push({
      x: (col * 180) - ((cols - 1) * 90) + (Math.random() - 0.5) * 40,
      y: (row * 140) - ((rows - 1) * 70) + (Math.random() - 0.5) * 30
    });
  }
  
  return positions;
};

// Flower component with SVG-based flowers
const Flower = ({ post, position, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
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
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);
  
  // Different flower types with SVG
  const renderFlower = () => {
    const baseSize = 60;
    const stemHeight = 80;
    const stemWidth = 4;
    const flowerSize = baseSize * (isHovered ? 1.1 : 1);
    
    switch(flower.type) {
      case 'sunflower':
        return (
          <>
            <path 
              d={`M ${stemWidth/2} 0 v ${stemHeight}`} 
              stroke="#4d7c0f" 
              strokeWidth={stemWidth} 
              fill="none"
            />
            <circle cx="0" cy={-stemHeight} r={flowerSize*0.4} fill="#713f12" />
            <circle cx="0" cy={-stemHeight} r={flowerSize*0.3} fill="#facc15" />
            {[...Array(12)].map((_, i) => (
              <path
                key={i}
                d={`M 0 ${-stemHeight} L ${Math.sin(i * 30 * Math.PI/180) * flowerSize*0.6} ${-stemHeight + Math.cos(i * 30 * Math.PI/180) * flowerSize*0.6} Z`}
                fill="#f59e0b"
              />
            ))}
          </>
        );
      case 'tulip':
        return (
          <>
            <path 
              d={`M ${stemWidth/2} 0 v ${stemHeight}`} 
              stroke="#4d7c0f" 
              strokeWidth={stemWidth} 
              fill="none"
            />
            <path
              d={`M 0 ${-stemHeight} 
                Q -${flowerSize*0.4} ${-stemHeight-flowerSize*0.6} 0 ${-stemHeight-flowerSize}
                Q ${flowerSize*0.4} ${-stemHeight-flowerSize*0.6} 0 ${-stemHeight} Z`}
              fill={flower.color}
            />
          </>
        );
      case 'rose':
        return (
          <>
            <path 
              d={`M ${stemWidth/2} 0 v ${stemHeight}`} 
              stroke="#4d7c0f" 
              strokeWidth={stemWidth} 
              fill="none"
            />
            <path
              d={`M 0 ${-stemHeight} 
                C -${flowerSize*0.3} ${-stemHeight-flowerSize*0.2} -${flowerSize*0.5} ${-stemHeight-flowerSize*0.4} 0 ${-stemHeight-flowerSize*0.6}
                C ${flowerSize*0.5} ${-stemHeight-flowerSize*0.4} ${flowerSize*0.3} ${-stemHeight-flowerSize*0.2} 0 ${-stemHeight} Z`}
              fill={flower.color}
            />
          </>
        );
      default:
        return (
          <>
            <path 
              d={`M ${stemWidth/2} 0 v ${stemHeight}`} 
              stroke="#4d7c0f" 
              strokeWidth={stemWidth} 
              fill="none"
            />
            <circle cx="0" cy={-stemHeight} r={flowerSize*0.5} fill={flower.color} />
            {[...Array(6)].map((_, i) => (
              <path
                key={i}
                d={`M 0 ${-stemHeight} L ${Math.sin(i * 60 * Math.PI/180) * flowerSize*0.8} ${-stemHeight + Math.cos(i * 60 * Math.PI/180) * flowerSize*0.8} Z`}
                fill={flower.color}
                opacity="0.8"
              />
            ))}
          </>
        );
    }
  };
  
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
      <svg 
        width="120" 
        height="180" 
        viewBox="0 0 120 180"
        className="drop-shadow-lg"
      >
        {renderFlower()}
      </svg>
      
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
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl border-2 border-white/20`}
            style={{ backgroundColor: flower.color }}
          >
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
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [flowerPositions, setFlowerPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use demo data if no user posts provided

  const posts = useMemo(() => (userPosts.length > 0 ? userPosts : []), [userPosts]);

  useEffect(() => {
    if (posts.length > 0) {
      const positions = generateGardenPositions(posts.length);
      setFlowerPositions(positions);
      setIsLoaded(true);
    }
  }, [posts]);

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-green-50 relative overflow-hidden">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-blue-100 z-0">
        {/* Clouds */}
        <div className="absolute top-20 left-20 w-40 h-20 bg-white rounded-full opacity-30"></div>
        <div className="absolute top-40 right-40 w-60 h-30 bg-white rounded-full opacity-30"></div>
        <div className="absolute top-80 left-1/4 w-50 h-25 bg-white rounded-full opacity-30"></div>
      </div>
      
      {/* Garden ground */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-200 to-green-300 z-10">
        {/* Grass details */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-green-400/20"></div>
        {/* Small decorative elements */}
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-brown-500 rounded-full"></div>
        <div className="absolute bottom-24 right-1/3 w-6 h-6 bg-brown-400 rounded-full"></div>
      </div>
      
      {/* Home button */}
      <button
        onClick={() => navigate('/home')}
        className="absolute top-4 left-4 z-30 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-200 flex items-center gap-2 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Back Home
      </button>

      {/* Header */}
      <div className="relative z-20 text-center pt-16 pb-8">
        <h1 className="text-4xl font-light text-gray-800 mb-2">
          🌸 Your Personal Garden
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">
          Each flower represents a moment in your emotional journey
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {posts.length} {posts.length === 1 ? 'flower' : 'flowers'} in your garden
        </div>
      </div>

      {/* Garden Container */}
      <div className="relative w-full h-[calc(100vh-200px)] min-h-[500px] z-20">
        {posts.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/70 p-8 rounded-xl backdrop-blur-sm border border-white/80 shadow-sm">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-600 text-xl mb-4">
                Your garden is empty
              </p>
              <p className="text-gray-500">
                Share your thoughts to plant your first flower
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