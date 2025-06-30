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

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {showConfetti && <ConfettiAnimation />}
      
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
              <Heart size={32} className="text-teal-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teal-500">My Pet</h1>
              {currentUser && (
                <p className="text-sm text-gray-600">Profile for {currentUser}</p>
              )}
            </div>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-pink-100 border border-pink-300 rounded-lg flex items-center space-x-3 animate-fade-in max-w-2xl mx-auto">
            <div className="animate-pulse">
              <CheckCircle size={24} className="text-pink-600" />
            </div>
            <span className="text-pink-800 font-medium">Profile Saved! Redirecting to Home...</span>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart size={32} className="text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {petData.name ? `${petData.name}'s Profile` : 'Create Pet Profile'}
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Tell us about your furry friend to get personalized care recommendations
            </p>
          </div>

          <form className="space-y-6">
            {/* Pet Name */}
            <div>
              <label htmlFor="petName" className="block text-sm font-semibold text-gray-700 mb-2">
                Pet Name *
              </label>
              <input
                type="text"
                id="petName"
                value={petData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Enter your pet's name (e.g., Rover, Bella, Max)"
                required
              />
            </div>

            {/* Breed */}
            <div>
              <label htmlFor="breed" className="block text-sm font-semibold text-gray-700 mb-2">
                Breed
              </label>
              <select
                id="breed"
                value={petData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 bg-white"
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
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Enter your pet's age in years"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 If unsure, estimate based on size and behavior
              </p>
            </div>

            {/* Health Conditions */}
            <div>
              <label htmlFor="healthConditions" className="block text-sm font-semibold text-gray-700 mb-2">
                Health Conditions & Notes
              </label>
              <textarea
                id="healthConditions"
                rows={4}
                value={petData.healthConditions}
                onChange={(e) => handleInputChange('healthConditions', e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                placeholder="Enter any health conditions, allergies, medications, or special notes about your pet... (e.g., 'Allergic to chicken, takes arthritis medication daily')"
              />
              <p className="mt-1 text-xs text-gray-500">
                📝 This helps us provide better personalized care recommendations
              </p>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                isFormValid
                  ? 'bg-teal-500 hover:bg-teal-600 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Heart size={20} />
              <span>Save Profile</span>
            </button>
          </form>

          {/* Form Validation Note */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <span className="text-red-500">*</span> Required fields - Name and Age are needed for personalized recommendations
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-4 bg-pink-100 rounded-lg border border-pink-200 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <Heart size={16} className="text-pink-500" />
            <span>Why We Need This Info</span>
          </h3>
          <div className="space-y-2 text-gray-600 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <p><strong>Name:</strong> Personalizes tips and reminders just for your pet</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <p><strong>Breed:</strong> Provides breed-specific care recommendations</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <p><strong>Age:</strong> Adjusts advice for puppies, adults, or senior pets</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-pink-500 mt-0.5">•</span>
              <p><strong>Health Notes:</strong> Ensures safe, relevant care suggestions</p>
            </div>
          </div>
        </div>

        {/* Data Privacy Note */}
        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-start space-x-2">
            <span className="text-teal-500 text-lg">🔒</span>
            <div>
              <p className="text-teal-800 font-medium text-sm mb-1">Your Data is Safe</p>
              <p className="text-teal-700 text-xs">
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