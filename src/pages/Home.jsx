// src/pages/Home.jsx
import Sidebar from "../components/Sidebar";
import MainFeedArea from "../components/MainFeedArea";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <MainFeedArea />
      </main>
    </div>
  );
};

export default Home;
