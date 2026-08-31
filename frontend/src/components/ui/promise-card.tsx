"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PromiseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export function PromiseCard({ title, description, icon: Icon, isActive }: PromiseCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{ duration: 0.3 }}
      className={`group bg-surface-alt rounded-[16px] p-6 md:p-8 text-center shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col items-center justify-center ${
        isActive ? "border-2 border-primary shadow-xl scale-[1.02]" : "border-2 border-transparent"
      }`}
    >
      <div className="mb-4">
        <Icon className="w-10 h-10 text-primary transition-all duration-300 group-hover:scale-110" />
      </div>
      <h3 className="font-heading text-xl md:text-2xl font-semibold text-primary mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed max-w-[240px] mx-auto">
        {description}
      </p>
    </motion.div>
  );
}
