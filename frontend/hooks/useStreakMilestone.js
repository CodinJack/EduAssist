// hooks/useStreakMilestone.js

import { useEffect, useState } from 'react';

const useStreakMilestone = (currentStreak, previousStreak) => {
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  
  // Define milestone thresholds
  const milestones = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];
  
  useEffect(() => {
    // Only check for milestones if streak increased
    if (currentStreak > previousStreak) {
      // Check if current streak crosses any milestone
      const reachedMilestone = milestones.some(milestone => 
        currentStreak >= milestone && previousStreak < milestone
      );
      
      if (reachedMilestone) {
        setShowMilestoneModal(true);
      }
    }
  }, [currentStreak, previousStreak]);
  
  return {
    showMilestoneModal,
    closeMilestoneModal: () => setShowMilestoneModal(false)
  };
};

export default useStreakMilestone;