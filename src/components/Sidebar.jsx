// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 h-full w-80 bg-black backdrop-blur-sm border-r border-white/20 flex flex-col items-center justify-center px-6 text-white overflow-hidden z-40">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm font-extralight tracking-[0.2em] text-white/60">Loading...</p>
        </div>
      </aside>
    );
  }

  if (!userData) {
    return (
      <aside className="fixed left-0 top-0 h-full w-80 bg-black backdrop-blur-sm border-r border-white/20 flex flex-col items-center justify-center px-6 text-white overflow-hidden z-40">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <p className="text-sm font-light tracking-wide text-white/60">User not found</p>
          <p className="text-xs font-extralight text-white/40 mt-2 italic">
            "In the silence, we find ourselves"
          </p>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-80 bg-black backdrop-blur-sm flex flex-col py-6 px-6 text-white select-none overflow-hidden z-40">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/2 w-60 h-60 bg-white/3 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col h-full w-full">

          {/* Brand Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-extralight tracking-[0.3em] text-white/80">
              STILLNESS
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-2 mx-auto"></div>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-5 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
              <img
                src={userData.selectedPfp}
                alt="User Avatar"
                className="relative w-32 h-32 rounded-full border-2 border-white/40 object-cover shadow-lg shadow-white/20 transition-all duration-300 hover:scale-105 hover:border-white/60"
                draggable={false}
              />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-light tracking-wide text-white/90 truncate max-w-full mb-3">
                {userData.username || "Unnamed"}
              </h2>
              
              {/* Bio Section */}
              {userData.bio && (
                <div className="max-w-full">
                  <p className="text-sm font-light text-white/70 leading-relaxed text-center px-2 break-words">
                    {userData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Display Selected Moods */}
          <section className="mb-6">
            <div className="text-center mb-4">
              <h3 className="text-sm font-extralight tracking-[0.2em] uppercase text-white/60 mb-3">
                Your Moods
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 px-2">
              {(userData.moods || []).map((mood, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-light border border-white/30 text-white/80 bg-white/5 backdrop-blur-md"
                >
                  {mood}
                </span>
              ))}
            </div>
          </section>

          {/* Spacer to push buttons to bottom */}
          <div className="flex-1"></div>

          {/* Separator Line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={() => navigate("/garden")}
              className="w-full py-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/30 text-white/80 text-sm font-light tracking-[0.1em] 
                       hover:bg-white/10 hover:border-white/40 hover:text-white/90 hover:scale-[1.02] 
                       transition-all duration-300 shadow-lg hover:shadow-white/10"
            >
              <span className="mr-2">🌱</span>
              Visit Garden
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/30 text-white/80 text-sm font-light tracking-[0.1em] 
                       hover:bg-white/10 hover:border-white/40 hover:text-white/90 hover:scale-[1.02] 
                       transition-all duration-300 shadow-lg hover:shadow-white/10"
            >
              <span className="mr-2">🔓</span>
              Logout
            </button>
          </div>

          {/* Inspirational Quote */}
          <div className="text-center mt-4">
            <p className="text-xs font-extralight italic text-white/40 tracking-wide">
              "Find peace in the quiet moments"
            </p>
          </div>

        </div>
      </aside>
      
      {/* Separate border line with higher z-index */}
      <div className="fixed left-80 top-0 h-full w-px bg-white/20 z-50"></div>
    </>
  );
};

export default Sidebar;