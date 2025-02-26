import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, MonitorPlay, MessageSquare, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const featuresRef = useRef(null);

  const features = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Join with Friends",
      description: "Create or join watch parties instantly with your friends from anywhere in the world."
    },
    {
      icon: <MonitorPlay className="w-12 h-12" />,
      title: "Watch Video Together",
      description: "Perfect synchronization across all devices. Play, pause, and seek together in real-time."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Seamless Experience",
      description: "Low-latency streaming with adaptive quality for the smoothest watching experience."
    },
    {
      icon: <MessageSquare className="w-12 h-12" />,
      title: "Chat with Buddies",
      description: "React and chat with your friends while watching. Share the excitement in real-time!"
    }
  ];

  useEffect(() => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
      // Initial card animation
      gsap.fromTo(card,
        { 
          opacity: 0,
          y: 100,
          rotateX: 45,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Icon animation
      gsap.to(card.querySelector('.feature-icon'), {
        y: -10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });

    // Parallax background effect
    gsap.to(".features-bg-gradient", {
      backgroundPosition: "0 100%",
      scrollTrigger: {
        trigger: ".features-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }, []);

  return (
    <div className="features-section py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="features-bg-gradient absolute inset-0 bg-gradient-to-b from-[#2A0944] to-[#3B0B5F]
                    before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_50%,rgba(147,54,180,0.2),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16
                     transform-gpu hover:scale-105 transition-transform duration-300">
          Experience the Magic
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective" ref={featuresRef}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative
                       p-8 rounded-xl
                       bg-gradient-to-br from-purple-900/50 to-purple-800/30
                       backdrop-blur-lg border border-purple-700/30
                       transform-gpu hover:scale-105 hover:rotate-y-[-5deg]
                       transition-all duration-500 ease-out
                       hover:shadow-[0_0_30px_rgba(147,54,180,0.3)]"
            >
              <div className="feature-icon text-purple-300 mb-6 transform-gpu transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-purple-200">{feature.description}</p>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-50
                            bg-gradient-to-br from-purple-500/20 to-transparent
                            rounded-tr-xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;