import { cn } from "@/lib/utils";
import { CheckCircle2, MinusCircle } from "lucide-react";
import React from "react";

interface BulletListProps {
  items: React.ReactNode[];
  type?: "check" | "cross" | "bullet" | "minus";
  className?: string;
  itemClassName?: string;
}

export const BulletList = ({ items, type = "bullet", className, itemClassName }: BulletListProps) => {
  const renderIcon = () => {
    switch (type) {
      case "check":
        return <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />;
      case "minus":
        return <MinusCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />;
      case "bullet":
      default:
        return <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />;
    }
  };

  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <li key={index} className={cn("flex items-start gap-3 text-text-muted", itemClassName)}>
          {renderIcon()}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};
