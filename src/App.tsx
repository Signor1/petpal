import React, { useState, useEffect } from 'react';
import { Heart, Activity, MapPin, Bell, LogOut } from 'lucide-react';
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

interface PetData {
  name: string;
  breed: string;
  age: number;
  health: string;
}

interface UserPetProfile {
  email: string;
  pet: PetData;
}

interface UserRemindersData {
  email: string;
  reminders: any[];
  points: number;
}

function App() {
  const [pawPoints, setPawPoints] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [petData, setPetData] = useState<PetData | null>(null);

  // Initialize app
  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('petpal-current-user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
      loadUserData(savedUser);
      setCurrentScreen('home');
    }

    // Simulate loading time
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Load user-specific data
  const loadUserData = (email: string) => {
    // Load pet profile
    const userProfileKey = `petpal-profile-${email.toLowerCase()}`;
    const savedProfile = localStorage.getItem(userProfileKey);
    
    if (savedProfile) {
      try {
        const profileData: UserPetProfile = JSON.parse(savedProfile);
        if (profileData.pet) {
          setPetData(profileData.pet);
        }
      } catch (error) {
        console.error('Error loading pet profile:', error);
      }
    }

    // Load user's Paw Points from reminders
    const userRemindersKey = `petpal-reminders-${email.toLowerCase()}`;
    const savedReminders = localStorage.getItem(userRemindersKey);
    
    if (savedReminders) {
      try {
        const remindersData: UserRemindersData = JSON.parse(savedReminders);
        if (typeof remindersData.points === 'number') {
          setPawPoints(remindersData.points);
        }
      } catch (error) {
        console.error('Error loading paw points:', error);
      }
    }
  };

  // Save paw points whenever they change
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Update the user's points in their reminders data
      const userRemindersKey = `petpal-reminders-${currentUser.toLowerCase()}`;
      const savedReminders = localStorage.getItem(userRemindersKey);
      
      if (savedReminders) {
        try {
          const remindersData: UserRemindersData = JSON.parse(savedReminders);
          remindersData.points = pawPoints;
          localStorage.setItem(userRemindersKey, JSON.stringify(remindersData));
        } catch (error) {
          console.error('Error saving paw points:', error);
        }
      }
    }
  }, [pawPoints, isAuthenticated, currentUser]);

  const handleLogin = (email: string, isNewUser: boolean) => {
    setCurrentUser(email);
    setIsAuthenticated(true);
    localStorage.setItem('petpal-current-user', email);
    
    // Navigate to appropriate screen
    if (isNewUser) {
      handleNavigate('profile');
    } else {
      loadUserData(email);
      handleNavigate('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal-current-user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setPawPoints(0);
    setPetData(null);
    setShowProfile(false);
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
    
    // Check if user has a pet profile when navigating to home
    if (screen === 'home' && isAuthenticated && currentUser) {
      const userProfileKey = `petpal-profile-${currentUser.toLowerCase()}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      
      if (!savedProfile) {
        // No profile exists, redirect to profile creation
        setCurrentScreen('profile');
        setIsTransitioning(false);
        return;
      }
    }
    
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
                      className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 text-sm font-medium hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
                      title="Log out of PetPal"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                  
                  {/* User Welcome Message */}
                  <div className="mb-4">
                    {currentUser && (
                      <p className="text-gray-500 text-sm mb-2">Welcome back, {currentUser}!</p>
                    )}
                    {petData?.name && (
                      <div className="bg-pink-100 border border-pink-200 rounded-lg p-3 max-w-md mx-auto">
                        <p className="text-pink-800 font-medium text-sm flex items-center justify-center space-x-2">
                          <Heart size={16} className="text-pink-500" />
                          <span>Caring for {petData.name} ({petData.breed})</span>
                        </p>
                      </div>
                    )}
                  </div>
                </header>

                {/* Pet Avatar Section */}
                <div className="text-center mb-8">
                  <PetAvatar onClick={handleAvatarClick} />
                  {showProfile && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-md animate-fade-in max-w-md mx-auto">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {petData?.name ? `Meet ${petData.name}!` : 'Meet Buddy!'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {petData?.name 
                          ? `${petData.name} is a ${petData.age} year old ${petData.breed} who loves your care and attention!`
                          : 'Your virtual pet companion is always here to help you care for your furry friends.'
                        }
                      </p>
                      <button
                        onClick={() => handleActionClick('Pet Profile')}
                        className="text-teal-500 hover:text-teal-600 font-medium text-sm underline transition-colors duration-200"
                      >
                        {petData?.name ? `Update ${petData.name}'s Profile` : 'Create Pet Profile'} →
                      </button>
                    </div>
                  )}
                </div>

                {/* Paw Points */}
                <div className="text-center mb-8">
                  <PawPoints points={pawPoints} />
                  {pawPoints > 0 && (
                    <p className="text-gray-500 text-xs mt-2">
                      🏆 You've earned {pawPoints} points by caring for {petData?.name || 'your pet'}!
                    </p>
                  )}
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

                {/* Quick Stats */}
                {petData && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-2xl mx-auto">
                    <h3 className="font-semibold text-gray-800 mb-4 text-center">
                      {petData.name}'s Quick Info
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl mb-1">🎂</div>
                        <p className="text-sm font-medium text-gray-700">{petData.age} years old</p>
                      </div>
                      <div className="text-center p-3 bg-teal-50 rounded-lg">
                        <div className="text-2xl mb-1">🐕</div>
                        <p className="text-sm font-medium text-gray-700">{petData.breed}</p>
                      </div>
                    </div>
                    {petData.health && petData.health !== 'None' && (
                      <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                        <p className="text-pink-800 text-sm">
                          <strong>Health Notes:</strong> {petData.health}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* No Profile Warning */}
                {!petData && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart size={24} className="text-yellow-600" />
                      </div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Create Your Pet's Profile</h3>
                      <p className="text-yellow-700 text-sm mb-4">
                        Get personalized care tips and recommendations by creating a profile for your furry friend!
                      </p>
                      <button
                        onClick={() => handleActionClick('Pet Profile')}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                      >
                        Create Profile Now
                      </button>
                    </div>
                  </div>
                )}

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