import React, { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Clock, ArrowRight, Twitter, Instagram, Star } from 'lucide-react';

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

  const handleGetStarted = () => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    onGetStarted();
  };

  const features = [
    {
      icon: Heart,
      title: 'AI Care Tips',
      description: 'Get personalized daily advice tailored to your pet\'s breed, age, and health needs with our advanced AI system.',
      color: '#4A90E2',
      emoji: '🐾'
    },
    {
      icon: Activity,
      title: 'Health Tracking',
      description: 'Log symptoms and weight changes with intelligent health monitoring and get instant recommendations.',
      color: '#F28C38',
      emoji: '❤️'
    },
    {
      icon: MapPin,
      title: 'Vet Finder',
      description: 'Discover nearby veterinarians with ratings, specialties, emergency services, and verified reviews.',
      color: '#A8D5BA',
      emoji: '📍'
    },
    {
      icon: Clock,
      title: 'Reminders & Points',
      description: 'Set care tasks, get timely notifications, and earn Paw Points for consistent pet care habits.',
      color: '#F5E8C7',
      emoji: '🕐'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Custom Bolt.new Badge Configuration */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .bolt-badge {
            transition: all 0.3s ease;
          }
          @keyframes badgeIntro {
            0% { transform: rotateY(-90deg); opacity: 0; }
            100% { transform: rotateY(0deg); opacity: 1; }
          }
          .bolt-badge-intro {
            animation: badgeIntro 0.8s ease-out 1s both;
          }
          .bolt-badge-intro.animated {
            animation: none;
          }
          @keyframes badgeHover {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(22deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          .bolt-badge:hover {
            animation: badgeHover 0.6s ease-in-out;
          }
        `
      }} />
      
      {/* Hackathon Required Badge */}
      <div className="fixed top-4 right-4 z-50">
        <a href="https://bolt.new/?rid=os72mi" target="_blank" rel="noopener noreferrer" 
           className="block transition-all duration-300 hover:shadow-2xl">
          <img src="https://storage.bolt.army/black_circle_360x360.png" 
               alt="Built with Bolt.new badge" 
               className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
               onAnimationEnd={(e) => e.currentTarget.classList.add('animated')} />
        </a>
      </div>

      {/* Soft Blue Confetti Animation on Load */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 opacity-70 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: '#4A90E2',
                animationDelay: `${Math.random() * 3}s`,
                borderRadius: '50%',
                boxShadow: '0 0 8px #4A90E2',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#333333'
                }}
              >
                PetPal: Your Pet's{' '}
                <span 
                  className="block"
                  style={{ 
                    background: 'linear-gradient(135deg, #F28C38 0%, #4A90E2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  AI-Powered Companion
                </span>
              </h1>
              
              <p 
                className="text-xl mb-8 leading-relaxed"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#666666',
                  maxWidth: '500px'
                }}
              >
                Transform your pet care routine with personalized AI recommendations, health tracking, and expert guidance - all in one beautiful app.
              </p>

              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 flex items-center space-x-3"
                style={{
                  backgroundColor: '#F28C38',
                  color: '#FFFFFF',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: '0 8px 25px rgba(242, 140, 56, 0.3)',
                  borderRadius: '12px'
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </button>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className="fill-current" style={{ color: '#F28C38' }} />
                  ))}
                </div>
                <p 
                  className="text-sm"
                  style={{ 
                    fontFamily: 'Poppins, sans-serif',
                    color: '#666666'
                  }}
                >
                  Trusted by 10,000+ pet parents
                </p>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden shadow-2xl" style={{ borderRadius: '12px' }}>
                {/* High-resolution dog image placeholder with zoom effect */}
                <div 
                  className="w-full h-96 bg-gradient-to-br from-orange-100 to-blue-100 flex items-center justify-center transition-transform duration-700 hover:scale-105"
                  style={{ 
                    backgroundImage: 'url("https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 bg-white p-3 shadow-lg animate-bounce" style={{ borderRadius: '12px' }}>
                  <Heart size={24} style={{ color: '#F28C38' }} />
                </div>
                <div className="absolute bottom-4 left-4 bg-white p-3 shadow-lg animate-pulse" style={{ borderRadius: '12px' }}>
                  <span className="text-2xl">🐾</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#333333'
              }}
            >
              Everything Your Pet Needs
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#666666'
              }}
            >
              Comprehensive pet care tools powered by artificial intelligence to keep your furry friend healthy and happy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-16 h-16 flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${feature.color}20`,
                      borderRadius: '12px'
                    }}
                  >
                    <feature.icon size={28} style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 
                        className="text-xl font-semibold"
                        style={{ 
                          fontFamily: 'Poppins, sans-serif',
                          color: '#333333'
                        }}
                      >
                        {feature.title}
                      </h3>
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                    <p 
                      className="leading-relaxed"
                      style={{ 
                        fontFamily: 'Poppins, sans-serif',
                        color: '#666666',
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
        <section className="mb-20">
          <div 
            className="p-12 text-center max-w-4xl mx-auto"
            style={{ 
              backgroundColor: '#4A90E2',
              background: 'linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%)',
              borderRadius: '12px'
            }}
          >
            <div className="mb-6">
              <div className="flex justify-center space-x-1 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={24} className="fill-current text-yellow-300" />
                ))}
              </div>
              <blockquote 
                className="text-2xl md:text-3xl font-medium mb-6 italic"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#FFFFFF'
                }}
              >
                "PetPal keeps Milo healthy and happy! The AI recommendations are spot-on and the reminders help me stay consistent with his care routine."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div 
                  className="w-16 h-16 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#F5E8C7',
                    borderRadius: '12px'
                  }}
                >
                  <span className="text-2xl">👩</span>
                </div>
                <div className="text-left">
                  <p 
                    className="font-semibold text-lg"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: '#FFFFFF'
                    }}
                  >
                    Emma Johnson
                  </p>
                  <p 
                    className="text-sm opacity-90"
                    style={{ 
                      fontFamily: 'Poppins, sans-serif',
                      color: '#FFFFFF'
                    }}
                  >
                    Golden Retriever Owner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-16">
          <div 
            className="bg-white p-12 text-center shadow-xl border border-gray-100"
            style={{ borderRadius: '12px' }}
          >
            <div className="text-6xl mb-6">🏆</div>
            <h3 
              className="text-3xl font-bold mb-6"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#333333'
              }}
            >
              Join Thousands of Happy Pet Parents
            </h3>
            <p 
              className="text-lg mb-8 max-w-2xl mx-auto"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#666666'
              }}
            >
              Start your journey to better pet care today. Create your free account and unlock personalized AI recommendations, health tracking, and expert guidance.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200"
              style={{
                backgroundColor: '#F28C38',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 8px 25px rgba(242, 140, 56, 0.3)',
                borderRadius: '12px'
              }}
            >
              Start Free Today
            </button>
            
            {/* Additional benefits */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: '#666666' }}>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="bg-white p-8 shadow-lg border border-gray-100"
          style={{ borderRadius: '12px' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* Built with Bolt.new Badge */}
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 px-6 py-3 transition-all duration-300 hover:scale-105 bg-gray-50 hover:bg-gray-100"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                borderRadius: '12px'
              }}
            >
              <span style={{ color: '#666666' }}>Built with</span>
              <span className="font-semibold" style={{ color: '#4A90E2' }}>Bolt.new</span>
              <span className="text-xs px-3 py-1 text-white" style={{ backgroundColor: '#4A90E2', borderRadius: '12px' }}>+ Voice AI</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <button 
                className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                style={{ 
                  backgroundColor: '#F28C38',
                  borderRadius: '12px'
                }}
                title="Follow us on Twitter"
              >
                <Twitter size={20} style={{ color: '#FFFFFF' }} />
              </button>
              <button 
                className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                style={{ 
                  backgroundColor: '#F28C38',
                  borderRadius: '12px'
                }}
                title="Follow us on Instagram"
              >
                <Instagram size={20} style={{ color: '#FFFFFF' }} />
              </button>
            </div>

            {/* Copyright */}
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                color: '#666666'
              }}
            >
              © 2025 PetPal. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;