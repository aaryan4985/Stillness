import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/feed");
    } catch (err) {
      alert(err.message);
    }
  };

  const googleSignin = async () => {
    try {
      await signInWithPopup(auth);
      navigate("/feed");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-semibold mb-4">Welcome back to Stillness</h2>
      <form onSubmit={handleSignin} className="flex flex-col w-full max-w-sm gap-4">
        <input type="email" placeholder="Email" className="p-3 border" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="p-3 border" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-black text-white py-2">Sign In</button>
        <button type="button" onClick={googleSignin} className="bg-gray-200 py-2">Sign In with Google</button>
      </form>
    </div>
  );
};

export default Signin;
