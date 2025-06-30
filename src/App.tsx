import React, { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Bell } from 'lucide-react';
import PetAvatar from './components/PetAvatar';
import ActionButton from './components/ActionButton';
import PawPoints from './components/PawPoints';
import ConfettiAnimation from './components/ConfettiAnimation';
import PetProfile from './components/PetProfile';
import CareTips from './components/CareTips';
import HealthTracker from './components/HealthTracker';
import VetFinder from './components/VetFinder';
import Reminders from './components/Reminders';
import BottomNavigation from './components/BottomNavigation';
import ScreenTransition from './components/ScreenTransition';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';

type ScreenType = 'login' | 'home' | 'profile' | 'care-tips' | 'health-tracker' | 'vet-finder' | 'reminders';

function App() {
  const [pawPoints, setPawPoints] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize app
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('petpal-current-user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
      setCurrentScreen('home');
      
      // Load saved paw points
      const savedPoints = localStorage.getItem('petpal-paw-points');
      if (savedPoints) {
        setPawPoints(parseInt(savedPoints, 10));
      }
    }

    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Save paw points whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('petpal-paw-points', pawPoints.toString());
    }
  }, [pawPoints, isAuthenticated]);

  const handleLogin = (email: string, isNewUser: boolean) => {
    setCurrentUser(email);
    setIsAuthenticated(true);
    localStorage.setItem('petpal-current-user', email);
    
    // Navigate to appropriate screen
    if (isNewUser) {
      handleNavigate('profile');
    } else {
      handleNavigate('home');
      // Load existing paw points
      const savedPoints = localStorage.getItem('petpal-paw-points');
      if (savedPoints) {
        setPawPoints(parseInt(savedPoints, 10));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal-current-user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setPawPoints(0);
    setCurrentScreen('login');
  };

  const handleAvatarClick = () => {
    setShowProfile(!showProfile);
    setPawPoints(prev => prev + 5); // Reward for interaction
  };

  const handleActionClick = (action: string) => {
    if (action === 'Pet Profile') {
      handleNavigate('profile');
    } else if (action === 'Care Tips') {
      handleNavigate('care-tips');
    } else if (action === 'Health Tracker') {
      handleNavigate('health-tracker');
    } else if (action === 'Vet Finder') {
      handleNavigate('vet-finder');
    } else if (action === 'Reminders') {
      handleNavigate('reminders');
    } else {
      alert(`${action} feature coming soon!`);
    }
    setPawPoints(prev => prev + 10);
  };

  const handleNavigate = (screen: ScreenType) => {
    if (screen === currentScreen) return;
    
    setIsTransitioning(true);
    
    // Small delay for smooth transition
    setTimeout(() => {
      setCurrentScreen(screen);
      setShowProfile(false); // Reset profile popup when navigating
      setIsTransitioning(false);
    }, 150);
  };

  const handlePawPointsUpdate = (points: number) => {
    setPawPoints(prev => prev + points);
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    const screenProps = {
      onBack: () => handleNavigate('home'),
      onPawPointsUpdate: handlePawPointsUpdate
    };

    switch (currentScreen) {
      case 'profile':
        return (
          <ScreenTransition isVisible={!isTransitioning}>
            <PetProfile onBack={screenProps.onBack} />
          </ScreenTransition>
        );
      case 'care-tips':
        return (
          <ScreenTransition isVisible={!isTransitioning}>
            <CareTips onBack={screenProps.onBack} />
          </ScreenTransition>
        );
      case 'health-tracker':
        return (
          <ScreenTransition isVisible={!isTransitioning}>
            <HealthTracker onBack={screenProps.onBack} />
          </ScreenTransition>
        );
      case 'vet-finder':
        return (
          <ScreenTransition isVisible={!isTransitioning}>
            <VetFinder onBack={screenProps.onBack} />
          </ScreenTransition>
        );
      case 'reminders':
        return (
          <ScreenTransition isVisible={!isTransitioning}>
            <Reminders onBack={screenProps.onBack} onPawPointsUpdate={screenProps.onPawPointsUpdate} />
          </ScreenTransition>
        );
      default:
        return (
          <ScreenTransition isVisible={!isTransitioning}>
            <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <ConfettiAnimation />
              
              {/* Main Content Container */}
              <div className="w-full max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <header className="text-center mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-teal-500 mb-2">PetPal</h1>
                      <p className="text-gray-600 text-sm">Your caring companion for pet wellness</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-full transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                  {currentUser && (
                    <p className="text-gray-500 text-sm">Welcome back, {currentUser}!</p>
                  )}
                </header>

                {/* Pet Avatar Section */}
                <div className="text-center mb-8">
                  <PetAvatar onClick={handleAvatarClick} />
                  {showProfile && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md animate-fade-in">
                      <h3 className="font-semibold text-gray-800 mb-2">Meet Buddy!</h3>
                      <p className="text-gray-600 text-sm mb-3">Your virtual pet companion is always here to help you care for your furry friends.</p>
                      <button
                        onClick={() => handleActionClick('Pet Profile')}
                        className="text-teal-500 hover:text-teal-600 font-medium text-sm underline transition-colors duration-200"
                      >
                        Create Pet Profile →
                      </button>
                    </div>
                  )}
                </div>

                {/* Paw Points */}
                <div className="text-center mb-8">
                  <PawPoints points={pawPoints} />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                  <ActionButton
                    icon={Heart}
                    title="Care Tips"
                    onClick={() => handleActionClick('Care Tips')}
                  />
                  <ActionButton
                    icon={Activity}
                    title="Health Tracker"
                    onClick={() => handleActionClick('Health Tracker')}
                  />
                  <ActionButton
                    icon={MapPin}
                    title="Vet Finder"
                    onClick={() => handleActionClick('Vet Finder')}
                  />
                  <ActionButton
                    icon={Bell}
                    title="Reminders"
                    onClick={() => handleActionClick('Reminders')}
                  />
                </div>

                {/* Footer */}
                <footer className="text-center pt-8 border-t border-gray-200">
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
          </ScreenTransition>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {renderScreen()}
      {isAuthenticated && currentScreen !== 'login' && (
        <BottomNavigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;