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
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [petData, setPetData] = useState<PetData | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            symptom: petData?.name ? `${petData.name} had slight limping on left paw` : 'Slight limping on left paw',
            weight: '45',
            timestamp: Date.now() - 86400000 * 7
          },
          {
            id: '2',
            date: '2024-01-10',
            symptom: petData?.name ? `${petData.name} normal checkup - all good!` : 'Normal checkup - all good!',
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
  }, [petData?.name]);

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

    // Show success animations
    setShowSuccess(true);
    setShowConfetti(true);
    setShowHeartAnimation(true);

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      symptom: '',
      weight: ''
    });

    // Hide animations
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isFormValid = formData.symptom.trim() && formData.date;

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {showConfetti && <ConfettiAnimation />}
      
      {/* Heart Animation on Save */}
      {showHeartAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-heart-beat"
              style={{
                left: `${45 + (i % 3) * 5}%`,
                top: `${40 + (i % 3) * 5}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            >
              <Heart size={24} style={{ color: '#F28C38' }} />
            </div>
          ))}
        </div>
      )}

      {/* Animated Paw Trail Background */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-paw-trail-loop"
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
                <Stethoscope size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 
                className="text-4xl font-bold"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '24px',
                  color: '#333333'
                }}
              >
                Health Tracker
              </h1>
              {currentUser && petData?.name && (
                <p className="text-sm mt-1" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                  Tracking {petData.name}'s health
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 animate-fade-in max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ backgroundColor: '#4CAF5020', borderRadius: '12px' }}>
            <div className="flex items-center space-x-3">
              <div className="animate-heart-beat">
                <Heart size={24} style={{ color: '#4CAF50' }} />
              </div>
              <span className="font-medium" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                Health entry logged successfully! 🎉
              </span>
            </div>
          </div>
        )}

        {/* Logging Form */}
        <div className="bg-white p-6 mb-6 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
            <Plus size={20} style={{ color: '#F28C38' }} />
            <span>Log New Entry</span>
          </h2>

          <div className="space-y-6">
            {/* Date Input */}
            <div>
              <label 
                htmlFor="date" 
                className="block text-sm font-semibold mb-3 flex items-center space-x-2"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                <Calendar size={16} style={{ color: '#666666' }} />
                <span>Date</span>
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                required
              />
            </div>

            {/* Symptom Input */}
            <div>
              <label 
                htmlFor="symptom" 
                className="block text-sm font-semibold mb-3 flex items-center space-x-2"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                <AlertTriangle size={16} style={{ color: '#666666' }} />
                <span>Symptom or Observation *</span>
              </label>
              <input
                type="text"
                id="symptom"
                value={formData.symptom}
                onChange={(e) => handleInputChange('symptom', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                placeholder={petData?.name ? `e.g., ${petData.name} is limping, coughing, normal behavior...` : "e.g., limping, coughing, normal behavior..."}
                required
              />
            </div>

            {/* Weight Input */}
            <div>
              <label 
                htmlFor="weight" 
                className="block text-sm font-semibold mb-3 flex items-center space-x-2"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                <Weight size={16} style={{ color: '#666666' }} />
                <span>Weight (lbs)</span>
              </label>
              <input
                type="number"
                id="weight"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                placeholder="Enter current weight"
              />
            </div>

            {/* Log Entry Button */}
            <button
              onClick={handleLogEntry}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                isFormValid
                  ? 'hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-on-hover focus:outline-none focus:ring-2 focus:ring-opacity-50'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: '#F28C38',
                color: 'white',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 8px 32px 0 rgba(242, 140, 56, 0.4)',
                borderRadius: '12px'
              }}
            >
              <Plus size={20} />
              <span>Log Entry</span>
            </button>
          </div>
        </div>

        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="bg-white p-6 mb-6 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
            <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
              <Stethoscope size={20} style={{ color: '#4A90E2' }} />
              <span>AI Health Suggestion</span>
            </h3>
            <p className="leading-relaxed mb-4" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
              {aiSuggestion}
            </p>
            {petData?.name && (
              <div className="p-3" style={{ backgroundColor: '#4A90E220', borderRadius: '12px' }}>
                <p className="text-sm" style={{ color: '#4A90E2', fontFamily: 'Poppins, sans-serif' }}>
                  💡 Personalized advice for {petData.name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Past Entries */}
        <div className="bg-white p-6 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
            <Heart size={20} style={{ color: '#F28C38' }} />
            <span>Health History</span>
            {currentUser && (
              <span className="text-sm font-normal" style={{ color: '#666666' }}>({entries.length} entries)</span>
            )}
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#666666' }}>
              <Stethoscope size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>No health entries yet</p>
              <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Log your first entry above to start tracking {petData?.name || 'your pet'}'s health!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#F28C3820', borderRadius: '12px' }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                      {formatDate(entry.date)}
                    </span>
                    {entry.weight !== 'Not recorded' && (
                      <span className="text-sm px-3 py-1 font-medium" style={{ backgroundColor: '#F28C38', color: 'white', borderRadius: '12px' }}>
                        {entry.weight} lbs
                      </span>
                    )}
                  </div>
                  <p className="font-medium" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>{entry.symptom}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Context Info */}
        {currentUser && (
          <div className="mt-6 p-4 max-w-4xl mx-auto" style={{ backgroundColor: '#F28C3820', borderRadius: '12px' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#F28C38', borderRadius: '12px' }}>
                <span className="text-white text-sm">👤</span>
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: '#F28C38', fontFamily: 'Poppins, sans-serif' }}>
                  Health logs for {currentUser}
                </p>
                <p className="text-xs" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                  All entries are securely stored and linked to your account
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 bg-white p-4 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <p className="text-xs text-center" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
            ⚠️ This tracker is for monitoring purposes only. Always consult your veterinarian for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;