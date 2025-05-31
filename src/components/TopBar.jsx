import React from "react";

const TopBar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-3 shadow-sm bg-white/70 backdrop-blur sticky top-0 z-50">
      <button onClick={() => window.location.href = "/garden"}>
        🪴
      </button>
      <h1 className="text-lg font-semibold">Stillness</h1>
      <div className="flex items-center gap-3">
        <button className="text-sm">🌑 Quiet Mode</button>
        <span className="text-sm opacity-60">(@nickname)</span>
      </div>
    </div>
  );
};

export default TopBar;
