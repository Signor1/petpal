import React, { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Clock, ArrowRight, Twitter, Instagram, Sun, Moon, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [eyePosition, setEyePosition] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Show confetti and fade-in animation on load
  useEffect(() => {
    setShowConfetti(true);
    
    // Trigger fade-in animation
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Hide confetti after animation
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  // Animated eyes that follow cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const leftEye = document.getElementById('left-eye');
      const rightEye = document.getElementById('right-eye');
      
      if (leftEye && rightEye) {
        const leftRect = leftEye.getBoundingClientRect();
        const rightRect = rightEye.getBoundingClientRect();
        
        const leftCenterX = leftRect.left + leftRect.width / 2;
        const leftCenterY = leftRect.top + leftRect.height / 2;
        const rightCenterX = rightRect.left + rightRect.width / 2;
        const rightCenterY = rightRect.top + rightRect.height / 2;
        
        const leftAngle = Math.atan2(e.clientY - leftCenterY, e.clientX - leftCenterX);
        const rightAngle = Math.atan2(e.clientY - rightCenterY, e.clientX - rightCenterX);
        
        const leftX = Math.cos(leftAngle) * 3;
        const leftY = Math.sin(leftAngle) * 3;
        const rightX = Math.cos(rightAngle) * 3;
        const rightY = Math.sin(rightAngle) * 3;
        
        setEyePosition({ 
          left: { x: leftX, y: leftY }, 
          right: { x: rightX, y: rightY } 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: Heart,
      title: 'AI-Powered Care Tips',
      description: 'Get personalized daily advice powered by advanced AI algorithms tailored to your pet\'s specific breed, age, and health conditions.',
      gradient: 'from-pink-500 to-rose-400'
    },
    {
      icon: Activity,
      title: 'Health Tracking',
      description: 'Comprehensive health monitoring with intelligent symptom analysis, weight tracking, and AI-generated health insights.',
      gradient: 'from-emerald-500 to-teal-400'
    },
    {
      icon: MapPin,
      title: 'Vet Finder',
      description: 'Discover nearby veterinarians with detailed profiles, ratings, specialties, and emergency service availability.',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: Clock,
      title: 'Reminders & Points',
      description: 'Smart task scheduling with gamified rewards system. Earn Paw Points for consistent pet care and unlock achievements.',
      gradient: 'from-amber-500 to-yellow-400'
    }
  ];

  const themeStyles = {
    background: isDarkMode ? '#263238' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#37474F',
    textSecondary: isDarkMode ? '#B0BEC5' : '#546E7A',
    cardBg: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
    border: isDarkMode ? 'rgba(176, 190, 197, 0.3)' : 'rgba(176, 190, 197, 0.5)'
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-all duration-700"
      style={{ backgroundColor: themeStyles.background }}
    >
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50 glassmorphic-card"
        style={{ 
          backgroundColor: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          color: '#FFC107'
        }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Blush Coral Confetti Animation on Load */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 opacity-80 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: '#FF8A80',
                animationDelay: `${Math.random() * 3}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                boxShadow: '0 0 8px #FF8A80',
              }}
            />
          ))}
        </div>
      )}

      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-paw-trail-loop"
            style={{
              left: `${3 + (i * 5)}%`,
              top: `${10 + (i % 6) * 15}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: '12s',
              animationIterationCount: 'infinite',
            }}
          >
            <div className="w-6 h-6 text-2xl" style={{ color: isDarkMode ? '#B0BEC5' : '#00695C' }}>
              {i % 3 === 0 ? '🐾' : i % 3 === 1 ? '⭐' : '💫'}
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section - Full Screen Banner */}
        <section 
          className={`min-h-screen flex flex-col justify-center items-center text-center transition-all duration-1000 ${
            isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
        >
          {/* Animated Pet Silhouette */}
          <div className="mb-8 relative">
            <div className="w-40 h-40 mx-auto relative">
              {/* Pet silhouette with glowing eyes */}
              <div 
                className="absolute inset-0 rounded-full transition-all duration-700"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(0, 105, 92, 0.3)' : 'rgba(255, 138, 128, 0.3)',
                  boxShadow: isDarkMode 
                    ? '0 0 40px rgba(0, 105, 92, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
                    : '0 0 40px rgba(255, 138, 128, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Glowing Eyes */}
                <div 
                  id="left-eye"
                  className="absolute top-12 left-12 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-700"
                  style={{ 
                    backgroundColor: '#FFC107',
                    boxShadow: '0 0 15px #FFC107'
                  }}
                >
                  <div 
                    className="w-3 h-3 bg-black rounded-full transition-transform duration-200"
                    style={{ 
                      transform: `translate(${eyePosition.left.x}px, ${eyePosition.left.y}px)` 
                    }}
                  ></div>
                </div>
                <div 
                  id="right-eye"
                  className="absolute top-12 right-12 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-700"
                  style={{ 
                    backgroundColor: '#FFC107',
                    boxShadow: '0 0 15px #FFC107'
                  }}
                >
                  <div 
                    className="w-3 h-3 bg-black rounded-full transition-transform duration-200"
                    style={{ 
                      transform: `translate(${eyePosition.right.x}px, ${eyePosition.right.y}px)` 
                    }}
                  ></div>
                </div>
                
                {/* Pet features */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#263238' }}></div>
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-3 border-gray-800 rounded-full"></div>
              </div>
              
              {/* Floating particles around pet */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute animate-heart-float"
                  style={{
                    left: `${20 + (i % 3) * 30}%`,
                    top: `${15 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  <Star size={12} style={{ color: '#FFC107' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Hero Title */}
          <h1 
            className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: themeStyles.text,
              textShadow: isDarkMode ? '0 0 20px rgba(255, 255, 255, 0.3)' : '0 0 20px rgba(0, 0, 0, 0.1)',
              animationDelay: '0.3s'
            }}
          >
            PetPal: Elevate Your Pet's Care with AI
          </h1>

          {/* Hero Subtitle */}
          <p 
            className={`text-xl md:text-2xl mb-12 max-w-3xl leading-relaxed transition-all duration-1000 ${
              isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              color: themeStyles.textSecondary,
              animationDelay: '0.6s'
            }}
          >
            Experience premium pet care with AI-powered insights, comprehensive health tracking, 
            and personalized recommendations that adapt to your pet's unique needs.
          </p>

          {/* Get Started Button */}
          <button
            onClick={onGetStarted}
            className={`px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-105 animate-pulse-on-hover focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center space-x-4 ${
              isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
            style={{ 
              fontFamily: 'Inter, sans-serif',
              background: 'linear-gradient(135deg, #00695C 0%, #FF8A80 100%)',
              color: '#FFFFFF',
              boxShadow: '0 10px 40px rgba(0, 105, 92, 0.4), 0 0 20px rgba(255, 138, 128, 0.3)',
              animationDelay: '0.9s'
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={24} />
          </button>
        </section>

        {/* Features Section with Parallax */}
        <section className="py-20">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 transition-all duration-700"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: themeStyles.text
            }}
          >
            Premium Features for Modern Pet Care
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glassmorphic-card p-8 hover:scale-105 transition-all duration-500 group"
                style={{ 
                  backgroundColor: themeStyles.cardBg,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${themeStyles.border}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="flex items-start space-x-6">
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110`}
                    style={{ 
                      background: `linear-gradient(135deg, ${feature.gradient.includes('pink') ? '#FF8A80' : feature.gradient.includes('emerald') ? '#00695C' : feature.gradient.includes('blue') ? '#00695C' : '#FFC107'} 0%, ${feature.gradient.includes('pink') ? '#FF8A80' : feature.gradient.includes('emerald') ? '#00695C' : feature.gradient.includes('blue') ? '#00695C' : '#FFC107'} 100%)`,
                      boxShadow: `0 8px 24px rgba(${feature.gradient.includes('pink') ? '255, 138, 128' : feature.gradient.includes('emerald') ? '0, 105, 92' : feature.gradient.includes('blue') ? '0, 105, 92' : '255, 193, 7'}, 0.3)`
                    }}
                  >
                    <feature.icon size={28} color="#FFFFFF" />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: themeStyles.text
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="leading-relaxed"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: themeStyles.textSecondary,
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

        {/* Testimonial Section */}
        <section className="py-20">
          <div 
            className="glassmorphic-card p-12 max-w-4xl mx-auto text-center"
            style={{ 
              backgroundColor: themeStyles.cardBg,
              backdropFilter: 'blur(12px)',
              border: `1px solid ${themeStyles.border}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="mb-6">
              <div className="flex justify-center space-x-2 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={24} className="fill-current" style={{ color: '#FFC107' }} />
                ))}
              </div>
              <blockquote 
                className="text-2xl md:text-3xl font-medium italic mb-6"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  color: themeStyles.text
                }}
              >
                "PetPal makes caring for Luna effortless! The AI recommendations are spot-on, 
                and the health tracking gives me peace of mind every day."
              </blockquote>
              <cite 
                className="text-lg font-semibold"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#FFC107'
                }}
              >
                — Sarah, Pet Owner
              </cite>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="glassmorphic-card p-8 mt-20"
          style={{ 
            backgroundColor: themeStyles.cardBg,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${themeStyles.border}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Built with Bolt.new Badge */}
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                backgroundColor: themeStyles.cardBg,
                border: `1px solid ${themeStyles.border}`,
                color: themeStyles.textSecondary
              }}
            >
              <span>Built with</span>
              <span className="font-semibold" style={{ color: '#00695C' }}>Bolt.new</span>
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#00695C', color: '#FFFFFF' }}>+ Voice AI</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#FFC107' }}
                title="Follow us on Twitter"
              >
                <Twitter size={20} style={{ color: '#263238' }} />
              </button>
              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#FFC107' }}
                title="Follow us on Instagram"
              >
                <Instagram size={20} style={{ color: '#263238' }} />
              </button>
            </div>

            {/* Copyright */}
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: themeStyles.text
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