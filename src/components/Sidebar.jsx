// src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { SIDEBAR_MOODS } from "../constants";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 h-full w-72 bg-black/90 border-r border-white/10 flex flex-col items-center py-10 px-6 text-white">
        <p className="text-center text-sm font-light tracking-wide">Loading...</p>
      </aside>
    );
  }

  if (!userData) {
    return (
      <aside className="fixed left-0 top-0 h-full w-72 bg-black/90 border-r border-white/10 flex flex-col items-center py-10 px-6 text-white">
        <p className="text-center text-sm font-light tracking-wide">User not found</p>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-black/90 border-r border-white/10 flex flex-col items-center py-12 px-8 text-white select-none">
      {/* Profile Picture */}
      <div className="mb-6">
        <img
          src={userData.selectedPfp}
          alt="User Avatar"
          className="w-36 h-36 rounded-full border-4 border-white/40 object-cover shadow-lg"
          draggable={false}
        />
      </div>

      {/* Username */}
      <h2 className="text-3xl font-semibold tracking-wide mb-10 text-center truncate max-w-full">
        {userData.username || "Unnamed"}
      </h2>

      {/* Moods */}
      <section className="w-full">
        <h3 className="text-lg font-light mb-4 tracking-wide uppercase text-white/70 text-center">
          Moods
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {SIDEBAR_MOODS.map(({ label, value }) => (
            <span
              key={value}
              className="px-3 py-1 rounded-full border border-white/30 text-sm font-light cursor-default
                         bg-white/10 text-white select-none"
            >
              {label}
            </span>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
