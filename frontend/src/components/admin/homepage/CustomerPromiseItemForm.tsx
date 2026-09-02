'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  customerPromiseItemFormSchema,
  type CustomerPromiseItemFormValues,
} from '@/lib/admin/customer-promise-item-form-schema';
import {
  PROMISE_ICON_OPTIONS,
  toCustomerPromiseItemPayload,
  updateCustomerPromiseItem,
  type CustomerPromiseItemId,
  type PromiseItemIcon,
} from '@/lib/admin/customer-promise-items';
import { HomepageIconSelect } from '@/components/admin/homepage/HomepageIconSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { resolvePromiseIcon } from '@/lib/mappers/homepage-icons';

interface CustomerPromiseItemFormProps {
  itemId: CustomerPromiseItemId;
  defaultValues: CustomerPromiseItemFormValues;
}

export function CustomerPromiseItemForm({
  itemId,
  defaultValues,
}: CustomerPromiseItemFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CustomerPromiseItemFormValues>({
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = customerPromiseItemFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof CustomerPromiseItemFormValues, { message: issue.message });
        }
      }

      return;
    }

    try {
      await updateCustomerPromiseItem(itemId, toCustomerPromiseItemPayload(parsed.data));
      router.push('/admin/homepage?saved=promise');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save customer promise item. Please try again.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit customer promise</h1>
          <p className="mt-1 text-sm text-gray-600">Promise card #{itemId}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin/homepage/promises"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to promises
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            View homepage
          </Link>
        </div>
      </div>

      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <Input label="Title" error={errors.title?.message} {...register('title')} />
          <Textarea
            label="Description"
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <HomepageIconSelect
                label="Icon"
                value={field.value}
                onChange={(value) => field.onChange(value as PromiseItemIcon)}
                options={PROMISE_ICON_OPTIONS}
                resolveIcon={resolvePromiseIcon}
                error={errors.icon?.message}
              />
            )}
          />
          <Input
            label="Sort order"
            type="number"
            min={0}
            error={errors.sort_order?.message}
            {...register('sort_order', { valueAsNumber: true })}
          />
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('is_active')}
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Active</span>
              <span className="block text-sm text-gray-600">
                Inactive items are excluded from the public homepage API.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => router.push('/admin/homepage/promises')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
