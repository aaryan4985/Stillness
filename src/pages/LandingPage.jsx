// src/pages/LandingPage.jsx
import { useEffect, useRef, useState } from "react";
import SplitText from "../components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(false);

  // Animate video scaling and Y movement on scroll
  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    gsap.to(videoRef.current, {
      scale: 0.4,
      y: "80vh",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Navbar appear on scroll
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "bottom top",
      onEnter: () => setShowNavbar(true),
      onLeaveBack: () => setShowNavbar(false),
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div className="relative w-full bg-black text-white overflow-x-hidden">
      {/* Navbar */}
      {showNavbar && (
        <div className="fixed top-0 left-0 w-full px-8 py-4 bg-black bg-opacity-80 backdrop-blur-md z-50 transition-all duration-500">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold tracking-wide">STILLNESS</h1>
            <div className="space-x-4">
              <button className="text-sm px-4 py-1 rounded bg-white text-black font-semibold">Sign In</button>
              <button className="text-sm px-4 py-1 rounded border border-white">Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={containerRef} className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <SplitText
          text="Stillness."
          className="text-6xl md:text-8xl font-bold mb-4"
          splitType="chars"
        />
        <SplitText
          text="The Anti-Social Social Network."
          className="text-xl md:text-2xl text-gray-400"
          splitType="words"
          delay={80}
        />
      </section>

      {/* Scroll Video Section */}
      <div className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover max-w-none"
        />
      </div>

      {/* Post-scroll Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Write for Yourself, Not the Algorithm</h2>
        <p className="max-w-2xl text-center text-lg text-gray-700">
          Stillness lets you post thoughts anonymously, privately, and without the noise of likes, comments, or followers. Your thoughts disappear after 24 hours — ephemeral, like a breeze.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
