'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { PromiseCard } from '@/components/ui/promise-card';
import { resolvePromiseIcon } from '@/lib/mappers/homepage-icons';
import type { CustomerPromiseItemData } from '@/lib/api/types';

// ===========================================
// Customer Promise Section
// ===========================================

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

interface CustomerPromiseProps {
  promises: CustomerPromiseItemData[];
}

export function CustomerPromise({ promises }: CustomerPromiseProps) {
  return (
    <Section bg="bg-surface-alt" animate={false}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {promises.map((promise) => (
          <motion.div key={promise.id} variants={itemVariants} className="h-full">
            <PromiseCard
              title={promise.title}
              description={promise.description}
              icon={resolvePromiseIcon(promise.icon)}
            />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
