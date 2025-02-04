import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", className, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-all",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "secondary" && "bg-gray-600 text-white hover:bg-gray-700",
        variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
};
