'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconOption<T extends string> {
  value: T;
  label: string;
}

interface HomepageIconSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: IconOption<T>[];
  resolveIcon: (key: string) => LucideIcon;
  error?: string;
  id?: string;
}

export function HomepageIconSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  resolveIcon,
  error,
  id,
}: HomepageIconSelectProps<T>) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const Icon = resolveIcon(value);

  return (
    <div className="w-full">
      <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className={cn(
            'w-full rounded-lg border border-border bg-surface px-4 py-3 text-text',
            'transition-all duration-200 ease-smooth',
            'focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
            error && 'border-secondary focus:border-secondary focus:ring-secondary/20'
          )}
          aria-invalid={error ? 'true' : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p id={`${selectId}-error`} className="mt-1.5 text-sm text-secondary">
          {error}
        </p>
      ) : null}
    </div>
  );
}
