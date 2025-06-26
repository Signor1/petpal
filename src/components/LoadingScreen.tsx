import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="text-center">
        {/* Spinning Paw Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 animate-spin">
              <div className="w-16 h-16 text-teal-500 flex items-center justify-center text-4xl">
                🐾
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-teal-500 mb-2">PetPal</h2>
        <p className="text-gray-600 text-sm animate-pulse">Loading your pet care assistant...</p>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;