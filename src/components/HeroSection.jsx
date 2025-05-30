// src/components/HeroSection.jsx
import SplitText from "./SplitText";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    gsap.to(videoRef.current, {
      scale: 0.3,
      y: "100vh",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/your-video.mp4" // replace with your path
      />

      <div className="relative z-10 flex items-center justify-center h-full w-full px-4">
        <SplitText
          text="Stillness: Whisper Into the Void"
          className="text-5xl md:text-7xl font-bold text-white"
          splitType="words"
        />
      </div>
    </section>
  );
};

export default HeroSection;
