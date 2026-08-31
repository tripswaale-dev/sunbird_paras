import React from "react";
import { BulletList } from "@/components/ui/bullet-list";

interface ExclusionsTabProps {
  exclusions: string[];
}

export const ExclusionsTab = ({ exclusions }: ExclusionsTabProps) => {
  return (
    <div className="bg-surface-alt p-6 md:p-8 rounded-2xl border border-border">
      <h3 className="font-heading text-2xl mb-6 text-secondary-dark">What&apos;s Excluded</h3>
      <BulletList items={exclusions} type="minus" />
    </div>
  );
};
