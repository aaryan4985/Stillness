// src/pages/Signup.jsx

import { useState } from "react";
import SplitText from "../components/SplitText"; 


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // await createUserWithEmailAndPassword(auth, email, password);
      // navigate("/feed");
      setTimeout(() => setIsLoading(false), 1000); // Demo
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };

  const googleSignup = async () => {
    setIsLoading(true);
    try {
      // await signInWithPopup(auth);
      // navigate("/feed");
      setTimeout(() => setIsLoading(false), 1000); // Demo
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  };

  const renderBlurOverlay = (active) => (
    <div
      className={`absolute inset-0 rounded-lg pointer-events-none transition-transform duration-300 
        ${active ? "bg-white/5 scale-105" : "scale-100"}`}
    />
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-2xl"></div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
            <h1 className="text-2xl font-light tracking-[0.3em] text-white/90">
                <SplitText text="STILLNESS" splitType="chars" className="inline-block" delay={50} />

            </h1>
            <div className="w-16 h-px bg-white/30 mx-auto"></div>
            <h2 className="text-xl font-extralight tracking-wide text-white/80">
                <SplitText text="Begin your journey" splitType="words" className="inline-block" delay={70} />

            </h2>
            <p className="text-sm text-white/50 font-light leading-relaxed max-w-xs mx-auto">
            Create an account to join our anti-social social network
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                autoComplete="email"
                aria-label="Email"
                className={`w-full px-4 py-4 bg-white/5 border rounded-lg text-white placeholder-white/40 
                  font-light tracking-wide transition-all duration-300 focus:outline-none backdrop-blur-sm
                  ${
                    focusedField === "email"
                      ? "border-white/40 bg-white/10 shadow-lg"
                      : "border-white/20 hover:border-white/30"
                  }`}
              />
              {renderBlurOverlay(focusedField === "email")}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                autoComplete="new-password"
                aria-label="Password"
                className={`w-full px-4 py-4 bg-white/5 border rounded-lg text-white placeholder-white/40 
                  font-light tracking-wide transition-all duration-300 focus:outline-none backdrop-blur-sm
                  ${
                    focusedField === "password"
                      ? "border-white/40 bg-white/10 shadow-lg"
                      : "border-white/20 hover:border-white/30"
                  }`}
              />
              {renderBlurOverlay(focusedField === "password")}
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-white/40 text-center font-light leading-relaxed">
            By creating an account, you agree to embrace{" "}
            <span className="text-white/60 underline decoration-white/20">stillness</span> and{" "}
            <span className="text-white/60 underline decoration-white/20">mindful sharing</span>
          </p>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full py-4 bg-white text-black font-light tracking-[0.2em] 
              rounded-lg hover:bg-white/90 transition-all duration-300 overflow-hidden
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}>
              CREATE ACCOUNT
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <span className="relative bg-black px-4 text-sm text-white/60 font-light">or</span>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={googleSignup}
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
        </form>

        {/* Footer */}
        <div className="text-center pt-8 space-y-4">
          <p className="text-white/60 font-light text-sm tracking-wide">
            Already have an account?{" "}
            <button
              onClick={() => (window.location.href = "/signin")}
              className="text-white/80 hover:text-white transition-colors duration-300 underline-offset-2 decoration-white/20 hover:decoration-white/60"
            >
              Sign in
            </button>
          </p>

          <div className="pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 font-extralight italic leading-relaxed">
              "In stillness, we find our truest thoughts"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
