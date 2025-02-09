import { Card } from "@/components/ui/card";
import { Circle } from "lucide-react";

const activities = [
  {
    time: "10:30 AM",
    title: "Assignment Submitted",
    description: "John Doe submitted Mathematics Assignment #3",
  },
  {
    time: "09:15 AM",
    title: "Class Completed",
    description: "Physics Class - Grade 11A completed",
  },
  {
    time: "08:00 AM",
    title: "New Question",
    description: "Sarah posted a question in Chemistry forum",
  },
];

export const ActivityTimeline = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Circle className="w-2 h-2 fill-primary-500 text-primary-500" />
              {index !== activities.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 mt-2" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">{activity.time}</p>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
