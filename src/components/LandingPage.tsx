import React, { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Clock, ArrowRight, Twitter, Instagram } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Show confetti animation on load
  useEffect(() => {
    setShowConfetti(true);
    
    // Hide confetti after animation
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(confettiTimer);
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'AI Care Tips',
      description: 'Get personalized daily advice tailored to your pet\'s breed, age, and health needs.',
      emoji: '🐾'
    },
    {
      icon: Activity,
      title: 'Health Tracking',
      description: 'Log symptoms and weight changes with intelligent health monitoring.',
      emoji: '❤️'
    },
    {
      icon: MapPin,
      title: 'Vet Finder',
      description: 'Discover nearby veterinarians with ratings, specialties, and contact info.',
      emoji: '📍'
    },
    {
      icon: Clock,
      title: 'Reminders',
      description: 'Set care tasks and earn Paw Points for consistent pet care.',
      emoji: '🕐'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Coral Confetti Animation on Load */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 opacity-80 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: '#FF6F61',
                animationDelay: `${Math.random() * 3}s`,
                borderRadius: '50%',
                boxShadow: '0 0 6px #FF6F61',
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Paw Trail Background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-30 animate-paw-trail-loop"
            style={{
              left: `${5 + (i * 6)}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '8s',
              animationIterationCount: 'infinite',
            }}
          >
            <div className="w-8 h-8 text-3xl" style={{ color: '#26A69A' }}>🐾</div>
          </div>
        ))}
      </div>

      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Header with Bouncing Paw */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="animate-bounce text-4xl">🐾</div>
            <h1 
              className="text-4xl md:text-5xl font-bold animate-bounce-gentle"
              style={{ 
                fontFamily: 'Bubblegum Sans, cursive',
                background: 'linear-gradient(135deg, #26A69A 0%, #FF6F61 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              PetPal: Your AI Pet Care Companion
            </h1>
            <div className="animate-bounce text-4xl">🐾</div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-16">
          <div className="glassmorphic-card p-8 mb-8 max-w-3xl mx-auto text-center">
            {/* Wagging Dog Avatar */}
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto relative">
                {/* Dog body */}
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#26A69A' }}></div>
                
                {/* Dog face */}
                <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full" style={{ backgroundColor: '#1E8E85' }}>
                  {/* Animated eyes */}
                  <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full animate-pulse">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full animate-pulse">
                    <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  
                  {/* Nose */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
                  
                  {/* Mouth */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-4 border-b-2 border-white rounded-full"></div>
                </div>
                
                {/* Wagging tail */}
                <div className="absolute -right-6 top-10 w-8 h-8 rounded-full animate-wag origin-left" style={{ backgroundColor: '#26A69A' }}></div>
              </div>
            </div>

            {/* Tagline */}
            <h2 
              className="text-xl md:text-2xl mb-8 leading-relaxed"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#37474F'
              }}
            >
              Care for your pet like never before with AI!
            </h2>

            {/* Get Started Button */}
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 animate-pulse-on-hover focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center space-x-3 mx-auto"
              style={{
                backgroundColor: '#26A69A',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 32px 0 rgba(38, 166, 154, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 
            className="text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              color: '#37474F'
            }}
          >
            Everything Your Pet Needs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glassmorphic-card p-6 hover:scale-105 transition-all duration-300 border-coral-glow"
                style={{ 
                  backgroundColor: 'rgba(255, 111, 97, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #FF6F61'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(38, 166, 154, 0.2)' }}
                  >
                    <feature.icon size={24} style={{ color: '#26A69A' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          color: '#37474F'
                        }}
                      >
                        {feature.title}
                      </h3>
                      <span className="text-xl">{feature.emoji}</span>
                    </div>
                    <p 
                      className="leading-relaxed"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#37474F',
                        fontSize: '16px'
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div className="glassmorphic-card p-8 text-center max-w-2xl mx-auto" style={{ backgroundColor: 'rgba(255, 213, 79, 0.2)' }}>
            <div className="text-4xl mb-4">🏆</div>
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#37474F'
              }}
            >
              Join Thousands of Happy Pet Parents
            </h3>
            <p 
              className="mb-6"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#546E7A'
              }}
            >
              Start your journey to better pet care today. Create your free account and unlock personalized AI recommendations.
            </p>
            <button
              onClick={onGetStarted}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                backgroundColor: '#FFD54F',
                color: '#37474F',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Start Free Today
            </button>
          </div>
        </section>

        {/* Glassmorphic Footer */}
        <footer className="glassmorphic-card p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Built with Bolt.new Badge */}
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="glassmorphic-badge inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span style={{ color: '#546E7A' }}>Built with</span>
              <span className="font-semibold" style={{ color: '#26A69A' }}>Bolt.new</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#26A69A', color: 'white' }}>+ Voice AI</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#FFD54F' }}
                title="Follow us on Twitter"
              >
                <Twitter size={18} style={{ color: '#37474F' }} />
              </button>
              <button 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#FFD54F' }}
                title="Follow us on Instagram"
              >
                <Instagram size={18} style={{ color: '#37474F' }} />
              </button>
            </div>

            {/* Copyright */}
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#546E7A'
              }}
            >
              © 2025 PetPal
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;