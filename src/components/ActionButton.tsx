import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-pink-300 hover:bg-pink-400 text-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
    >
      <Icon size={32} className="mx-auto mb-3 text-gray-700" />
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
};

export default ActionButton;