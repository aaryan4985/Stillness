// src/components/Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const navItems = [
  { name: "Home", to: "/home", icon: "🏠" },
  { name: "Profile", to: "/profile", icon: "👤" },
  { name: "Settings", to: "/settings", icon: "⚙️" },
  { name: "User Setup", to: "/setup", icon: "🛠️" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    selectedPfp: "/assets/1 (1).jpg",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate("/signin");
        return;
      }
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            username: data.username || "User",
            selectedPfp: data.selectedPfp || "/assets/1 (1).jpg",
          });
        } else {
          setUserData({
            username: "User",
            selectedPfp: "/assets/1 (1).jpg",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out.");
    }
  };

  if (loading) {
    return (
      <aside className="fixed top-0 left-0 h-full w-20 bg-black/90 flex items-center justify-center text-white">
        Loading...
      </aside>
    );
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-black/90 backdrop-blur-md border-r border-white/10
        flex flex-col items-center py-8 px-4 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Toggle Button */}
      <button
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((c) => !c)}
        className="mb-8 p-2 rounded-md text-white hover:bg-white/10 transition-colors"
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>

      {/* Profile Section */}
      {!collapsed && (
        <div className="flex flex-col items-center mb-12 space-y-2">
          <img
            src={userData.selectedPfp}
            alt="User avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-white/30 shadow-md"
            draggable={false}
          />
          <p className="text-white font-light tracking-wide truncate max-w-full">
            {userData.username || "Guest"}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col space-y-4 w-full">
        {navItems.map(({ name, to, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={name}
              to={to}
              className={`flex items-center gap-4 rounded-lg px-4 py-3
                cursor-pointer select-none text-white font-light tracking-wide
                transition-colors duration-300
                ${
                  isActive
                    ? "bg-white/20 shadow-lg shadow-white/30"
                    : "hover:bg-white/10"
                }
              `}
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{name}</span>}
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 rounded-lg px-4 py-3
            text-red-400 font-light tracking-wide hover:bg-red-600 hover:text-white
            transition-colors duration-300"
        >
          <span className="text-lg">🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
