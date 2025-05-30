// src/components/Navbar.jsx
import { useEffect, useState } from "react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        visible ? "bg-white/80 backdrop-blur-md py-4 shadow-md" : "opacity-0 -translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Stillness</h1>
        <div>
          <button className="text-sm font-medium px-4">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
