import { useRef, useEffect, useState } from "react";

// SplitText Component
const SplitText = ({ text, className, splitType = "chars", delay = 40 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Clear existing content
    element.innerHTML = "";
    
    let items = [];
    if (splitType === "chars") {
      items = text.split("");
    } else if (splitType === "words") {
      items = text.split(" ");
    }

    items.forEach((item, index) => {
      const span = document.createElement("span");
      span.textContent = splitType === "words" ? item + " " : item;
      span.style.opacity = "0";
      span.style.transform = "translateY(20px)";
      span.style.display = "inline-block";
      span.style.transition = `opacity 0.6s ease ${index * delay}ms, transform 0.6s ease ${index * delay}ms`;
      element.appendChild(span);
    });

    // Trigger animation
    setTimeout(() => {
      const spans = element.querySelectorAll("span");
      spans.forEach(span => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0)";
      });
    }, 100);

  }, [text, splitType, delay]);

  return <div ref={elementRef} className={className}></div>;
};

// Mock GSAP functionality for demonstration
const createMockGSAP = () => {
  let scrollY = 0;
  let isScrolling = false;
  
  const timeline = (config = {}) => ({
    to: (target, props) => {
      if (config.scrollTrigger) {
        const handleScroll = () => {
          if (!isScrolling) {
            isScrolling = true;
            requestAnimationFrame(() => {
              scrollY = window.scrollY;
              const progress = Math.min(scrollY / (window.innerHeight * 1.5), 1);
              
              if (target && target.style) {
                if (props.scale !== undefined) {
                  const scale = 1 + (props.scale - 1) * progress;
                  target.style.transform = `scale(${scale}) translateY(${props.yPercent ? props.yPercent * progress : 0}%)`;
                }
                if (props.borderTopLeftRadius) {
                  target.style.borderTopLeftRadius = `${3 * progress}rem`;
                  target.style.borderTopRightRadius = `${3 * progress}rem`;
                }
              }
              isScrolling = false;
            });
          }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }
      return () => {};
    }
  });

  return {
    context: (callback) => {
      const cleanup = callback();
      return { revert: cleanup || (() => {}) };
    },
    timeline,
    registerPlugin: () => {},
  };
};

const ScrollTrigger = {
  create: (config) => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 2;
      
      if (scrollY > threshold && config.onEnter) {
        config.onEnter();
      } else if (scrollY <= threshold && config.onLeaveBack) {
        config.onLeaveBack();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }
};

const gsap = createMockGSAP();
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const pinnedSectionRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate video scaling and border
      const cleanup1 = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedSectionRef.current,
          start: "top+=10% top",
          end: "bottom top",
          scrub: true,
          anticipatePin: 1,
        },
      }).to(videoWrapperRef.current, {
        scale: 0.5,
        yPercent: 100,
        borderTopLeftRadius: "3rem",
        borderTopRightRadius: "3rem",
        ease: "power3.out",
      });

      // Navbar appearance
      const cleanup2 = ScrollTrigger.create({
        trigger: pinnedSectionRef.current,
        start: "bottom top",
        onEnter: () => setShowNavbar(true),
        onLeaveBack: () => setShowNavbar(false),
      });

      return () => {
        if (cleanup1) cleanup1();
        if (cleanup2) cleanup2();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white text-white w-full overflow-x-hidden">
    {/* Navbar */}
    {showNavbar && (
        <nav className="fixed
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">STILLNESS</h1>
            <div className="space-x-4">
              <button className="text-sm px-4 py-1 rounded bg-white text-black font-semibold">Sign In</button>
              <button className="text-sm px-4 py-1 rounded border border-white">Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Pinned Scroll */}
      <section ref={pinnedSectionRef} className="relative min-h-[200vh] z-10">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center z-20">
          <SplitText
            text="Stillness."
            className="text-6xl md:text-8xl font-bold mb-4 z-20"
            splitType="chars"
          />
          <SplitText
            text="The Anti-Social Social Network."
            className="text-xl md:text-2xl text-white z-20"
            splitType="words"
            delay={80}
          />
        </div>

        {/* Video wrapper */}
        <div
          ref={videoWrapperRef}
          className="pointer-events-none fixed top-0 left-0 w-full h-screen z-0 flex items-center justify-center transition-all"
          style={{ willChange: "transform, borderRadius" }}
        >
          <video
            ref={videoRef}
            src="/assets/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Embedded Video View (after scaling ends) */}
      <section className="relative bg-white text-black flex flex-col items-center justify-center min-h-[100vh] px-6 py-20 z-30">
        <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-lg transition-all duration-500">
          <video
            src="/assets/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mt-12 mb-4">
          Write for Yourself, Not the Algorithm
        </h2>
        <p className="max-w-2xl text-center text-lg text-gray-700">
          Stillness lets you post quiet thoughts without validation. No likes, no followers — your posts fade after 24 hours. Just presence.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;