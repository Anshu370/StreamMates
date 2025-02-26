import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
  backgroundColor: string;
}

const PageTransition = ({ children, backgroundColor }: PageTransitionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    
    if (!section || !overlay) return;

    // Create a more dynamic color transition
    gsap.fromTo(overlay,
      {
        opacity: 1,
        background: (index) => `linear-gradient(135deg, 
          ${backgroundColor} 0%, 
          ${index % 2 ? '#3B0B5F' : '#2A0944'} 50%, 
          #2A0944 100%)`
      },
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "top top",
          toggleActions: "play none none reverse",
          scrub: 0.5
        }
      }
    );

    // Enhanced content reveal animation
    gsap.fromTo(section,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top center+=100",
          end: "top top",
          toggleActions: "play none none reverse",
          scrub: 0.2
        }
      }
    );

    // Add mobile-specific animations
    if (window.innerWidth <= 768) {
      gsap.fromTo(section,
        { x: -20 },
        {
          x: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [backgroundColor]);

  return (
    <div className="relative">
      {/* Enhanced transition overlay with multiple layers */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(135deg, 
            ${backgroundColor} 0%, 
            ${backgroundColor} 35%, 
            #2A0944 100%)`
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,54,180,0.1),transparent_70%)]" />
      </div>
      
      {/* Content container with enhanced mobile support */}
      <div
        ref={sectionRef}
        className="relative z-0 transform-gpu will-change-transform"
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;