import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/feed");
    } catch (err) {
      alert(err.message);
    }
  };

  const googleSignup = async () => {
    try {
      await signInWithPopup(auth);
      navigate("/feed");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-semibold mb-4">Create your Stillness account</h2>
      <form onSubmit={handleSignup} className="flex flex-col w-full max-w-sm gap-4">
        <input type="email" placeholder="Email" className="p-3 border" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="p-3 border" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-black text-white py-2">Sign Up</button>
        <button type="button" onClick={googleSignup} className="bg-gray-200 py-2">Sign Up with Google</button>
      </form>
    </div>
  );
};

export default Signup;
