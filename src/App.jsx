import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import UserSetup from "./pages/UserSetup";
import Garden from "./pages/Garden";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/usersetup" element={<UserSetup />} />
      <Route path="/garden" element={<Garden />} />
    </Routes>
  );
}

export default App;
