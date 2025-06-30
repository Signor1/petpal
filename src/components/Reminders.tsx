import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Plus, CheckCircle, Clock, Trash2, Sparkles } from 'lucide-react';
import ConfettiAnimation from './ConfettiAnimation';

interface RemindersProps {
  onBack: () => void;
  onPawPointsUpdate: (points: number) => void;
}

interface Reminder {
  id: string;
  task: string;
  time: string;
  completed: boolean;
  createdAt: number;
}

interface PetData {
  name: string;
  breed: string;
  age: string;
  healthConditions: string;
}

interface UserRemindersData {
  email: string;
  reminders: Reminder[];
  points: number;
}

const Reminders: React.FC<RemindersProps> = ({ onBack, onPawPointsUpdate }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [formData, setFormData] = useState({
    task: '',
    time: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedTask, setCompletedTask] = useState('');
  const [petData, setPetData] = useState<PetData | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      // Load reminders and points for this user
      const userRemindersKey = `petpal-reminders-${userEmail.toLowerCase()}`;
      const savedRemindersData = localStorage.getItem(userRemindersKey);
      if (savedRemindersData) {
        try {
          const remindersData: UserRemindersData = JSON.parse(savedRemindersData);
          if (remindersData.reminders && Array.isArray(remindersData.reminders)) {
            setReminders(remindersData.reminders);
          }
          if (typeof remindersData.points === 'number') {
            setUserPoints(remindersData.points);
          }
        } catch (error) {
          console.error('Error loading reminders data:', error);
          // Create empty reminders structure
          const emptyReminders: UserRemindersData = {
            email: userEmail,
            reminders: [],
            points: 0
          };
          localStorage.setItem(userRemindersKey, JSON.stringify(emptyReminders));
          setReminders([]);
          setUserPoints(0);
        }
      } else {
        // Create sample reminders for new users
        const sampleReminders: Reminder[] = [
          {
            id: '1',
            task: petData?.name ? `Feed ${petData.name} morning meal` : 'Feed morning meal',
            time: '08:00',
            completed: false,
            createdAt: Date.now() - 86400000
          },
          {
            id: '2',
            task: petData?.name ? `Evening walk with ${petData.name}` : 'Evening walk',
            time: '18:30',
            completed: false,
            createdAt: Date.now() - 43200000
          }
        ];
        
        const initialReminders: UserRemindersData = {
          email: userEmail,
          reminders: sampleReminders,
          points: 0
        };
        
        localStorage.setItem(userRemindersKey, JSON.stringify(initialReminders));
        setReminders(sampleReminders);
        setUserPoints(0);
      }
    }
  }, [petData?.name]);

  // Save reminders and points to localStorage
  const saveRemindersData = (updatedReminders: Reminder[], updatedPoints: number) => {
    if (!currentUser) return;

    const userRemindersKey = `petpal-reminders-${currentUser.toLowerCase()}`;
    const remindersData: UserRemindersData = {
      email: currentUser,
      reminders: updatedReminders,
      points: updatedPoints
    };
    localStorage.setItem(userRemindersKey, JSON.stringify(remindersData));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSetReminder = () => {
    if (!formData.task.trim() || !formData.time || !currentUser) return;

    const newReminder: Reminder = {
      id: Date.now().toString(),
      task: formData.task.trim(),
      time: formData.time,
      completed: false,
      createdAt: Date.now()
    };

    const updatedReminders = [newReminder, ...reminders];
    setReminders(updatedReminders);
    saveRemindersData(updatedReminders, userPoints);

    // Show success message
    setShowSuccess(true);
    setCompletedTask(`Reminder "${formData.task}" set successfully!`);

    // Reset form
    setFormData({
      task: '',
      time: ''
    });

    // Hide success message
    setTimeout(() => {
      setShowSuccess(false);
      setCompletedTask('');
    }, 3000);
  };

  const handleCompleteReminder = (id: string, task: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: true } : reminder
    );
    
    // Add 10 Paw Points
    const newPoints = userPoints + 10;
    setUserPoints(newPoints);
    setReminders(updatedReminders);
    saveRemindersData(updatedReminders, newPoints);

    // Update global Paw Points counter
    onPawPointsUpdate(10);

    // Show confetti and success message
    setShowConfetti(true);
    setShowSuccess(true);
    setCompletedTask(`Great job! You completed "${task}" and earned 10 Paw Points! 🎉`);

    // Hide animations
    setTimeout(() => {
      setShowSuccess(false);
      setCompletedTask('');
    }, 4000);

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const handleDeleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    saveRemindersData(updatedReminders, userPoints);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isFormValid = formData.task.trim() && formData.time;
  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  // Suggested tasks based on pet data
  const getSuggestedTasks = () => {
    const baseTasks = [
      'Feed morning meal',
      'Feed evening meal',
      'Morning walk',
      'Evening walk',
      'Brush teeth',
      'Give medication',
      'Playtime',
      'Grooming session',
      'Fresh water refill',
      'Litter box cleaning'
    ];

    if (petData?.name) {
      return baseTasks.map(task => 
        task.replace(/Feed/g, `Feed ${petData.name}`)
             .replace(/walk/g, `walk with ${petData.name}`)
             .replace(/Brush teeth/g, `Brush ${petData.name}'s teeth`)
             .replace(/Playtime/g, `Playtime with ${petData.name}`)
             .replace(/Grooming session/g, `Grooming session for ${petData.name}`)
      );
    }

    return baseTasks;
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 opacity-80 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: '#F5E8C7',
                animationDelay: `${Math.random() * 3}s`,
                borderRadius: '50%',
                boxShadow: '0 0 6px #F5E8C7',
              }}
            />
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
            <div className="w-6 h-6 text-2xl" style={{ color: '#F5E8C7' }}>🐾</div>
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
              backgroundColor: '#F5E8C7',
              color: '#333333',
              boxShadow: '0 4px 16px 0 rgba(245, 232, 199, 0.3)',
              borderRadius: '12px'
            }}
            aria-label="Go back to home screen"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="animate-bounce-gentle">
              <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}>
                <Bell size={24} style={{ color: '#333333' }} />
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
                Reminders
              </h1>
              {currentUser && petData?.name && (
                <p className="text-sm mt-1" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                  Managing {petData.name}'s care schedule
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
                <CheckCircle size={24} style={{ color: '#4CAF50' }} />
              </div>
              <span className="font-medium" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                {completedTask}
              </span>
            </div>
          </div>
        )}

        {/* User Points Display */}
        {currentUser && (
          <div className="mb-6 bg-white p-4 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}>
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>Your Paw Points</p>
                  <p className="text-sm" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>{currentUser}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: '#333333' }}>{userPoints}</p>
                <p className="text-xs" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>Points Earned</p>
              </div>
            </div>
          </div>
        )}

        {/* Set Reminder Form */}
        <div className="bg-white p-6 mb-6 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
            <Plus size={20} style={{ color: '#F5E8C7' }} />
            <span>Set New Reminder</span>
          </h2>

          <div className="space-y-6">
            {/* Task Input */}
            <div>
              <label 
                htmlFor="task" 
                className="block text-sm font-semibold mb-3 flex items-center space-x-2"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                <Bell size={16} style={{ color: '#666666' }} />
                <span>Task *</span>
              </label>
              <input
                type="text"
                id="task"
                value={formData.task}
                onChange={(e) => handleInputChange('task', e.target.value)}
                className="w-full px-4 py-4 transition-all duration-300 border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  color: '#333333',
                  borderRadius: '12px'
                }}
                placeholder={petData?.name ? `e.g., Feed ${petData.name}, Walk ${petData.name}, Give medication...` : "e.g., Feed pet, Walk the dog, Give medication..."}
                required
              />
              
              {/* Quick Task Suggestions */}
              <div className="mt-3">
                <p className="text-xs mb-2" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedTasks().slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('task', suggestion)}
                      className="text-xs px-3 py-1 transition-colors duration-200"
                      style={{ backgroundColor: '#F5E8C720', color: '#333333', borderRadius: '12px' }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Input */}
            <div>
              <label 
                htmlFor="time" 
                className="block text-sm font-semibold mb-3 flex items-center space-x-2"
                style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}
              >
                <Clock size={16} style={{ color: '#666666' }} />
                <span>Time *</span>
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
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

            {/* Set Reminder Button */}
            <button
              onClick={handleSetReminder}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                isFormValid
                  ? 'hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-on-hover focus:outline-none focus:ring-2 focus:ring-opacity-50'
                  : 'opacity-60 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: '#F5E8C7',
                color: '#333333',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 8px 32px 0 rgba(245, 232, 199, 0.4)',
                borderRadius: '12px'
              }}
            >
              <Plus size={20} />
              <span>Set Reminder</span>
            </button>
          </div>
        </div>

        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
              <Bell size={20} style={{ color: '#F5E8C7' }} />
              <span>Active Reminders ({activeReminders.length})</span>
            </h2>

            <div className="space-y-4 max-w-4xl mx-auto">
              {activeReminders.map((reminder) => (
                <div key={reminder.id} className="bg-white p-4 hover:shadow-lg transition-all duration-300 shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock size={18} style={{ color: '#333333' }} />
                        <span className="font-semibold text-lg" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                          {formatTime(reminder.time)}
                        </span>
                      </div>
                      <p className="font-medium ml-7" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>{reminder.task}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCompleteReminder(reminder.id, reminder.task)}
                        className="p-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ backgroundColor: '#F5E8C7', color: '#333333', borderRadius: '12px' }}
                        title="Complete task (+10 Paw Points)"
                      >
                        <CheckCircle size={20} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="p-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{ backgroundColor: '#D32F2F', color: 'white', borderRadius: '12px' }}
                        title="Delete reminder"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
              <CheckCircle size={20} style={{ color: '#4CAF50' }} />
              <span>Completed Today ({completedReminders.length})</span>
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto max-w-4xl mx-auto">
              {completedReminders.map((reminder) => (
                <div key={reminder.id} className="bg-white p-4 opacity-75 shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle size={18} style={{ color: '#4CAF50' }} />
                        <span className="font-semibold text-lg line-through" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                          {formatTime(reminder.time)}
                        </span>
                        <span className="text-xs px-2 py-1 font-medium text-white" style={{ backgroundColor: '#4CAF50', borderRadius: '12px' }}>
                          +10 Points
                        </span>
                      </div>
                      <p className="font-medium ml-7 line-through" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>{reminder.task}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ backgroundColor: '#9E9E9E', color: 'white', borderRadius: '12px' }}
                      title="Remove from list"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {reminders.length === 0 && (
          <div className="text-center py-12 max-w-4xl mx-auto">
            <Bell size={64} className="mx-auto mb-4 opacity-30" style={{ color: '#666666' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>No Reminders Yet</h3>
            <p className="mb-6" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
              Set your first reminder to start earning Paw Points and keep {petData?.name || 'your pet'} healthy!
            </p>
            <div className="bg-white p-4 shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
              <p className="font-medium text-sm" style={{ color: '#F5E8C7', fontFamily: 'Poppins, sans-serif' }}>
                💡 Each completed reminder earns you 10 Paw Points!
              </p>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white p-6 mb-6 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <h3 className="font-semibold mb-4 flex items-center space-x-2" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
            <Sparkles size={20} style={{ color: '#F5E8C7' }} />
            <span>Reminder Tips</span>
          </h3>
          <div className="space-y-3 text-sm" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 flex-shrink-0" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}></div>
              <p>Complete tasks to earn 10 Paw Points each - stay consistent!</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 flex-shrink-0" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}></div>
              <p>Set regular feeding times to maintain your pet's healthy routine</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 flex-shrink-0" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}></div>
              <p>Use specific task names like "Feed {petData?.name || 'Rover'}" instead of just "Feed"</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 flex-shrink-0" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}></div>
              <p>Set medication reminders at the same time each day for consistency</p>
            </div>
          </div>
        </div>

        {/* User Context Info */}
        {currentUser && (
          <div className="p-4 max-w-4xl mx-auto mb-6" style={{ backgroundColor: '#F5E8C720', borderRadius: '12px' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: '#F5E8C7', borderRadius: '12px' }}>
                <span className="text-sm" style={{ color: '#333333' }}>👤</span>
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                  Reminders for {currentUser}
                </p>
                <p className="text-xs" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                  All reminders and points are securely stored and linked to your account
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Paw Points Info */}
        <div className="bg-white p-4 max-w-4xl mx-auto shadow-lg border border-gray-100" style={{ borderRadius: '12px' }}>
          <div className="flex items-center space-x-3">
            <div className="animate-bounce-gentle">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: '#333333', fontFamily: 'Poppins, sans-serif' }}>
                Complete reminders to earn Paw Points and show your dedication to pet care!
              </p>
              <p className="text-xs mt-1" style={{ color: '#666666', fontFamily: 'Poppins, sans-serif' }}>
                Your points sync with the Home Screen counter automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;