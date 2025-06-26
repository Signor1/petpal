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

const PetProfile: React.FC<PetProfileProps> = ({ onBack }) => {
  const [petData, setPetData] = useState<PetData>({
    name: '',
    breed: 'Labrador',
    age: '',
    healthConditions: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('petpal-profile');
    if (savedData) {
      setPetData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: keyof PetData, value: string) => {
    setPetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('petpal-profile', JSON.stringify(petData));
    
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
  };

  const isFormValid = petData.name.trim() && petData.age.trim();

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
            <h1 className="text-3xl font-bold text-teal-500">My Pet</h1>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center space-x-3 animate-fade-in">
            <CheckCircle size={24} className="text-green-600" />
            <span className="text-green-800 font-medium">Profile Saved!</span>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Enter your pet's name"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 bg-white"
              >
                <option value="Labrador">Labrador</option>
                <option value="Golden Retriever">Golden Retriever</option>
                <option value="German Shepherd">German Shepherd</option>
                <option value="Bulldog">Bulldog</option>
                <option value="Poodle">Poodle</option>
                <option value="Siamese">Siamese</option>
                <option value="Persian">Persian</option>
                <option value="Maine Coon">Maine Coon</option>
                <option value="British Shorthair">British Shorthair</option>
                <option value="Other">Other</option>
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
                value={petData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Enter your pet's age"
                required
              />
            </div>

            {/* Health Conditions */}
            <div>
              <label htmlFor="healthConditions" className="block text-sm font-semibold text-gray-700 mb-2">
                Health Conditions
              </label>
              <textarea
                id="healthConditions"
                rows={4}
                value={petData.healthConditions}
                onChange={(e) => handleInputChange('healthConditions', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                placeholder="Enter any health conditions, allergies, or special notes about your pet..."
              />
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
          <p className="mt-4 text-sm text-gray-500 text-center">
            * Required fields
          </p>
        </div>

        {/* Tips Section */}
        <div className="mt-8 p-4 bg-pink-100 rounded-lg border border-pink-200 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <Heart size={16} className="text-pink-500" />
            <span>Pro Tip</span>
          </h3>
          <p className="text-gray-600 text-sm">
            Keep your pet's profile updated to receive personalized care recommendations and health reminders!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;