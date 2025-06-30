import React from 'react';
import { Home, Heart, Sparkles, Activity, MapPin, Bell } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'profile', icon: Heart, label: 'Profile' },
    { id: 'care-tips', icon: Sparkles, label: 'Tips' },
    { id: 'health-tracker', icon: Activity, label: 'Health' },
    { id: 'vet-finder', icon: MapPin, label: 'Vets' },
    { id: 'reminders', icon: Bell, label: 'Reminders' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glassmorphic-card border-t shadow-lg z-40" style={{ borderColor: 'rgba(38, 166, 154, 0.3)' }}>
      <div className="w-full max-w-4xl mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-300 min-w-0 flex-1 ${
                currentScreen === id
                  ? 'scale-105'
                  : 'hover:scale-105 hover:bg-white hover:bg-opacity-20'
              }`}
              style={{
                backgroundColor: currentScreen === id ? 'rgba(38, 166, 154, 0.2)' : 'transparent',
                color: currentScreen === id ? '#26A69A' : '#546E7A'
              }}
            >
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${
                  currentScreen === id ? 'animate-bounce' : ''
                }`} 
              />
              <span className={`text-xs font-medium transition-all duration-300 ${
                currentScreen === id ? 'font-semibold' : ''
              }`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;