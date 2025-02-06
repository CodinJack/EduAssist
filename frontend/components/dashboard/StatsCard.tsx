import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import clsx from "clsx"; //for cleaner class merging

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={clsx("p-6 hover:shadow-lg transition-shadow duration-300", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 text-blue-700">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-full">
          {Icon && <Icon className="w-6 h-6 text-primary-500" />}
        </div>
      </div>
    </Card>
  );
}
