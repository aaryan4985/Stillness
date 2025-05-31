import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/feed"); // or your homepage/dashboard
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/feed");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/3 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 flex flex-col items-center justify-center mx-auto">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light tracking-[0.3em] text-white/90">STILLNESS</h1>
          <div className="w-16 h-px bg-white/30 mx-auto"></div>
          <h2 className="text-xl font-extralight tracking-wide text-white/80">Welcome back</h2>
        </div>

        {/* Form */}
        <div className="space-y-6 w-full flex flex-col items-center">
          <div className="space-y-4 w-full">
            {/* Email Input */}
            <div className="relative group w-full">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-4 py-4 bg-white/5 border rounded-lg text-white placeholder-white/40 
                  font-light tracking-wide transition-all duration-300 focus:outline-none backdrop-blur-sm
                  ${focusedField === "email" ? "border-white/40 bg-white/10 shadow-lg" : "border-white/20 hover:border-white/30"}`}
              />
            </div>

            {/* Password Input */}
            <div className="relative group w-full">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`w-full px-4 py-4 bg-white/5 border rounded-lg text-white placeholder-white/40 
                  font-light tracking-wide transition-all duration-300 focus:outline-none backdrop-blur-sm
                  ${focusedField === "password" ? "border-white/40 bg-white/10 shadow-lg" : "border-white/20 hover:border-white/30"}`}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignin}
            disabled={isLoading}
            className="group relative w-full py-4 bg-white text-black font-light tracking-[0.2em] 
              rounded-lg hover:bg-white/90 transition-all duration-300 overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}>
              SIGN IN
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-8 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative bg-black px-4 text-sm text-white/60 font-light">or</div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={googleSignin}
            disabled={isLoading}
            className="group relative w-full py-4 bg-white/5 border border-white/20 text-white 
              font-light tracking-[0.2em] rounded-lg hover:bg-white/10 hover:border-white/30 
              transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}>
              CONTINUE WITH GOOGLE
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-white/60 font-light text-sm tracking-wide">
            Don't have an account?{" "}
            <button
              className="text-white/80 hover:text-white transition-colors duration-300"
              onClick={() => window.location.href = "/signup"}
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Philosophy note */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-center text-xs text-white/30 font-extralight italic leading-relaxed">
            "In stillness, we find our truest thoughts"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
