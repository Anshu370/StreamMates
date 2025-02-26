import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Monitor, Smartphone, Tablet, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const devicesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Initial animations
    tl.fromTo(".hero-bg", 
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    )
    .fromTo(titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(".floating-device",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
      "-=0.5"
    );

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      gsap.to(".floating-device", {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: "power2.out",
        stagger: {
          amount: 0.3,
          from: "random"
        }
      });
    };

    // Floating animation for devices
    gsap.to(".floating-device", {
      y: "random(-20, 20)",
      rotation: "random(-10, 10)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "none",
      stagger: {
        amount: 2,
        from: "random"
      }
    });

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleStartStream = () => {
    navigate('/login');
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg perspective"
      style={{
        background: "linear-gradient(135deg, #2A0944 0%, #9336B4 100%)"
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,54,180,0.2),transparent_70%)]"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/20"
              style={{
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                transform: `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5})`,
                animation: `float ${Math.random() * 5 + 5}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 
          ref={titleRef}
          className="text-7xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200
                     transform-gpu hover:scale-105 transition-transform duration-500"
        >
          StreamMates
        </h1>
        
        <div 
          ref={subtitleRef}
          className="space-y-6 transform-gpu hover:translate-y-[-5px] transition-transform duration-300"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">
            SYNC STREAM CELEBRATE
          </h2>
          <p className="text-xl md:text-2xl text-purple-200">
            Watch Together, No Matter The Distance!
          </p>
        </div>

        <div 
          ref={devicesRef}
          className="mt-16 flex justify-center items-center gap-8 perspective"
        >
          <Monitor className="floating-device w-16 h-16 text-white transform-gpu hover:scale-110 transition-transform duration-300" />
          <Smartphone className="floating-device w-16 h-16 text-white transform-gpu hover:scale-110 transition-transform duration-300" />
          <Play className="floating-device w-20 h-20 text-purple-300 transform-gpu hover:scale-110 transition-transform duration-300" />
          <Tablet className="floating-device w-16 h-16 text-white transform-gpu hover:scale-110 transition-transform duration-300" />
        </div>

        <button 
          onClick={handleStartStream}
          className="mt-12 px-8 py-4 bg-purple-600 text-white rounded-full text-xl font-semibold
                     relative overflow-hidden group
                     transform-gpu hover:scale-105 transition-all duration-300
                     hover:shadow-[0_0_20px_rgba(147,54,180,0.5)]
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
        >
          <span className="relative z-10">Start Streaming</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default Hero;