import React, { useState } from 'react';
import { Heart, Mail, LogIn, AlertTriangle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, isNewUser: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Enter a valid email!');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user exists in localStorage
    const userProfileKey = `petpal-profile-${email.toLowerCase()}`;
    const existingProfile = localStorage.getItem(userProfileKey);
    
    if (existingProfile) {
      // Existing user - load their data
      onLogin(email, false);
    } else {
      // New user - redirect to profile creation
      onLogin(email, true);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = email.trim() && isValidEmail(email);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
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

      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <header className="text-center mb-12">
          {/* Animated Pet Avatar */}
          <div className="w-28 h-28 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: '#26A69A' }}></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full" style={{ backgroundColor: '#1E8E85' }}>
              {/* Eyes */}
              <div className="absolute top-5 left-5 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute top-5 right-5 w-3 h-3 bg-white rounded-full"></div>
              {/* Nose */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              {/* Mouth */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-5 h-3 border-b-2 border-white rounded-full"></div>
            </div>
            {/* Wagging tail */}
            <div className="absolute -right-4 top-8 w-5 h-5 rounded-full animate-wag origin-left" style={{ backgroundColor: '#26A69A' }}></div>
          </div>

          <h1 
            className="text-4xl font-bold mb-4 animate-bounce-gentle"
            style={{ 
              fontFamily: 'Bubblegum Sans, cursive',
              fontSize: '32px',
              background: 'linear-gradient(135deg, #26A69A 0%, #FF6F61 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome to PetPal
          </h1>
          <p className="text-lg mb-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
            Your caring companion for pet wellness
          </p>
          <p className="text-sm" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
            Sign in to access your personalized pet care dashboard
          </p>
        </header>

        {/* Glassmorphic Login Form */}
        <div className="glassmorphic-card p-8 mb-8 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 glassmorphic-icon mx-auto mb-4">
              <Heart size={28} style={{ color: '#FF6F61' }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
              Sign In to Continue
            </h2>
            <p className="text-sm" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
              Enter your email to access your pet's profile
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold mb-3 flex items-center space-x-2"
                style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}
              >
                <Mail size={16} style={{ color: '#546E7A' }} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`glassmorphic-input w-full px-4 py-4 rounded-xl transition-all duration-300 text-lg ${
                  error 
                    ? 'border-coral-glow-error' 
                    : 'border-coral-glow'
                }`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: '#37474F'
                }}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
              {error && (
                <div className="mt-3 p-3 glassmorphic-error rounded-lg animate-fade-in">
                  <p className="text-sm flex items-center space-x-2" style={{ color: '#D32F2F', fontFamily: 'Inter, sans-serif' }}>
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!isFormValid || isLoading}
              className={`glassmorphic-button w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${
                isFormValid && !isLoading
                  ? 'hover:scale-105 hover:shadow-neumorphic-hover animate-pulse-on-hover'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 animate-spin" style={{ color: '#FFD54F' }}>🐾</div>
                  <span style={{ color: 'white' }}>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} style={{ color: 'white' }} />
                  <span style={{ color: 'white' }}>Log In</span>
                  <div className="text-xl">🐾</div>
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-6 glassmorphic-helper p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#26A69A' }}>
                  <span className="text-white text-xs">💡</span>
                </div>
              </div>
              <div className="text-sm" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                <p className="font-medium mb-1">New to PetPal?</p>
                <p>Just enter your email and we'll help you create your pet's profile!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <div className="glassmorphic-feature-card p-4 text-center">
            <div className="text-2xl mb-2">🏥</div>
            <p className="text-sm font-medium" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>Find Vets</p>
          </div>
          <div className="glassmorphic-feature-card p-4 text-center">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-sm font-medium" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>AI Care Tips</p>
          </div>
          <div className="glassmorphic-feature-card p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>Health Tracker</p>
          </div>
          <div className="glassmorphic-feature-card p-4 text-center">
            <div className="text-2xl mb-2">🔔</div>
            <p className="text-sm font-medium" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>Reminders</p>
          </div>
        </div>

        {/* Glassmorphic Footer */}
        <footer className="text-center pt-8">
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
        </footer>
      </div>
    </div>
  );
};

export default LoginScreen;

export default LoginScreen