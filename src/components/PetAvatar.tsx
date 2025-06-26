import React from 'react';

interface PetAvatarProps {
  onClick: () => void;
}

const PetAvatar: React.FC<PetAvatarProps> = ({ onClick }) => {
  return (
    <div 
      className="relative cursor-pointer transform transition-transform duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div className="w-32 h-32 mx-auto mb-4 relative">
        {/* Dog body */}
        <div className="absolute inset-0 bg-amber-600 rounded-full"></div>
        
        {/* Dog face */}
        <div className="absolute top-2 left-2 right-2 bottom-2 bg-amber-500 rounded-full">
          {/* Eyes */}
          <div className="absolute top-6 left-6 w-3 h-3 bg-black rounded-full"></div>
          <div className="absolute top-6 right-6 w-3 h-3 bg-black rounded-full"></div>
          
          {/* Nose */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full"></div>
          
          {/* Mouth */}
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-full"></div>
        </div>
        
        {/* Wagging tail */}
        <div className="absolute -right-4 top-8 w-6 h-6 bg-amber-600 rounded-full animate-wag origin-left"></div>
        
        {/* Ears */}
        <div className="absolute -top-2 left-4 w-8 h-12 bg-amber-700 rounded-full transform -rotate-12"></div>
        <div className="absolute -top-2 right-4 w-8 h-12 bg-amber-700 rounded-full transform rotate-12"></div>
      </div>
    </div>
  );
};

export default PetAvatar;