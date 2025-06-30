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
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Bouncing Paw Animation */}
      {showBounce && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🐾
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
            aria-label="Go back to home screen"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="animate-bounce">
              <MapPin size={32} className="text-teal-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teal-500">Find a Vet</h1>
              {currentUser && petData?.name && (
                <p className="text-sm text-gray-600">Finding care for {petData.name}</p>
              )}
            </div>
          </div>
        </header>

        {/* AI Tip Card */}
        <div className="bg-teal-500 text-white rounded-xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Sparkles size={24} className="text-teal-200" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <span>💡 AI Recommendation</span>
              </h2>
              <p className="leading-relaxed">
                {aiTip || "Loading personalized recommendation..."}
              </p>
              {petData?.name && (
                <p className="mt-3 text-teal-100 text-sm">
                  🎯 Personalized for {petData.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Vet Clinics List */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Stethoscope size={20} className="text-teal-500" />
            <span>Recommended Veterinarians</span>
          </h2>

          {vetClinics.map((vet) => (
            <div key={vet.id} className="bg-pink-300 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] max-w-2xl mx-auto">
              {/* Vet Name and Rating */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 flex items-center space-x-2">
                    <span>{vet.name}</span>
                    {vet.emergency && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        24/7
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(vet.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {vet.rating} ({Math.floor(Math.random() * 200 + 50)} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Address and Distance */}
              <div className="flex items-start space-x-2 mb-3">
                <MapPin size={16} className="text-gray-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{vet.address}</p>
                  <p className="text-gray-600 text-xs mt-1">{vet.distance} away</p>
                </div>
              </div>

              {/* Phone and Hours */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-600" />
                  <span className="text-gray-700 text-sm font-medium">{vet.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{vet.hours}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">SPECIALTIES:</p>
                <div className="flex flex-wrap gap-2">
                  {vet.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-pink-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <button
                onClick={() => handleContactVet(vet.name, vet.phone)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 flex items-center justify-center space-x-2"
              >
                <Phone size={18} />
                <span>Contact Clinic</span>
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Emergency Situations</h3>
              <p className="text-red-700 text-sm">
                For life-threatening emergencies, call the nearest 24/7 animal hospital immediately. 
                Don't wait for an appointment if your pet is in severe distress.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Sparkles size={20} className="text-teal-500" />
            <span>Choosing the Right Vet</span>
          </h3>
          <div className="space-y-3 text-gray-600 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Schedule a consultation visit before you need emergency care</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Ask about their emergency protocols and after-hours availability</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Verify they accept your pet insurance or discuss payment options</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Look for clean facilities and friendly, knowledgeable staff</p>
            </div>
          </div>
        </div>

        {/* User Context Info */}
        {currentUser && (
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <div>
                <p className="text-teal-800 font-medium text-sm">
                  Vet recommendations for {currentUser}
                </p>
                <p className="text-teal-700 text-xs">
                  Personalized based on your location and pet's needs
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
          <p className="text-xs text-gray-500 text-center">
            📍 Clinic information is for demonstration purposes. Always verify current details before visiting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VetFinder;