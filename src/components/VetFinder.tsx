import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Star, Stethoscope, Sparkles } from 'lucide-react';

interface VetFinderProps {
  onBack: () => void;
}

interface PetData {
  name: string;
  breed: string;
  age: string;
  healthConditions: string;
}

interface VetClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: string;
  hours: string;
  specialties: string[];
  emergency: boolean;
}

const VetFinder: React.FC<VetFinderProps> = ({ onBack }) => {
  const [showBounce, setShowBounce] = useState(false);
  const [aiTip, setAiTip] = useState('');
  const [petData, setPetData] = useState<PetData | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Mock vet clinic data
  const vetClinics: VetClinic[] = [
    {
      id: '1',
      name: 'Paws & Claws Veterinary Clinic',
      address: '123 Main Street, Downtown',
      phone: '(555) 123-4567',
      rating: 4.8,
      distance: '0.8 miles',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      specialties: ['General Care', 'Surgery', 'Dental'],
      emergency: false
    },
    {
      id: '2',
      name: 'Happy Tails Animal Hospital',
      address: '456 Oak Avenue, Midtown',
      phone: '(555) 987-6543',
      rating: 4.9,
      distance: '1.2 miles',
      hours: 'Mon-Sun: 7AM-8PM',
      specialties: ['Emergency Care', 'Cardiology', 'Oncology'],
      emergency: true
    },
    {
      id: '3',
      name: 'Furry Friends Veterinary Center',
      address: '789 Pine Road, Westside',
      phone: '(555) 456-7890',
      rating: 4.7,
      distance: '2.1 miles',
      hours: 'Mon-Fri: 9AM-7PM, Weekends: 10AM-5PM',
      specialties: ['Exotic Pets', 'Dermatology', 'Behavioral'],
      emergency: false
    }
  ];

  // AI tip database
  const aiTips = [
    "Choose a vet within 5 miles for easy emergency access and regular checkups.",
    "Look for clinics with emergency services if your pet has ongoing health conditions.",
    "Consider vets who specialize in your pet's breed for the best care possible.",
    "Read reviews and ask for recommendations from other pet owners in your area.",
    "Schedule a meet-and-greet visit before your pet needs medical attention.",
    "Ensure your chosen vet offers both routine care and emergency services.",
    "Look for clinics with modern equipment and clean, welcoming facilities.",
    "Consider the clinic's hours - some offer extended or weekend availability.",
    "Ask about payment plans or pet insurance acceptance for expensive treatments.",
    "Choose a vet who communicates clearly and makes you feel comfortable asking questions."
  ];

  // Load pet data and generate AI tip on component mount
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

    // Show bouncing animation
    setShowBounce(true);
    setTimeout(() => setShowBounce(false), 2000);

    // Generate personalized AI tip
    generateAITip();
  }, []);

  const generateAITip = () => {
    let tip = aiTips[Math.floor(Math.random() * aiTips.length)];
    
    // Personalize tip based on pet data
    if (petData?.breed && Math.random() > 0.5) {
      tip = tip.replace(/your pet/g, `your ${petData.breed}`);
      tip = tip.replace(/Your pet/g, `Your ${petData.breed}`);
    }
    
    if (petData?.name && Math.random() > 0.7) {
      tip = tip.replace(/your pet/g, petData.name);
      tip = tip.replace(/Your pet/g, petData.name);
    }

    setAiTip(tip);
  };

  const handleContactVet = (vetName: string, phone: string) => {
    // Show mock contact alert
    alert(`📞 Contacting ${vetName} at ${phone}!\n\nIn a real app, this would:\n• Open your phone's dialer\n• Save contact to your phone\n• Show directions to the clinic`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Bouncing Paw Animation */}
      {showBounce && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🐾
          </div>
        </div>
      )}

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
                <MapPin size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 
                className="text-4xl font-bold"
                style={{ 
                  fontFamily: 'Bubblegum Sans, cursive',
                  fontSize: '24px',
                  color: '#26A69A'
                }}
              >
                Find a Vet
              </h1>
              {currentUser && petData?.name && (
                <p className="text-sm mt-1" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
                  Finding care for {petData.name}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* AI Tip Card */}
        <div className="glassmorphic-card p-6 mb-6 max-w-2xl mx-auto" style={{ backgroundColor: 'rgba(38, 166, 154, 0.2)' }}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <Sparkles size={24} style={{ color: '#26A69A' }} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-3 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                <span>💡 AI Recommendation</span>
              </h2>
              <p className="leading-relaxed mb-4" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>
                {aiTip || "Loading personalized recommendation..."}
              </p>
              {petData?.name && (
                <div className="glassmorphic-helper p-3 rounded-lg">
                  <p className="text-sm" style={{ color: '#26A69A', fontFamily: 'Inter, sans-serif' }}>
                    🎯 Personalized for {petData.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vet Clinics List */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
            <Stethoscope size={20} style={{ color: '#26A69A' }} />
            <span>Recommended Veterinarians</span>
          </h2>

          {vetClinics.map((vet) => (
            <div key={vet.id} className="glassmorphic-card p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] max-w-2xl mx-auto border-coral-glow">
              {/* Vet Name and Rating */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                    <span>{vet.name}</span>
                    {vet.emergency && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#D32F2F', color: 'white' }}>
                        24/7
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(vet.rating)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                      {vet.rating} ({Math.floor(Math.random() * 200 + 50)} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Address and Distance */}
              <div className="flex items-start space-x-3 mb-4">
                <MapPin size={16} style={{ color: '#546E7A' }} className="mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>{vet.address}</p>
                  <p className="text-xs mt-1" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>{vet.distance} away</p>
                </div>
              </div>

              {/* Phone and Hours */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-3">
                  <Phone size={16} style={{ color: '#546E7A' }} />
                  <span className="text-sm font-medium" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>{vet.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock size={16} style={{ color: '#546E7A' }} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>{vet.hours}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <p className="text-xs font-semibold mb-3" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>SPECIALTIES:</p>
                <div className="flex flex-wrap gap-2">
                  {vet.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: 'rgba(255, 111, 97, 0.2)', color: '#37474F' }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <button
                onClick={() => handleContactVet(vet.name, vet.phone)}
                className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: '#FFD54F',
                  color: '#37474F',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 8px 32px 0 rgba(255, 213, 79, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
                }}
              >
                <Phone size={18} />
                <span>Contact Clinic</span>
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Notice */}
        <div className="glassmorphic-card p-4 mb-6 max-w-2xl mx-auto" style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D32F2F' }}>
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1" style={{ color: '#D32F2F', fontFamily: 'Inter, sans-serif' }}>Emergency Situations</h3>
              <p className="text-sm" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
                For life-threatening emergencies, call the nearest 24/7 animal hospital immediately. 
                Don't wait for an appointment if your pet is in severe distress.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="glassmorphic-card p-6 mb-6 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: '#37474F', fontFamily: 'Inter, sans-serif' }}>
            <Sparkles size={20} style={{ color: '#26A69A' }} />
            <span>Choosing the Right Vet</span>
          </h3>
          <div className="space-y-3 text-sm" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Schedule a consultation visit before you need emergency care</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Ask about their emergency protocols and after-hours availability</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Verify they accept your pet insurance or discuss payment options</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#26A69A' }}></div>
              <p>Look for clean facilities and friendly, knowledgeable staff</p>
            </div>
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
                  Vet recommendations for {currentUser}
                </p>
                <p className="text-xs" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
                  Personalized based on your location and pet's needs
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="glassmorphic-card p-4 max-w-2xl mx-auto">
          <p className="text-xs text-center" style={{ color: '#546E7A', fontFamily: 'Inter, sans-serif' }}>
            📍 Clinic information is for demonstration purposes. Always verify current details before visiting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VetFinder;