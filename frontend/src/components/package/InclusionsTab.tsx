import React from "react";
import { BulletList } from "@/components/ui/bullet-list";

interface InclusionsTabProps {
  inclusions: string[];
}

export const InclusionsTab = ({ inclusions }: InclusionsTabProps) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-card">
      <h3 className="font-heading text-2xl mb-6 text-primary-900">What&apos;s Included</h3>
      <BulletList items={inclusions} type="check" />
    </div>
  );
};
