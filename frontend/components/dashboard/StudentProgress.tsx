import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const data = [
  { month: "Jan", performance: 65 },
  { month: "Feb", performance: 70 },
  { month: "Mar", performance: 73 },
  { month: "Apr", performance: 80 },
  { month: "May", performance: 85 },
  { month: "Jun", performance: 82 },
];
export const StudentProgress = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Class Performance Trend</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#4F46E5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
