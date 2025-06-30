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
      className="glassmorphic-card p-6 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 border-coral-glow"
      style={{ 
        backgroundColor: 'rgba(255, 111, 97, 0.3)',
        color: '#37474F'
      }}
    >
      <Icon size={32} className="mx-auto mb-3" style={{ color: '#37474F' }} />
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
};

export default ActionButton;