"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
}

export const Tabs = ({
  tabs,
  defaultTabId,
  className,
  tabListClassName,
  tabClassName,
  activeTabClassName,
  contentClassName,
}: TabsProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs.length > 0 ? tabs[0].id : "")
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div
          className={cn(
            "flex overflow-x-auto hide-scrollbar border-b border-border",
            tabListClassName
          )}
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap outline-none",
                  isActive ? "text-primary" : "text-text-muted hover:text-text",
                  tabClassName,
                  isActive && activeTabClassName
                )}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn("pt-6", contentClassName)}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTabId !== tab.id}
            className={cn("outline-none", activeTabId !== tab.id && "hidden")}
            tabIndex={0}
          >
            {activeTabId === tab.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {tab.content}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
