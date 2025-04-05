// components/streakMilestoneModal.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, X, Award, Trophy, Star } from 'lucide-react';

const streakMilestoneModal = ({ streak, onClose }) => {
  // Define milestones and their messages
  const getMilestoneInfo = (streak) => {
    if (streak >= 100) return { 
      title: "Legendary Streak!",
      icon: Trophy,
      message: "You've reached a legendary 100-day streak! Your dedication to learning is truly inspiring.",
      color: "from-yellow-400 to-amber-600"
    };
    if (streak >= 30) return { 
      title: "Monthly Master!",
      icon: Award,
      message: "A full month of consistent learning! You're building incredible habits.",
      color: "from-blue-400 to-blue-600"
    };
    if (streak >= 7) return { 
      title: "Weekly Warrior!",
      icon: Star,
      message: "You've completed a full week of learning! Keep the momentum going!",
      color: "from-purple-400 to-purple-600"
    };
    return { 
      title: "Streak Started!",
      icon: Flame,
      message: "You've begun your learning streak! Come back tomorrow to keep it going.",
      color: "from-orange-400 to-red-500"
    };
  };

  const milestoneInfo = getMilestoneInfo(streak);
  const IconComponent = milestoneInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${milestoneInfo.color} p-6 text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-white bg-opacity-20 p-4 rounded-full mb-4"
            >
              <IconComponent size={40} className="text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-center">{milestoneInfo.title}</h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent inline-block mb-2">
              {streak} Days
            </div>
            <p className="text-gray-600">{milestoneInfo.message}</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // You could navigate to quizzes page here
                // router.push('/quizzes');
              }}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default streakMilestoneModal;