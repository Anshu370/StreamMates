import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Palette, TestTube2, FileCode2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: "Anshu",
    role: "Backend Developer",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400",
    thoughts: "Optimizing database queries and scaling infrastructure are my passion. I believe in building robust systems that can handle millions of concurrent users.",
    icon: <Code2 className="w-8 h-8 text-purple-300" />
  },
  {
    name: "Rachit",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
    thoughts: "Creating seamless user experiences with beautiful animations is what drives me. Every pixel matters in crafting the perfect interface.",
    icon: <Palette className="w-8 h-8 text-purple-300" />
  },
  {
    name: "Aryan",
    role: "Content Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    thoughts: "Storytelling through content is an art. I focus on creating engaging narratives that resonate with our users and build community.",
    icon: <FileCode2 className="w-8 h-8 text-purple-300" />
  },
  {
    name: "Mudit",
    role: "QA Tester",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    thoughts: "Quality is not just about finding bugs, it's about ensuring the best possible user experience. Every test case tells a story.",
    icon: <TestTube2 className="w-8 h-8 text-purple-300" />
  }
];

const Team = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.team-card');
    
    cards.forEach((card, index) => {
      // Card entrance animation
      gsap.fromTo(card,
        { 
          opacity: 0,
          rotationY: 90,
          z: -100
        },
        {
          opacity: 1,
          rotationY: 0,
          z: 0,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Hover animation setup
      const front = card.querySelector('.card-front');
      const back = card.querySelector('.card-back');
      
      if (front && back) {
        gsap.set(back, { rotationY: 180 });
      }
    });
  }, []);

  return (
    <div className="py-20 bg-gradient-to-b from-[#3B0B5F] to-[#2A0944]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16
                     animate-gradient-text bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
          Meet the Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="team-card group perspective h-[400px] cursor-pointer"
            >
              <div className="relative w-full h-full transition-transform duration-1000 transform-style-3d group-hover:rotate-y-180">
                {/* Card Front */}
                <div className="card-front absolute inset-0 p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-purple-800/30
                              backdrop-blur-lg border border-purple-700/30
                              hover:shadow-[0_0_30px_rgba(147,54,180,0.3)]">
                  <div className="relative w-full pb-[100%] mb-6 overflow-hidden rounded-lg">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-300">{member.role}</p>
                  <div className="absolute bottom-4 right-4 opacity-50">{member.icon}</div>
                </div>

                {/* Card Back */}
                <div className="card-back absolute inset-0 p-6 rounded-xl bg-gradient-to-br from-purple-800/50 to-purple-900/30
                              backdrop-blur-lg border border-purple-700/30
                              hover:shadow-[0_0_30px_rgba(147,54,180,0.3)]
                              transform rotate-y-180 [backface-visibility:hidden]
                              flex flex-col justify-center items-center text-center">
                  <div className="mb-6">{member.icon}</div>
                  <p className="text-lg text-purple-200 leading-relaxed">
                    "{member.thoughts}"
                  </p>
                  <div className="mt-6">
                    <span className="text-purple-300 font-semibold">{member.name}</span>
                    <span className="text-purple-400 text-sm block">{member.role}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;