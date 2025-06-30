import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Plus, Calendar, Weight, AlertTriangle, Stethoscope } from 'lucide-react';
import ConfettiAnimation from './ConfettiAnimation';

interface HealthTrackerProps {
  onBack: () => void;
}

interface HealthEntry {
  id: string;
  date: string;
  symptom: string;
  weight: string;
  timestamp: number;
}

interface PetData {
  name: string;
  breed: string;
  age: string;
  healthConditions: string;
}

interface UserHealthLogs {
  email: string;
  logs: HealthEntry[];
}

const HealthTracker: React.FC<HealthTrackerProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    symptom: '',
    weight: ''
  });
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [petData, setPetData] = useState<PetData | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // AI suggestion database
  const aiSuggestions = {
    // Symptoms that require immediate vet attention
    urgent: {
      keywords: ['bleeding', 'seizure', 'unconscious', 'difficulty breathing', 'choking', 'poisoning', 'bloated', 'collapse'],
      response: "🚨 This symptom requires IMMEDIATE veterinary attention. Contact your emergency vet or animal hospital right away!"
    },
    // Common symptoms with advice
    common: {
      'limping': "🦴 Limping could indicate injury, arthritis, or paw problems. Rest your pet and schedule a vet visit if it persists beyond 24 hours.",
      'vomiting': "🤢 Monitor for dehydration. Withhold food for 12 hours, then offer small amounts. See a vet if vomiting continues or if blood is present.",
      'diarrhea': "💩 Ensure your pet stays hydrated. Bland diet (rice and chicken) may help. Consult your vet if it lasts more than 24 hours.",
      'coughing': "😷 Could be kennel cough, allergies, or heart issues. Monitor frequency and see a vet if persistent or worsening.",
      'scratching': "🐾 May indicate allergies, fleas, or skin conditions. Check for parasites and consider an antihistamine after vet consultation.",
      'lethargy': "😴 Could signal various health issues. Monitor eating and drinking habits. Schedule a vet visit if it continues.",
      'loss of appetite': "🍽️ Monitor for 24 hours. Ensure fresh water is available. Contact your vet if appetite doesn't return.",
      'excessive drinking': "💧 Could indicate diabetes, kidney issues, or other conditions. Track water intake and consult your vet.",
      'panting': "🌡️ Normal after exercise, but excessive panting may indicate pain, anxiety, or overheating. Monitor and consult vet if concerned.",
      'shaking': "🥶 Could be cold, anxiety, pain, or neurological issues. Provide warmth and comfort, see vet if persistent."
    },
    // Weight-related advice
    weight: {
      gain: "📈 Weight gain detected. Consider adjusting diet portions and increasing exercise. Consult your vet for a weight management plan.",
      loss: "📉 Weight loss noted. Monitor eating habits closely and schedule a vet checkup to rule out underlying health issues.",
      stable: "✅ Weight appears stable. Continue current diet and exercise routine to maintain optimal health."
    }
  };

  // Load data on component mount
  useEffect(() => {
    // Get current user email
    const userEmail = localStorage.getItem('petpal-current-user');
    if (userEmail) {
      setCurrentUser(userEmail);
      
      // Load pet data for this user
      const userProfileKey = `petpal-profile-${userEmail.toLowerCase()}`;
      const savedPetData = localStorage.getItem(userProfileKey);
      if (savedPetData) {
        try {
          const profileData = JSON.parse(savedPetData);
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

      // Load health entries for this user
      const userHealthKey = `petpal-health-${userEmail.toLowerCase()}`;
      const savedHealthLogs = localStorage.getItem(userHealthKey);
      if (savedHealthLogs) {
        try {
          const healthData: UserHealthLogs = JSON.parse(savedHealthLogs);
          if (healthData.logs && Array.isArray(healthData.logs)) {
            setEntries(healthData.logs);
          }
        } catch (error) {
          console.error('Error loading health logs:', error);
          // Create empty logs structure
          const emptyLogs: UserHealthLogs = {
            email: userEmail,
            logs: []
          };
          localStorage.setItem(userHealthKey, JSON.stringify(emptyLogs));
          setEntries([]);
        }
      } else {
        // Create sample entries for new users
        const sampleEntries: HealthEntry[] = [
          {
            id: '1',
            date: '2024-01-15',
            symptom: 'Slight limping on left paw',
            weight: '45',
            timestamp: Date.now() - 86400000 * 7
          },
          {
            id: '2',
            date: '2024-01-10',
            symptom: 'Normal checkup - all good!',
            weight: '44.5',
            timestamp: Date.now() - 86400000 * 12
          }
        ];
        
        const initialLogs: UserHealthLogs = {
          email: userEmail,
          logs: sampleEntries
        };
        
        localStorage.setItem(userHealthKey, JSON.stringify(initialLogs));
        setEntries(sampleEntries);
      }
    }
  }, []);

  const generateAISuggestion = (symptom: string, weight: string) => {
    const symptomLower = symptom.toLowerCase();
    
    // Check for urgent symptoms
    const urgentKeyword = aiSuggestions.urgent.keywords.find(keyword => 
      symptomLower.includes(keyword)
    );
    if (urgentKeyword) {
      return aiSuggestions.urgent.response;
    }

    // Check for common symptoms
    const commonSymptom = Object.keys(aiSuggestions.common).find(key =>
      symptomLower.includes(key)
    );
    if (commonSymptom) {
      return aiSuggestions.common[commonSymptom as keyof typeof aiSuggestions.common];
    }

    // Weight-based suggestions
    if (entries.length > 0 && weight) {
      const lastWeight = parseFloat(entries[0].weight);
      const currentWeight = parseFloat(weight);
      const weightDiff = currentWeight - lastWeight;
      
      if (weightDiff > 2) {
        return aiSuggestions.weight.gain;
      } else if (weightDiff < -2) {
        return aiSuggestions.weight.loss;
      } else if (Math.abs(weightDiff) <= 1) {
        return aiSuggestions.weight.stable;
      }
    }

    // Generic advice
    return "📋 Keep monitoring your pet's condition. Document any changes and consult your veterinarian if symptoms persist or worsen.";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Generate AI suggestion when symptom is entered
    if (field === 'symptom' && value.trim()) {
      const suggestion = generateAISuggestion(value, formData.weight);
      setAiSuggestion(suggestion);
    }
  };

  const handleLogEntry = () => {
    if (!formData.symptom.trim() || !currentUser) return;

    const newEntry: HealthEntry = {
      id: Date.now().toString(),
      date: formData.date,
      symptom: formData.symptom.trim(),
      weight: formData.weight || 'Not recorded',
      timestamp: Date.now()
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    // Save to localStorage with email-based key
    const userHealthKey = `petpal-health-${currentUser.toLowerCase()}`;
    const healthData: UserHealthLogs = {
      email: currentUser,
      logs: updatedEntries
    };
    localStorage.setItem(userHealthKey, JSON.stringify(healthData));

    // Generate final AI suggestion
    const suggestion = generateAISuggestion(formData.symptom, formData.weight);
    setAiSuggestion(suggestion);

    // Show success animation
    setShowSuccess(true);
    setShowConfetti(true);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      weight: ''
    });

    // Hide success message
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // Hide confetti
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isFormValid = formData.symptom.trim() && formData.date;

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
              <Stethoscope size={32} className="text-teal-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teal-500">Health Tracker</h1>
              {currentUser && petData?.name && (
                <p className="text-sm text-gray-600">Tracking {petData.name}'s health</p>
              )}
            </div>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center space-x-3 animate-fade-in max-w-2xl mx-auto">
            <div className="animate-heart-beat">
              <Heart size={24} className="text-green-600" />
            </div>
            <span className="text-green-800 font-medium">Health entry logged successfully!</span>
          </div>
        )}

        {/* Logging Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Plus size={20} className="text-teal-500" />
            <span>Log New Entry</span>
          </h2>

          <div className="space-y-4">
            {/* Date Input */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Calendar size={16} className="text-gray-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800"
                required
              />
            </div>

            {/* Symptom Input */}
            <div>
              <label htmlFor="symptom" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <AlertTriangle size={16} className="text-gray-500" />
                <span>Symptom or Observation *</span>
              </label>
              <input
                type="text"
                id="symptom"
                value={formData.symptom}
                onChange={(e) => handleInputChange('symptom', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="e.g., limping, coughing, normal behavior..."
                required
              />
            </div>

            {/* Weight Input */}
            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Weight size={16} className="text-gray-500" />
                <span>Weight (lbs)</span>
              </label>
              <input
                type="number"
                id="weight"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder="Enter current weight"
              />
            </div>

            {/* Log Entry Button */}
            <button
              onClick={handleLogEntry}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 ${
                isFormValid
                  ? 'bg-pink-300 hover:bg-pink-400 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Plus size={20} />
              <span>Log Entry</span>
            </button>
          </div>
        </div>

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="bg-teal-500 text-white rounded-xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Stethoscope size={20} />
              <span>AI Health Suggestion</span>
            </h3>
            <p className="leading-relaxed">{aiSuggestion}</p>
            {petData?.name && (
              <p className="mt-3 text-teal-100 text-sm">
                💡 Personalized advice for {petData.name}
              </p>
            )}
          </div>
        )}

        {/* Past Entries */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Heart size={20} className="text-pink-500" />
            <span>Health History</span>
            {currentUser && (
              <span className="text-sm text-gray-500 font-normal">({entries.length} entries)</span>
            )}
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Stethoscope size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No health entries yet</p>
              <p className="text-sm">Log your first entry above to start tracking {petData?.name || 'your pet'}'s health!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-yellow-400 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {formatDate(entry.date)}
                    </span>
                    {entry.weight !== 'Not recorded' && (
                      <span className="text-sm text-gray-700 bg-yellow-300 px-2 py-1 rounded-full font-medium">
                        {entry.weight} lbs
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 font-medium">{entry.symptom}</p>
                </div>
              ))}
            </div>
          )}
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
                  Health logs for {currentUser}
                </p>
                <p className="text-teal-700 text-xs">
                  All entries are securely stored and linked to your account
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ This tracker is for monitoring purposes only. Always consult your veterinarian for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;