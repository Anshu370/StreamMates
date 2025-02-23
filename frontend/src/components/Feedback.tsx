import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Sarah K.",
    role: "Movie Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    content: "StreamMates has completely changed how I watch movies with my friends. The synchronization is perfect!",
    rating: 5
  },
  {
    name: "Michael R.",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    content: "As a streamer, this platform has made watch parties with my community incredibly easy and fun.",
    rating: 5
  },
  {
    name: "Emily W.",
    role: "TV Series Fan",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    content: "The chat features and reactions make watching shows together feel like we're all in the same room.",
    rating: 4
  }
];

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const statsRef = useRef(null);

  useEffect(() => {
    // Animate testimonial cards
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 50,
          rotateY: 45
        },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animate statistics
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = parseInt(stat.textContent || '0', 10);
      gsap.fromTo(stat,
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="py-20 bg-gradient-to-b from-[#3B0B5F] to-[#2A0944] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,54,180,0.1),transparent_70%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Statistics Section */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { label: "Active Users", value: "50K" },
            { label: "Watch Parties", value: "100K" },
            { label: "Hours Streamed", value: "1M" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-xl
                                    bg-gradient-to-br from-purple-900/30 to-purple-800/20
                                    backdrop-blur-sm border border-purple-700/20">
              <div className="stat-number text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-purple-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group
                       p-6 rounded-xl
                       bg-gradient-to-br from-purple-900/40 to-purple-800/20
                       backdrop-blur-lg border border-purple-700/30
                       transform-gpu hover:scale-105 hover:rotate-y-[-5deg]
                       transition-all duration-500
                       hover:shadow-[0_0_30px_rgba(147,54,180,0.3)]"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4
                           ring-2 ring-purple-500 ring-offset-2 ring-offset-purple-900"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-purple-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-purple-400 mb-2 opacity-50" />
              <p className="text-purple-200">{testimonial.content}</p>
            </div>
          ))}
        </div>

        {/* Feedback Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Share Your Experience
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 rounded-xl
                         bg-purple-900/30 border border-purple-700/30
                         text-white placeholder-purple-300
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         transform-gpu transition-all duration-300
                         group-hover:shadow-[0_0_20px_rgba(147,54,180,0.2)]"
                required
              />
            </div>

            <div className="group">
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 rounded-xl
                         bg-purple-900/30 border border-purple-700/30
                         text-white placeholder-purple-300
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         transform-gpu transition-all duration-300
                         group-hover:shadow-[0_0_20px_rgba(147,54,180,0.2)]"
                required
              />
            </div>

            <div className="group">
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-6 py-4 rounded-xl
                         bg-purple-900/30 border border-purple-700/30
                         text-white placeholder-purple-300
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         transform-gpu transition-all duration-300
                         group-hover:shadow-[0_0_20px_rgba(147,54,180,0.2)]"
                rows={4}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 rounded-xl
                       bg-gradient-to-r from-purple-600 to-purple-800
                       text-white font-semibold text-lg
                       transform-gpu hover:scale-105
                       transition-all duration-300
                       hover:shadow-[0_0_30px_rgba(147,54,180,0.5)]
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Send Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;