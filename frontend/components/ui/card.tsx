import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-white/10 backdrop-blur-lg shadow-md p-6 rounded-2xl border border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
};
