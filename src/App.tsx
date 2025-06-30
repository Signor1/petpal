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
            <div className="min-h-screen pb-20" style={{ backgroundColor: '#F5F5F5', fontFamily: 'Poppins, sans-serif' }}>
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
                      className="glassmorphic-button px-4 py-2 rounded-full transition-all duration-200 flex items-center space-x-2 text-sm font-medium hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
                      style={{ color: 'white' }}
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
                      <div className="glassmorphic-card p-3 max-w-md mx-auto" style={{ backgroundColor: 'rgba(255, 111, 97, 0.2)' }}>
                        <p className="font-medium text-sm flex items-center justify-center space-x-2" style={{ color: '#37474F' }}>
                          <Heart size={16} style={{ color: '#FF6F61' }} />
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
                    <div className="mt-4 glassmorphic-card p-4 animate-fade-in max-w-md mx-auto">
                      <h3 className="font-semibold mb-2" style={{ color: '#37474F' }}>
                        {petData?.name ? `Meet ${petData.name}!` : 'Meet Buddy!'}
                      </h3>
                      <p className="text-sm mb-3" style={{ color: '#546E7A' }}>
                        {petData?.name 
                          ? `${petData.name} is a ${petData.age} year old ${petData.breed} who loves your care and attention!`
                          : 'Your virtual pet companion is always here to help you care for your furry friends.'
                        }
                      </p>
                      <button
                        onClick={() => handleActionClick('Pet Profile')}
                        className="text-sm underline transition-colors duration-200"
                        style={{ color: '#26A69A' }}
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
                    <p className="text-xs mt-2" style={{ color: '#546E7A' }}>
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
                  <div className="glassmorphic-card p-6 mb-8 max-w-2xl mx-auto">
                    <h3 className="font-semibold mb-4 text-center" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                      {petData.name}'s Quick Info
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 213, 79, 0.3)' }}>
                        <div className="text-2xl mb-1">🎂</div>
                        <p className="text-sm font-medium" style={{ color: '#37474F' }}>{petData.age} years old</p>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(38, 166, 154, 0.3)' }}>
                        <div className="text-2xl mb-1">🐕</div>
                        <p className="text-sm font-medium" style={{ color: '#37474F' }}>{petData.breed}</p>
                      </div>
                    </div>
                    {petData.health && petData.health !== 'None' && (
                      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 111, 97, 0.2)' }}>
                        <p className="text-sm" style={{ color: '#37474F' }}>
                          <strong>Health Notes:</strong> {petData.health}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* No Profile Warning */}
                {!petData && (
                  <div className="glassmorphic-card p-6 mb-8 max-w-2xl mx-auto" style={{ backgroundColor: 'rgba(255, 213, 79, 0.2)' }}>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(255, 213, 79, 0.5)' }}>
                        <Heart size={24} style={{ color: '#FFD54F' }} />
                      </div>
                      <h3 className="font-semibold mb-2" style={{ color: '#37474F' }}>Create Your Pet's Profile</h3>
                      <p className="text-sm mb-4" style={{ color: '#546E7A' }}>
                        Get personalized care tips and recommendations by creating a profile for your furry friend!
                      </p>
                      <button
                        onClick={() => handleActionClick('Pet Profile')}
                        className="glassmorphic-button px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ color: 'white' }}
                      >
                        Create Profile Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Glassmorphic Footer */}
                <footer className="text-center pt-8 border-t border-gray-200">
                  <a
                    href="https://bolt.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glassmorphic-badge inline-flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <span style={{ color: '#546E7A' }}>Built with</span>
                    <span className="font-semibold" style={{ color: '#26A69A' }}>Bolt.new</span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#26A69A', color: 'white' }}>+ Voice AI</span>
                  </a>
                </footer>
              </div>
            </div>
          </ScreenTransition>
        );
    }
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {renderScreen()}
      {isAuthenticated && currentScreen !== 'login' && (
        <BottomNavigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;