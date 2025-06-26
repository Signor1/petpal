import React from 'react';
import { Zap } from 'lucide-react';

interface PawPointsProps {
  points: number;
}

const PawPoints: React.FC<PawPointsProps> = ({ points }) => {
  return (
    <div className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-full shadow-md inline-flex items-center space-x-2 font-semibold">
      <Zap size={20} className="text-gray-700" />
      <span>{points} Paw Points</span>
    </div>
  );
};

export default PawPoints;