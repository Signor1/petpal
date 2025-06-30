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
              <Bell size={32} className="text-teal-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-teal-500">Reminders</h1>
              {currentUser && petData?.name && (
                <p className="text-sm text-gray-600">Managing {petData.name}'s care schedule</p>
              )}
            </div>
          </div>
        </header>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center space-x-3 animate-fade-in max-w-2xl mx-auto">
            <div className="animate-pulse">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <span className="text-green-800 font-medium">{completedTask}</span>
          </div>
        )}

        {/* User Points Display */}
        {currentUser && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <p className="text-yellow-800 font-semibold">Your Paw Points</p>
                  <p className="text-yellow-700 text-sm">{currentUser}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-800">{userPoints}</p>
                <p className="text-yellow-700 text-xs">Points Earned</p>
              </div>
            </div>
          </div>
        )}

        {/* Set Reminder Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Plus size={20} className="text-teal-500" />
            <span>Set New Reminder</span>
          </h2>

          <div className="space-y-4">
            {/* Task Input */}
            <div>
              <label htmlFor="task" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Bell size={16} className="text-gray-500" />
                <span>Task *</span>
              </label>
              <input
                type="text"
                id="task"
                value={formData.task}
                onChange={(e) => handleInputChange('task', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                placeholder={petData?.name ? `e.g., Feed ${petData.name}, Walk ${petData.name}, Give medication...` : "e.g., Feed pet, Walk the dog, Give medication..."}
                required
              />
              
              {/* Quick Task Suggestions */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedTasks().slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleInputChange('task', suggestion)}
                      className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full hover:bg-teal-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Input */}
            <div>
              <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Clock size={16} className="text-gray-500" />
                <span>Time *</span>
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:ring-opacity-50 transition-all duration-200 text-gray-800"
                required
              />
            </div>

            {/* Set Reminder Button */}
            <button
              onClick={handleSetReminder}
              disabled={!isFormValid}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 ${
                isFormValid
                  ? 'bg-pink-300 hover:bg-pink-400 hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Plus size={20} />
              <span>Set Reminder</span>
            </button>
          </div>
        </div>

        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Bell size={20} className="text-yellow-500" />
              <span>Active Reminders ({activeReminders.length})</span>
            </h2>

            <div className="space-y-3 max-w-2xl mx-auto">
              {activeReminders.map((reminder) => (
                <div key={reminder.id} className="bg-yellow-400 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock size={18} className="text-gray-700" />
                        <span className="font-semibold text-gray-800 text-lg">
                          {formatTime(reminder.time)}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium ml-7">{reminder.task}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCompleteReminder(reminder.id, reminder.task)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                        title="Complete task (+10 Paw Points)"
                      >
                        <CheckCircle size={20} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-500" />
              <span>Completed Today ({completedReminders.length})</span>
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto max-w-2xl mx-auto">
              {completedReminders.map((reminder) => (
                <div key={reminder.id} className="bg-green-100 rounded-lg p-4 shadow-md opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="font-semibold text-gray-700 text-lg line-through">
                          {formatTime(reminder.time)}
                        </span>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          +10 Points
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium ml-7 line-through">{reminder.task}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
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
          <div className="text-center py-12 max-w-2xl mx-auto">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reminders Yet</h3>
            <p className="text-gray-500 mb-6">
              Set your first reminder to start earning Paw Points and keep {petData?.name || 'your pet'} healthy!
            </p>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium text-sm">
                💡 Each completed reminder earns you 10 Paw Points!
              </p>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Sparkles size={20} className="text-teal-500" />
            <span>Reminder Tips</span>
          </h3>
          <div className="space-y-3 text-gray-600 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Complete tasks to earn 10 Paw Points each - stay consistent!</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Set regular feeding times to maintain your pet's healthy routine</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use specific task names like "Feed {petData?.name || 'Rover'}" instead of just "Feed"</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Set medication reminders at the same time each day for consistency</p>
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
                  Reminders for {currentUser}
                </p>
                <p className="text-teal-700 text-xs">
                  All reminders and points are securely stored and linked to your account
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Paw Points Info */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="animate-bounce">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-yellow-800 font-medium text-sm">
                Complete reminders to earn Paw Points and show your dedication to pet care!
              </p>
              <p className="text-yellow-700 text-xs mt-1">
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