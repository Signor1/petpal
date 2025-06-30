import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import ConfettiAnimation from './ConfettiAnimation';

interface PetProfileProps {
  onBack: () => void;
}

interface PetData {
  name: string;
  breed: string;
  age: string;
  healthConditions: string;
}

interface UserPetProfile {
  email: string;
  pet: {
    name: string;
    breed: string;
    age: number;
    health: string;
  };
}

const PetProfile: React.FC<PetProfileProps> = ({ onBack }) => {
  const [petData, setPetData] = useState<PetData>({
    name: '',
    breed: 'Labrador',
    age: '',
    healthConditions: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem('petpal-current-user');
    if (userEmail) {
      setCurrentUser(userEmail);
      
      // Load existing pet profile for this user
      const userProfileKey = `petpal-profile-${userEmail.toLowerCase()}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      
      if (savedProfile) {
        try {
          const profileData: UserPetProfile = JSON.parse(savedProfile);
          if (profileData.pet) {
            setPetData({
              name: profileData.pet.name || '',
              breed: profileData.pet.breed || 'Labrador',
              age: profileData.pet.age ? profileData.pet.age.toString() : '',
              healthConditions: profileData.pet.health || ''
            });
          }
        } catch (error) {
          console.error('Error loading pet profile:', error);
        }
      }
    }
  }, []);

  const handleInputChange = (field: keyof PetData, value: string) => {
    setPetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!currentUser) {
      alert('Error: No user logged in. Please log in again.');
      return;
    }

    // Create the profile data structure
    const profileData: UserPetProfile = {
      email: currentUser,
      pet: {
        name: petData.name.trim(),
        breed: petData.breed,
        age: parseInt(petData.age) || 0,
        health: petData.healthConditions.trim() || 'None'
      }
    };

    // Save to localStorage with email-based key
    const userProfileKey = `petpal-profile-${currentUser.toLowerCase()}`;
    localStorage.setItem(userProfileKey, JSON.stringify(profileData));
    
    // Also save to the general profile key for backward compatibility
    localStorage.setItem('petpal-profile', JSON.stringify(profileData.pet));
    
    // Show success message and confetti
    setShowSuccess(true);
    setShowConfetti(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    // Hide confetti after 4 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    // Redirect to Home Screen after a short delay
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const isFormValid = petData.name.trim() && petData.age.trim() && parseInt(petData.age) > 0;

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {showConfetti && <ConfettiAnimation />}
      
      {/* Animated Paw Trail Background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-25 animate-paw-trail-loop"
            style={{
              left: `${8 + (i * 7)}%`,
              top: `${10 + (i % 5) * 18}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: '10s',
              animationIterationCount: 'infinite',
            }}
          >
            <div className="w-6 h-6 text-2xl" style={{ color: '#F28C38' }}>🐾</div>
          </div>
        ))}
      </div>
      
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="mr-4 p-3 transition-all duration-300 hover:scale-110 animate-pulse-on-hover focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ 
              backgroundColor: '#F28C38',
              color: 'white',
              boxShadow: '0 4px 16px 0 rgba(242, 140, 56, 0.3)',
              borderRadius: '12px'
            }}
            aria-label="Go back to home screen"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="animate-bounce-gentle">
              <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#F28C38', borderRadius: '12px' }}>
                <span className="text-2xl">🐾</span>
              </div>
            </div>
            <div>
              <h1 
                className="text-4xl font-bold animate-bounce-gentle"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '32px',
                  color: '#333333'
                }}
              >
                My Pet
              </h1>
              {currentUser && (
                <p className="text-sm mt-1" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                  Profile for {currentUser}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 animate-fade-in max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ backgroundColor: '#F28C3820', borderRadius: '12px' }}>
            <div className="flex items-center space-x-3">
              <div className="animate-heart-beat">
                <CheckCircle size={24} style={{ color: '#F28C38' }} />
              </div>
              <span className="font-medium" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                Profile Saved! Redirecting to Home...
              </span>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F28C3820', borderRadius: '12px' }}>
              <Heart size={32} style={{ color: '#F28C38' }} />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
              {petData.name ? `${petData.name}'s Profile` : 'Create Pet Profile'}
            </h2>
            <p className="text-sm" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
              Tell us about your furry friend to get personalized care recommendations
            </p>
          </div>

          <form className="space-y-6">
            {/* Pet Name */}
            <div>
              <label 
                htmlFor="petName" 
                className="block text-sm font-semibold mb-3"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                Pet Name *
              </label>
              <input
                type="text"
                id="petName"
                value={petData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                placeholder="Enter your pet's name (e.g., Rover, Bella, Max)"
                required
              />
            </div>

            {/* Breed */}
            <div>
              <label 
                htmlFor="breed" 
                className="block text-sm font-semibold mb-3"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                Breed
              </label>
              <select
                id="breed"
                value={petData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
              >
                <optgroup label="Popular Dog Breeds">
                  <option value="Labrador">Labrador Retriever</option>
                  <option value="Golden Retriever">Golden Retriever</option>
                  <option value="German Shepherd">German Shepherd</option>
                  <option value="Bulldog">Bulldog</option>
                  <option value="Poodle">Poodle</option>
                  <option value="Beagle">Beagle</option>
                  <option value="Rottweiler">Rottweiler</option>
                  <option value="Yorkshire Terrier">Yorkshire Terrier</option>
                  <option value="Dachshund">Dachshund</option>
                  <option value="Siberian Husky">Siberian Husky</option>
                </optgroup>
                <optgroup label="Popular Cat Breeds">
                  <option value="Siamese">Siamese</option>
                  <option value="Persian">Persian</option>
                  <option value="Maine Coon">Maine Coon</option>
                  <option value="British Shorthair">British Shorthair</option>
                  <option value="Ragdoll">Ragdoll</option>
                  <option value="Bengal">Bengal</option>
                  <option value="Abyssinian">Abyssinian</option>
                  <option value="Russian Blue">Russian Blue</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="Mixed Breed">Mixed Breed</option>
                  <option value="Other">Other</option>
                </optgroup>
              </select>
            </div>

            {/* Age */}
            <div>
              <label 
                htmlFor="age" 
                className="block text-sm font-semibold mb-3"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                Age (years) *
              </label>
              <input
                type="number"
                id="age"
                min="0"
                max="30"
                step="1"
                value={petData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                placeholder="Enter your pet's age in years"
                required
              />
              <p className="mt-2 text-xs" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                💡 If unsure, estimate based on size and behavior
              </p>
            </div>

            {/* Health Conditions */}
            <div>
              <label 
                htmlFor="healthConditions" 
                className="block text-sm font-semibold mb-3"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                Health Conditions & Notes
              </label>
              <textarea
                id="healthConditions"
                rows={4}
                value={petData.healthConditions}
                onChange={(e) => handleInputChange('healthConditions', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 resize-none border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                placeholder="Enter any health conditions, allergies, medications, or special notes about your pet... (e.g., 'Allergic to chicken, takes arthritis medication daily')"
              />
              <p className="mt-2 text-xs" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                📝 This helps us provide better personalized care recommendations
              </p>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                isFormValid
                  ? 'hover:scale-105 hover:shadow-xl animate-pulse-on-hover'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              style={{ 
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#F28C38',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 32px 0 rgba(242, 140, 56, 0.4)'
              }}
            >
              <Heart size={20} />
              <span>Save Profile</span>
            </button>
          </form>

          {/* Form Validation Note */}
          <div className="mt-6 p-4" style={{ backgroundColor: '#F28C3820', borderRadius: '12px' }}>
            <p className="text-sm text-center" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
              <span style={{ color: '#F28C38' }}>*</span> Required fields - Name and Age are needed for personalized recommendations
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white p-6 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
            <Heart size={16} style={{ color: '#F28C38' }} />
            <span>Why We Need This Info</span>
          </h3>
          <div className="space-y-3 text-sm" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
            <div className="flex items-start space-x-3">
              <span className="mt-1" style={{ color: '#F28C38' }}>•</span>
              <p><strong style={{ color: '#333333' }}>Name:</strong> Personalizes tips and reminders just for your pet</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="mt-1" style={{ color: '#F28C38' }}>•</span>
              <p><strong style={{ color: '#333333' }}>Breed:</strong> Provides breed-specific care recommendations</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="mt-1" style={{ color: '#F28C38' }}>•</span>
              <p><strong style={{ color: '#333333' }}>Age:</strong> Adjusts advice for puppies, adults, or senior pets</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="mt-1" style={{ color: '#F28C38' }}>•</span>
              <p><strong style={{ color: '#333333' }}>Health Notes:</strong> Ensures safe, relevant care suggestions</p>
            </div>
          </div>
        </div>

        {/* Data Privacy Note */}
        <div className="mt-6 p-4 max-w-4xl mx-auto" style={{ backgroundColor: '#4A90E220', borderRadius: '12px' }}>
          <div className="flex items-start space-x-3">
            <span className="text-lg">🔒</span>
            <div>
              <p className="font-medium text-sm mb-1" style={{ color: '#4A90E2', fontFamily: 'Poppins, sans-serif' }}>
                Your Data is Safe
              </p>
              <p className="text-xs" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                All pet information is stored locally on your device and linked to your email. 
                We never share your personal or pet data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;