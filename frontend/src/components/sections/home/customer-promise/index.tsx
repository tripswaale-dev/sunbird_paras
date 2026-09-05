'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Section } from '@/components/common/Section';
import { PromiseCard } from '@/components/ui/promise-card';
import { resolvePromiseIcon } from '@/lib/mappers/homepage-icons';
import { EmptyState } from '@/components/common/EmptyState';
import { PromiseGridSkeleton } from '@/components/ui/skeleton';
import { useApiData } from '@/hooks/use-api-data';
import { getHomepage } from '@/lib/api/homepage';
import type { CustomerPromiseItemData } from '@/lib/api/types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export function CustomerPromise() {
  const fetcher = useCallback(async () => {
    const homepage = await getHomepage();
    return homepage.customerPromises;
  }, []);

  const { data: promises, isLoading } = useApiData<CustomerPromiseItemData[]>(fetcher, []);

  return (
    <Section bg="bg-surface-alt" animate={false}>
      {isLoading ? (
        <PromiseGridSkeleton />
      ) : promises.length > 0 ? (
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
      ) : (
        <EmptyState compact message="No promises yet" />
      )}
    </Section>
  );
}
