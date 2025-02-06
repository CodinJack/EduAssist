import { Card } from "@/components/ui/card";
import { Users, Clock } from "lucide-react";

const classes = [
  {
    subject: "Mathematics",
    time: "11:00 AM - 12:30 PM",
    grade: "Grade 11A",
    students: 28,
  },
  {
    subject: "Physics",
    time: "2:00 PM - 3:30 PM",
    grade: "Grade 12B",
    students: 24,
  },
];

export const UpcomingClasses = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
      <div className="space-y-4">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{cls.subject}</h3>
                <p className="text-sm text-gray-600">{cls.grade}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                {cls.students}
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {cls.time}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
