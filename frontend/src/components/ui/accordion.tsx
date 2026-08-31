"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: React.ReactNode;
  content: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  titleClassName?: string;
}

export const AccordionItem = ({
  title,
  content,
  isOpen = false,
  onToggle,
  className,
  titleClassName,
}: AccordionItemProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const isControlled = onToggle !== undefined;
  const active = isControlled ? isOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled) {
      onToggle();
    } else {
      setInternalIsOpen(!active);
    }
  };

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-white mb-4", className)}>
      <button
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 md:p-6 text-left transition-colors hover:bg-surface-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          active && "bg-surface-alt",
          titleClassName
        )}
        aria-expanded={active}
      >
        {title}
        <motion.div
          animate={{ rotate: active ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 md:p-6 border-t border-border">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
  }[];
  allowMultiple?: boolean;
  className?: string;
  defaultOpenId?: string;
}

export const Accordion = ({
  items,
  allowMultiple = false,
  className,
  defaultOpenId,
}: AccordionProps) => {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : items.length > 0 && !allowMultiple ? [items[0].id] : []
  );

  const handleToggle = (id: string) => {
    setOpenIds((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          content={item.content}
          isOpen={openIds.includes(item.id)}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
};
