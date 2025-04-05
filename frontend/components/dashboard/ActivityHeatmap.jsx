
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { fetchQuizActivity } from "@/services/activityService";

const ActivityHeatmap = ({ userId }) => {
  const [activityData, setActivityData] = useState({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getActivityData = async () => {
      try {
        if (userId) {
          setLoading(true);
          const data = await fetchQuizActivity(userId);
          setActivityData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading activity data:", err);
        setError("Failed to load quiz activity data");
      } finally {
        setLoading(false);
      }
    };

    getActivityData();
  }, [userId]);

  // Generate calendar data for current month/year
  const generateCalendarData = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek = firstDay.getDay();
    
    // Calculate days in month
    const daysInMonth = lastDay.getDate();
    
    const calendarDays = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = date.toISOString().split('T')[0];
      const activityCount = activityData[dateKey] || 0;
      
      calendarDays.push({
        day,
        date: dateKey,
        activityCount
      });
    }
    
    return calendarDays;
  };

  // Get color based on activity count
  const getActivityColor = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-blue-200';
    if (count === 2) return 'bg-blue-300';
    if (count === 3) return 'bg-blue-400';
    return 'bg-blue-600'; // 4 or more
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11; // December
      newYear--;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0; // January
      newYear++;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Format month and year for display
  const formatMonthYear = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${monthNames[currentMonth]} ${currentYear}`;
  };

  const calendarData = generateCalendarData();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="bg-white shadow-md overflow-hidden border-none hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-700">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar size={20} className="text-blue-500" />
          </div>
          <span>Quiz Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div>
            {/* Calendar navigation */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={goToPrevMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                &larr;
              </button>
              <h3 className="font-medium">{formatMonthYear()}</h3>
              <button 
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                &rarr;
              </button>
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day names header */}
              {dayNames.map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarData.map((day, index) => (
                <div 
                  key={index} 
                  className={`aspect-square ${day.day ? getActivityColor(day.activityCount) : ''} rounded-md flex items-center justify-center transition-colors duration-200`}
                >
                  {day.day && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span className={`text-xs ${day.activityCount > 2 ? 'text-white' : 'text-gray-800'}`}>
                        {day.day}
                      </span>
                      {day.activityCount > 0 && (
                        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white opacity-60"></span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 rounded-sm mr-1"></div>
                <span>0</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-200 rounded-sm mr-1"></div>
                <span>1</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded-sm mr-1"></div>
                <span>2</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-sm mr-1"></div>
                <span>3</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-sm mr-1"></div>
                <span>4+</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;