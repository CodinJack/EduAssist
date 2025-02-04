import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, MessageCircle, Check } from "lucide-react";
const actions = [
  {
    icon: Plus,
    label: "Create Assignment",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageCircle,
    label: "Send Message",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Check,
    label: "Grade Tasks",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: FileText,
    label: "View Reports",
    color: "bg-orange-50 text-orange-600",
  },
];
export const QuickActions = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-gray-50"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
