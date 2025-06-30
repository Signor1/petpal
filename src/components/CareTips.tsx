import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Heart, Sparkles, Play, Pause, Volume2 } from 'lucide-react';

interface CareTipsProps {
  onBack: () => void;
}

interface PetData {
  name: string;
  breed: string;
  age: string;
  healthConditions: string;
}

const CareTips: React.FC<CareTipsProps> = ({ onBack }) => {
  const [currentTip, setCurrentTip] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWagTail, setShowWagTail] = useState(false);
  const [petData, setPetData] = useState<PetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Mock AI-generated tips database
  const tipCategories = {
    diet: [
      "Feed your {breed} 2-3 cups of high-quality kibble daily, divided into two meals",
      "Fresh water should always be available - change it daily for optimal health",
      "Avoid feeding your {breed} chocolate, grapes, onions, and garlic as they're toxic",
      "Consider adding omega-3 supplements to support your pet's coat and joint health",
      "Measure food portions to prevent overfeeding - obesity is common in {breed}s",
      "Treats should make up no more than 10% of your pet's daily caloric intake"
    ],
    exercise: [
      "{breed}s need at least 30-60 minutes of exercise daily to stay healthy and happy",
      "Mental stimulation is just as important as physical exercise for your {breed}",
      "Take your {breed} on different walking routes to keep them mentally engaged",
      "Interactive toys and puzzle feeders can help burn mental energy indoors",
      "Swimming is excellent low-impact exercise, especially for older {breed}s",
      "Play fetch or tug-of-war to strengthen your bond while exercising together"
    ],
    grooming: [
      "Brush your {breed} 2-3 times per week to reduce shedding and prevent matting",
      "Trim your pet's nails every 2-3 weeks to prevent overgrowth and discomfort",
      "Clean your {breed}'s ears weekly with a vet-approved ear cleaner",
      "Brush your pet's teeth daily or use dental chews to maintain oral health",
      "Bathe your {breed} monthly or when they get dirty - over-bathing can dry their skin",
      "Check and clean your pet's paws regularly, especially after outdoor walks"
    ],
    health: [
      "Schedule annual vet checkups for your {breed} to catch health issues early",
      "Keep your pet's vaccinations up to date according to your vet's schedule",
      "Watch for changes in appetite, behavior, or bathroom habits in your {breed}",
      "Maintain a healthy weight - you should be able to feel your pet's ribs easily",
      "Provide a comfortable, warm sleeping area for your {breed} to rest",
      "Consider pet insurance to help manage unexpected veterinary costs"
    ],
    general: [
      "Create a consistent daily routine - {breed}s thrive on predictability",
      "Socialize your {breed} regularly with other pets and people when safe",
      "Provide plenty of safe toys to prevent destructive chewing behaviors",
      "Keep your home pet-proofed by securing toxic plants and small objects",
      "Show love and affection daily - your {breed} needs emotional connection too",
      "Train using positive reinforcement - {breed}s respond well to praise and treats"
    ]
  };

  // Check for speech synthesis support
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Load pet data on component mount
  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem('petpal-current-user');
    if (userEmail) {
      setCurrentUser(userEmail);
      
      // Load pet data for this user
      const userProfileKey = `petpal-profile-${userEmail.toLowerCase()}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          if (profileData.pet) {
            setPetData({
              name: profileData.pet.name || '',
              breed: profileData.pet.breed || '',
              age: profileData.pet.age ? profileData.pet.age.toString() : '',
              healthConditions: profileData.pet.health || ''
            });
          }
        } catch (error) {
          console.error('Error loading pet profile:', error);
        }
      }
    }
    
    generateNewTip();
  }, []);

  // Cleanup speech on component unmount
  useEffect(() => {
    return () => {
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentUtterance]);

  const generateNewTip = () => {
    setIsRefreshing(true);
    setShowWagTail(true);

    // Stop any current speech
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }

    // Get random category and tip
    const categories = Object.keys(tipCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryTips = tipCategories[randomCategory as keyof typeof tipCategories];
    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];

    // Personalize tip with pet data
    let personalizedTip = randomTip;
    if (petData?.breed) {
      personalizedTip = randomTip.replace(/{breed}/g, petData.breed);
    } else {
      personalizedTip = randomTip.replace(/{breed}/g, 'pet');
    }

    // Add pet name if available
    if (petData?.name && Math.random() > 0.5) {
      personalizedTip = personalizedTip.replace(/your pet/g, petData.name);
      personalizedTip = personalizedTip.replace(/Your pet/g, petData.name);
    }

    // Simulate AI processing time
    setTimeout(() => {
      setCurrentTip(personalizedTip);
      setIsRefreshing(false);
    }, 1500);

    // Hide wag tail after animation
    setTimeout(() => {
      setShowWagTail(false);
    }, 3000);
  };

  const handlePlayTip = () => {
    if (!speechSupported) {
      alert('🔊 Voice playback is not supported in your browser. Please try Chrome, Safari, or Edge for the best experience!');
      return;
    }

    if (!currentTip) {
      alert('📝 Please generate a tip first!');
      return;
    }

    // If currently playing, stop
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
      return;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(currentTip);
    
    // Configure voice settings for friendly, natural speech
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.1; // Slightly higher pitch for friendliness
    utterance.volume = 0.8; // Comfortable volume
    
    // Try to use a female voice if available (often more friendly sounding)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('susan')
    ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
      alert('🔊 Voice playback encountered an error. Please try again!');
    };

    // Start speaking
    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Animated Paw Trail Background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-paw-trail-loop"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: '12s',
              animationIterationCount: 'infinite',
            }}
          >
            <div className="w-6 h-6 text-2xl" style={{ color: '#26A69A' }}>🐾</div>
          </div>
        ))}
      </div>

      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-3 rounded-full transition-all duration-300 hover:scale-110 animate-pulse-on-hover focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ 
              backgroundColor: '#26A69A',
              color: 'white',
              boxShadow: '0 4px 16px 0 rgba(38, 166, 154, 0.3)'
            }}
            aria-label="Go back to home screen"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="animate-bounce-gentle">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#26A69A' }}>
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 
                className="text-4xl font-bold"
                style={{ 
                  fontFamily: 'Bubblegum Sans, cursive',
                  fontSize: '24px',
                  color: '#26A69A',
                  animation: 'zoom 2s ease-in-out infinite alternate'
                }}
              >
                Daily Care Tips
              </h1>
              {currentUser && petData?.name && (
                <p className="text-sm mt-1" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
                  Personalized for {petData.name}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Glassmorphic AI Tip Card */}
        <div className="glassmorphic-card p-6 mb-6 max-w-2xl mx-auto relative overflow-hidden border-coral-glow">
          {/* Wagging tail animation */}
          {showWagTail && (
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full animate-wag" style={{ backgroundColor: '#FF6F61' }}></div>
            </div>
          )}

          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              <div className="glassmorphic-icon w-12 h-12">
                <Heart size={24} style={{ color: '#FF6F61' }} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                <span>💡 AI-Powered Care Tip</span>
              </h2>
              {isRefreshing ? (
                <div className="flex items-center space-x-3">
                  <RefreshCw size={20} className="animate-spin" style={{ color: '#546E7A' }} />
                  <span className="italic" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
                    Generating personalized tip...
                  </span>
                </div>
              ) : (
                <p className="leading-relaxed" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>
                  {currentTip || "Click 'Refresh Tip' to get your first personalized care advice!"}
                </p>
              )}
            </div>
          </div>

          {/* Voice Controls */}
          {currentTip && !isRefreshing && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePlayTip}
                disabled={!speechSupported}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  speechSupported
                    ? isPlaying
                      ? 'hover:scale-105 shadow-lg'
                      : 'hover:scale-105 shadow-lg'
                    : 'opacity-50 cursor-not-allowed'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                style={{
                  backgroundColor: isPlaying ? '#D32F2F' : '#FFD54F',
                  color: '#37474F',
                  fontFamily: 'Inter, sans-serif'
                }}
                title={speechSupported ? (isPlaying ? 'Stop playback' : 'Play tip aloud') : 'Voice not supported in this browser'}
              >
                {isPlaying ? (
                  <>
                    <Pause size={18} />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Play Tip</span>
                  </>
                )}
              </button>

              {speechSupported && (
                <div className="flex items-center space-x-2" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
                  <Volume2 size={16} />
                  <span className="text-sm">Voice AI Ready</span>
                </div>
              )}
            </div>
          )}

          {/* Personalization indicator */}
          {petData?.name && (
            <div className="mt-4 glassmorphic-helper p-3 rounded-lg">
              <p className="text-sm flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                <Sparkles size={16} style={{ color: '#FF6F61' }} />
                <span>Personalized for {petData.name} ({petData.breed})</span>
              </p>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-8 max-w-2xl mx-auto">
          <button
            onClick={generateNewTip}
            disabled={isRefreshing}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
              isRefreshing 
                ? 'opacity-75 cursor-not-allowed' 
                : 'hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-opacity-50'
            }`}
            style={{
              backgroundColor: '#FFD54F',
              color: '#37474F',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px 0 rgba(255, 213, 79, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Generating...' : 'Refresh Tip'}</span>
          </button>
        </div>

        {/* Voice Feature Info */}
        <div className="glassmorphic-card p-6 mb-6 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
            <Volume2 size={20} style={{ color: '#26A69A' }} />
            <span>Voice-Guided Tips</span>
          </h3>
          <div className="space-y-3 text-sm" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Click "Play Tip" to hear your personalized care advice read aloud</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Perfect for hands-free learning while caring for your pet</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Voice playback uses natural, friendly speech patterns</p>
            </div>
            {!speechSupported && (
              <div className="glassmorphic-error p-3 rounded-lg">
                <p className="font-medium text-sm" style={{ color: '#D32F2F', fontFamily: 'Inter, sans-serif' }}>
                  🔊 For voice features, please use Chrome, Safari, or Edge browser
                </p>
              </div>
            )}
          </div>
        </div>

        {/* About AI Care Tips */}
        <div className="glassmorphic-card p-6 mb-6 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
            <Sparkles size={20} style={{ color: '#26A69A' }} />
            <span>About AI Care Tips</span>
          </h3>
          <div className="space-y-3 text-sm" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
            <p>
              Our AI generates personalized care advice based on your pet's breed, age, and health conditions.
            </p>
            <p>
              Tips cover essential areas including diet, exercise, grooming, and general health maintenance.
            </p>
            {!petData?.name && (
              <div className="glassmorphic-helper p-3 rounded-lg">
                <p className="font-medium" style={{ color: '#26A69A', fontFamily: 'Inter, sans-serif' }}>
                  💡 Create a pet profile to get more personalized recommendations!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Context Info */}
        {currentUser && (
          <div className="glassmorphic-helper p-4 rounded-lg max-w-2xl mx-auto mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#26A69A' }}>
                <span className="text-white text-sm">👤</span>
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: '#26A69A', fontFamily: 'Inter, sans-serif' }}>
                  Care tips for {currentUser}
                </p>
                <p className="text-xs" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
                  Tips are personalized based on your pet's profile
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="glassmorphic-card p-4 max-w-2xl mx-auto">
          <p className="text-xs text-center" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
            ⚠️ These tips are for general guidance only. Always consult your veterinarian for specific health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareTips;