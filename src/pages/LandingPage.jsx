import { useRef, useEffect, useState } from "react";

// SplitText Component with enhanced animations
const SplitText = ({ text, className, splitType = "chars", delay = 40 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

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
      span.style.transform = "translateY(30px) rotateX(90deg)";
      span.style.display = "inline-block";
      span.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * delay}ms`;
      span.style.transformOrigin = "50% 50%";
      element.appendChild(span);
    });

    setTimeout(() => {
      const spans = element.querySelectorAll("span");
      spans.forEach(span => {
        span.style.opacity = "1";
        span.style.transform = "translateY(0) rotateX(0deg)";
      });
    }, 200);

  }, [text, splitType, delay]);

  return <div ref={elementRef} className={className}></div>;
};

// Enhanced smooth scroll-based animations
const createSmoothAnimations = () => {
  let ticking = false;
  
  const smoothUpdate = (callback) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };

  const timeline = (config = {}) => ({
    to: (target, props) => {
      if (config.scrollTrigger && target) {
        const handleScroll = () => {
          smoothUpdate(() => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const progress = Math.min(Math.max(scrollY / (windowHeight * 0.8), 0), 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            
            if (props.scale !== undefined) {
              const scale = 1 + (props.scale - 1) * easeProgress;
              const translateY = (props.yPercent || 0) * easeProgress;
              target.style.transform = `scale(${scale}) translateY(${translateY}%) translateZ(0)`;
            }
            
            if (props.borderTopLeftRadius) {
              const radius = 3 * easeProgress;
              target.style.borderTopLeftRadius = `${radius}rem`;
              target.style.borderTopRightRadius = `${radius}rem`;
            }
            
            if (props.opacity !== undefined) {
              target.style.opacity = 1 + (props.opacity - 1) * easeProgress;
            }
          });
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
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
      const threshold = window.innerHeight * 1.2;
      
      if (scrollY > threshold && config.onEnter) {
        config.onEnter();
      } else if (scrollY <= threshold && config.onLeaveBack) {
        config.onLeaveBack();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }
};

const gsap = createSmoothAnimations();
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const pinnedSectionRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth video scaling animation
      const cleanup1 = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }).to(videoWrapperRef.current, {
        scale: 0.6,
        yPercent: 80,
        borderTopLeftRadius: "2rem",
        borderTopRightRadius: "2rem",
        opacity: 0.95,
        ease: "power2.out",
      });

      // Navbar with smooth transition
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
    <div ref={containerRef} className="relative bg-black text-white w-full overflow-x-hidden selection:bg-white/20">
      {/* Enhanced Navbar */}
      <div className={`fixed top-0 left-0 w-full px-6 md:px-8 py-6 z-50 transition-all duration-1000 ease-out ${
        showNavbar 
          ? 'translate-y-0 opacity-100 bg-black/80 backdrop-blur-xl border-b border-white/5' 
          : '-translate-y-full opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-light tracking-[0.3em] text-white">STILLNESS</h1>
          <div className="flex items-center space-x-4">
            <button className="group relative text-sm md:text-base px-6 py-2.5 rounded-full bg-white/5 text-white font-light hover:bg-white hover:text-black transition-all duration-500 border border-white/20 backdrop-blur-sm overflow-hidden">
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            <button className="group relative text-sm md:text-base px-6 py-2.5 rounded-full border border-white/30 text-white hover:border-white transition-all duration-500 overflow-hidden">
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">Sign Up</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={pinnedSectionRef} className="relative min-h-[120vh] z-10">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center text-center z-30 relative">
          {/* Animated background elements */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at ${50 + mousePosition.x * 0.1}% ${50 + mousePosition.y * 0.1}%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}
          ></div>
         
          
          <div className="relative z-10 space-y-12 max-w-5xl mx-auto px-6">
            <div 
              className="transform transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)` }}
            >
              <SplitText
                text="Stillness."
                className="text-7xl md:text-9xl font-thin tracking-[0.1em] mb-8 text-white drop-shadow-2xl"
                splitType="chars"
                delay={120}
              />
            </div>
            
            {/* Elegant separator */}
            <div className="flex items-center justify-center space-x-4 my-12">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/40"></div>
              <div className="w-2 h-2 border border-white/40 rotate-45"></div>
              <div className="w-16 h-px bg-white/40"></div>
              <div className="w-2 h-2 border border-white/40 rotate-45"></div>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/40"></div>
            </div>
            
            <div 
              className="transform transition-transform duration-700 ease-out"
              style={{ transform: `translateX(${-mousePosition.x * 0.01}px) translateY(${-mousePosition.y * 0.01}px)` }}
            >
              <SplitText
                text="The  Anti-Social  Social  Network."
                className="text-lg md:text-xl text-white font-extralight tracking-[0.2em] max-w-3xl mx-auto leading-relaxed"
                splitType="words"
                delay={100}
              />
            </div>
          </div>
          
          
        </div>

        {/* Enhanced video wrapper with proper layering */}
        <div
          ref={videoWrapperRef}
          className="fixed top-0 left-0 w-full h-screen z-0 overflow-hidden"
          style={{ 
            willChange: "transform, borderRadius, opacity",
            transformStyle: "preserve-3d"
          }}
        >
          <video
            ref={videoRef}
            src="/assets/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.7) contrast(1.1)" }}
          />
          {/* Video overlay for better integration */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>
        </div>
      </section>

      {/* Enhanced content section */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center min-h-screen px-6 py-32 z-40">
        <div className="w-full max-w-5xl space-y-16">
          {/* Video showcase */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-sm group-hover:blur-md transition-all duration-500"></div>
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-all duration-700">
              <video
                src="/assets/hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto object-cover"
                style={{ filter: "brightness(0.9)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </div>
          
          {/* Enhanced content */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-thin tracking-wide leading-tight">
              Write for <span className="italic font-light">Yourself</span>,<br />
              Not the <span className="line-through opacity-60">Algorithm</span>
            </h2>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto my-8"></div>
            
            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto tracking-wide">
              Stillness lets you post quiet thoughts without validation. No likes, no followers — your posts fade after 24 hours. Just presence.
            </p>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
              {[
                { title: "No Metrics", desc: "Zero likes, shares, or followers" },
                { title: "24 Hour Fade", desc: "Thoughts disappear naturally" },
                { title: "Pure Intention", desc: "Write without seeking validation" }
              ].map((feature, i) => (
                <div key={i} className="group space-y-4 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-500 hover:bg-white/5">
                  <h3 className="text-xl font-light tracking-wider text-white group-hover:text-white/90 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 font-extralight tracking-wide text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-16">
              <button className="group relative px-12 py-4 text-lg font-light tracking-[0.2em] text-white border border-white/30 rounded-full hover:border-white transition-all duration-700 overflow-hidden">
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                  BEGIN YOUR STILLNESS
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;