import { useEffect, useRef } from "react";
import SplitText from "../components/SplitText";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    const videoEl = videoRef.current;
    const containerEl = containerRef.current;

    gsap.to(videoEl, {
      scale: 0.5,
      y: 100,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerEl,
        start: "top top",
        end: "bottom+=200 top",
        scrub: true,
        pin: true,
      },
      transformOrigin: "center center",
    });

    gsap.fromTo(
      ".tagline",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerEl,
          start: "top top+=100",
          end: "bottom top+=200",
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(videoEl);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section
  ref={containerRef}
  className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden"
>

        {/* Background Video */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Overlay to dim video */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

        {/* Title & Tagline */}
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <SplitText
            text="Stillness"
            className="text-7xl md:text-9xl font-extrabold tracking-widest text-white"
            splitType="chars"
            delay={40}
            duration={0.8}
            to={{ opacity: 1, y: 0 }}
            from={{ opacity: 0, y: 50 }}
          />

          <p
            className="tagline mt-6 text-lg md:text-2xl uppercase tracking-wider font-light text-white"
            style={{ letterSpacing: "0.15em" }}
          >
            Your quiet space to be yourself — no noise, no followers
          </p>
        </div>
      </section>

      {/* Below Video Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-semibold mb-8 text-center">
          Discover peace in anonymity
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-700 leading-relaxed">
          Share your quiet thoughts and moments with no distractions or
          judgment. Here, your voice is just for you.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Stillness. All rights reserved.
      </footer>
    </main>
  );
}
