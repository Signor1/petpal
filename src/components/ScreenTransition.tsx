import React from 'react';

interface ScreenTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
}

const ScreenTransition: React.FC<ScreenTransitionProps> = ({ children, isVisible }) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-4 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
};

export default ScreenTransition;