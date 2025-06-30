import React, { useState } from 'react';
import { Heart, Mail, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, isNewUser: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPawTrail, setShowPawTrail] = useState(true);

  const handleLogin = async () => {
    if (!email.trim()) return;

    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('petpal-users') || '{}');
    const userExists = existingUsers[email.toLowerCase()];

    if (userExists) {
      // Load existing user's pet data
      const userData = JSON.parse(localStorage.getItem('petpal-profile') || '{}');
      onLogin(email, false);
    } else {
      // New user - save email and redirect to profile creation
      existingUsers[email.toLowerCase()] = {
        email: email,
        createdAt: Date.now()
      };
      localStorage.setItem('petpal-users', JSON.stringify(existingUsers));
      localStorage.setItem('petpal-current-user', email);
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Animated Paw Trail Background */}
      {showPawTrail && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute opacity-20 animate-paw-trail"
              style={{
                left: `${10 + (i * 8)}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s',
                animationIterationCount: 'infinite',
              }}
            >
              <div className="w-6 h-6 text-teal-500 text-2xl">🐾</div>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <header className="text-center mb-12">
          {/* Animated Pet Avatar */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-teal-500 rounded-full animate-pulse"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 bg-teal-400 rounded-full">
              {/* Eyes */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"></div>
              {/* Nose */}
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
              {/* Mouth */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-white rounded-full"></div>
            </div>
            {/* Wagging tail */}
            <div className="absolute -right-3 top-6 w-4 h-4 bg-teal-500 rounded-full animate-wag origin-left"></div>
          </div>

          <h1 className="text-4xl font-bold text-teal-500 mb-3">Welcome to PetPal</h1>
          <p className="text-gray-600 text-lg mb-2">Your caring companion for pet wellness</p>
          <p className="text-gray-500 text-sm">Sign in to access your personalized pet care dashboard</p>
        </header>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart size={24} className="text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Sign In to Continue</h2>
            <p className="text-gray-600 text-sm mt-2">Enter your email to access your pet's profile</p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 border-2 border-pink-300 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400 text-lg"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
              {email && !isValidEmail(email) && (
                <p className="mt-2 text-sm text-red-500 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>Please enter a valid email address</span>
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${
                isFormValid && !isLoading
                  ? 'bg-yellow-400 hover:bg-yellow-500 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 text-teal-500 animate-spin">🐾</div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Log In</span>
                  <div className="text-xl">🐾</div>
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💡</span>
                </div>
              </div>
              <div className="text-sm text-teal-700">
                <p className="font-medium mb-1">New to PetPal?</p>
                <p>Just enter your email and we'll help you create your pet's profile!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
          <div className="bg-pink-100 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🏥</div>
            <p className="text-sm font-medium text-gray-700">Find Vets</p>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-sm font-medium text-gray-700">AI Care Tips</p>
          </div>
          <div className="bg-teal-100 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-gray-700">Health Tracker</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔔</div>
            <p className="text-sm font-medium text-gray-700">Reminders</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-gray-500 hover:text-teal-500 transition-colors duration-200 text-sm"
          >
            <span>Built with</span>
            <span className="font-semibold">Bolt.new</span>
            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">+ Voice AI</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default LoginScreen;