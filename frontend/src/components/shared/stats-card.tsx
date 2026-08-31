'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface StatItem {
  value: string;
  label: string;
}

interface StatsCardProps {
  stats: StatItem[];
}

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numMatch = value.match(/\d+/);
  const number = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = value.replace(/\d+/g, '');

  useEffect(() => {
    if (isInView && ref.current && number > 0) {
      const node = ref.current;
      const controls = animate(0, number, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1], // Very smooth ease-out (easeOutExpo-like)
        onUpdate(latest) {
          node.textContent = Math.round(latest).toString() + suffix;
        }
      });
      return () => controls.stop();
    } else if (ref.current && number === 0) {
      ref.current.textContent = value;
    }
  }, [isInView, number, suffix, value]);

  return <span ref={ref}>{number > 0 ? `0${suffix}` : value}</span>;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="mt-14 bg-surface-muted rounded-[24px] py-10 px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center flex flex-col items-center justify-center">
            <span className="text-primary text-4xl lg:text-5xl font-semibold">
              <AnimatedStat value={stat.value} />
            </span>
            <span className="text-primary text-sm lg:text-base font-medium leading-relaxed mt-2 text-balance max-w-[140px]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
