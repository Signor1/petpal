import React, { useEffect, useState } from 'react';

const ConfettiAnimation: React.FC = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    // Sunlit yellow confetti pieces
    const colors = ['#FFD54F', '#FFEB3B', '#FFF176', '#FFEE58', '#FFF59D'];
    const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    setConfetti(confettiPieces);
    
    // Clean up after animation
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 opacity-80 animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${piece.color}`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;