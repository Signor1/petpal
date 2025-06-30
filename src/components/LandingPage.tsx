import React, { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Clock, ArrowRight, Twitter, Instagram } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [eyePosition, setEyePosition] = useState({ left: 0, right: 0 });

  // Show confetti on load
  useEffect(() => {
    setShowConfetti(true);
    
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
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
        
        const leftX = Math.cos(leftAngle) * 2;
        const leftY = Math.sin(leftAngle) * 2;
        const rightX = Math.cos(rightAngle) * 2;
        const rightY = Math.sin(rightAngle) * 2;
        
        setEyePosition({ 
          left: { x: leftX, y: leftY }, 
          right: { x: rightX, y: rightY } 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Heart,
      title: 'AI Care Tips',
      description: 'Get personalized daily advice powered by AI for your pet\'s specific needs and breed.',
      color: '#FF6F61'
    },
    {
      icon: Activity,
      title: 'Health Tracking',
      description: 'Log symptoms, weight, and health data with intelligent AI suggestions for care.',
      color: '#26A69A'
    },
    {
      icon: MapPin,
      title: 'Vet Finder',
      description: 'Find nearby veterinarians with ratings, specialties, and emergency services.',
      color: '#FFD54F'
    },
    {
      icon: Clock,
      title: 'Reminders',
      description: 'Set care tasks and reminders to earn Paw Points and keep your pet healthy.',
      color: '#FF6F61'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Confetti Animation on Load */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
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
            className="absolute opacity-20 animate-paw-trail-loop"
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
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="animate-bounce-gentle mr-4">
              <div className="text-4xl">🐾</div>
            </div>
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-16">
          <div className="glassmorphic-card p-8 max-w-2xl mx-auto text-center">
            {/* Animated Dog Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              {/* Dog body */}
              <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#FFD54F' }}></div>
              
              {/* Dog face */}
              <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full" style={{ backgroundColor: '#FFEB3B' }}>
                {/* Animated Eyes */}
                <div 
                  id="left-eye"
                  className="absolute top-6 left-6 w-4 h-4 bg-black rounded-full flex items-center justify-center"
                >
                  <div 
                    className="w-2 h-2 bg-white rounded-full transition-transform duration-100"
                    style={{ 
                      transform: `translate(${eyePosition.left?.x || 0}px, ${eyePosition.left?.y || 0}px)` 
                    }}
                  ></div>
                </div>
                <div 
                  id="right-eye"
                  className="absolute top-6 right-6 w-4 h-4 bg-black rounded-full flex items-center justify-center"
                >
                  <div 
                    className="w-2 h-2 bg-white rounded-full transition-transform duration-100"
                    style={{ 
                      transform: `translate(${eyePosition.right?.x || 0}px, ${eyePosition.right?.y || 0}px)` 
                    }}
                  ></div>
                </div>
                
                {/* Nose */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black rounded-full"></div>
                
                {/* Mouth */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-full"></div>
              </div>
              
              {/* Wagging tail */}
              <div className="absolute -right-4 top-8 w-6 h-6 rounded-full animate-wag origin-left" style={{ backgroundColor: '#FFD54F' }}></div>
              
              {/* Ears */}
              <div className="absolute -top-2 left-4 w-8 h-12 rounded-full transform -rotate-12" style={{ backgroundColor: '#FFC107' }}></div>
              <div className="absolute -top-2 right-4 w-8 h-12 rounded-full transform rotate-12" style={{ backgroundColor: '#FFC107' }}></div>
            </div>

            <h2 
              className="text-xl md:text-2xl font-semibold mb-6"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#37474F'
              }}
            >
              Care for your pet like never before with AI!
            </h2>

            <p 
              className="text-lg mb-8 leading-relaxed"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#546E7A'
              }}
            >
              Experience the future of pet care with personalized AI recommendations, 
              health tracking, and smart reminders tailored to your furry friend's unique needs.
            </p>

            <button
              onClick={onGetStarted}
              className="glassmorphic-button px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 animate-pulse-on-hover focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center space-x-3 mx-auto"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: 'white'
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
              fontFamily: 'Bubblegum Sans, cursive',
              color: '#26A69A'
            }}
          >
            Powerful Features for Pet Care
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glassmorphic-card p-6 hover:scale-105 transition-all duration-300 border-coral-glow"
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon size={24} style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="text-lg font-semibold mb-3"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#37474F'
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: '#546E7A'
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
        <section className="text-center mb-16">
          <div className="glassmorphic-card p-8 max-w-xl mx-auto" style={{ backgroundColor: 'rgba(38, 166, 154, 0.1)' }}>
            <h3 
              className="text-xl font-bold mb-4"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#26A69A'
              }}
            >
              Ready to Transform Pet Care?
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#546E7A'
              }}
            >
              Join thousands of pet owners who trust PetPal for smarter, more caring pet management.
            </p>
            <button
              onClick={onGetStarted}
              className="glassmorphic-button px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: 'white'
              }}
            >
              Start Your Journey
            </button>
          </div>
        </section>

        {/* Glassmorphic Footer */}
        <footer className="glassmorphic-card p-6 text-center">
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