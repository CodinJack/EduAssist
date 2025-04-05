// services/streakService.js
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";

export const updateUserStreak = async (userId, completedAt) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    const userData = userDoc.data();
    const currentDate = new Date(completedAt);

    const lastQuizDate = userData.last_quiz_date ? 
      new Date(userData.last_quiz_date.seconds * 1000) : 
      (userData.streak?.lastQuizDate ? 
        new Date(userData.streak.lastQuizDate.seconds * 1000) : null);
    
    const currentStreak = userData.currentStreak || userData.streak?.count || 0;
    const maxStreak = userData.maxStreak || 0;
    
    let newStreak = currentStreak;
    let newMaxStreak = maxStreak;
    let streakMaintained = false;
    
    // Check if this is the first quiz
    if (!lastQuizDate) {
      newStreak = 1;
      newMaxStreak = 1;
      streakMaintained = true;
    } else {
      // Calculate days between quizzes
      const lastQuizDay = new Date(lastQuizDate.setHours(0, 0, 0, 0));
      const currentDay = new Date(currentDate.setHours(0, 0, 0, 0));
      
      const timeDiff = currentDay - lastQuizDay;
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // If completed on the same day, don't update streak
      if (daysDiff === 0) {
        return { userData, streakUpdated: false };
      }
      // If completed the next day, increment streak
      else if (daysDiff === 1) {
        newStreak = currentStreak + 1;
        streakMaintained = true;
      }
      // If completed after missing a day, reset streak to 1
      else {
        newStreak = 1;
        streakMaintained = false;
      }
      
      // Update max streak if current streak is higher
      if (newStreak > maxStreak) {
        newMaxStreak = newStreak;
      }
    }
    
    // Update both streak formats to ensure consistency
    const timestamp = serverTimestamp();
    await updateDoc(userRef, {
      // Update top-level fields
      currentStreak: newStreak,
      maxStreak: newMaxStreak,
      last_quiz_date: timestamp,
      total_quizzes: increment(1),
      
      // Also update nested streak object
      streak: {
        count: newStreak,
        lastQuizDate: timestamp
      }
    });
    
    return {
      streakMaintained,
      currentStreak: newStreak,
      maxStreak: newMaxStreak
    };
    
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
};

// Function to get user streak data
export const getUserStreakData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data();
    
    // Handle both data formats
    const currentStreak = userData.currentStreak || userData.streak?.count || 0;
    const lastQuizDate = userData.last_quiz_date || userData.streak?.lastQuizDate || null;
    
    return {
      currentStreak: currentStreak,
      maxStreak: userData.maxStreak || 0,
      lastQuizDate: lastQuizDate
    };
    
  } catch (error) {
    console.error("Error fetching streak data:", error);
    throw error;
  }
};

// Function to reset streak if user misses a day
export const checkAndUpdateStreak = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { streakReset: false };
    }
    
    const userData = userDoc.data();
    
    // Get last quiz date from either location
    const lastQuizDate = userData.last_quiz_date ? 
      new Date(userData.last_quiz_date.seconds * 1000) : 
      (userData.streak?.lastQuizDate ? 
        new Date(userData.streak.lastQuizDate.seconds * 1000) : null);
    
    if (!lastQuizDate) return { streakReset: false };
    
    const currentDate = new Date();
    const maxistreak = userData.maxStreak;
    const lastQuizDay = new Date(lastQuizDate);
    lastQuizDay.setHours(0, 0, 0, 0);
    
    const currentDay = new Date(currentDate);
    currentDay.setHours(0, 0, 0, 0);
    const isSameDay = lastQuizDay.getTime() === currentDay.getTime();
    
    const timeDiff = currentDay - lastQuizDay;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Get current streak from either location
    const currentStreak = userData.currentStreak || userData.streak?.count || 0;
    
    // If more than one day has passed, reset streak
    if (daysDiff > 1) {
        // Missed a day → Reset streak
        const updatedMax = Math.max(maxistreak, currentStreak);
        await updateDoc(userRef, {
            currentStreak: 0,
            'streak.count': 0,
            maxStreak: updatedMax
        });
        return { streakReset: true, currentStreak: 0 };
    } else if (daysDiff === 1) {
        // Continued streak → Increment
        const newStreak = currentStreak + 1;
        const updatedMax = Math.max(maxiStreak, newStreak);
        await updateDoc(userRef, {
            currentStreak: newStreak,
            'streak.count': newStreak,
            maxStreak: updatedMax
        });
        return { streakReset: false, currentStreak: newStreak };
    } else {
        // Same day → Already updated today, do nothing
        return { streakReset: false, currentStreak };
    }
    return { streakReset: false, currentStreak };
    
  } catch (error) {
    console.error("Error checking streak:", error);
    return { streakReset: false };
  }
};