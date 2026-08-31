import { cn } from "@/lib/utils";

interface DayBadgeProps {
  day: number | string;
  className?: string;
}

export const DayBadge = ({ day, className }: DayBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-secondary text-white text-xs font-semibold px-4 py-1.5 whitespace-nowrap",
        className
      )}
    >
      Day {day}
    </div>
  );
};
