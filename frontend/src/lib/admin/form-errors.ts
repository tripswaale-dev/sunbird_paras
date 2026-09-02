import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { ApiError } from '@/lib/api/client';

export function applyApiErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: ApiError
): void {
  if (!error.errors) {
    return;
  }

  for (const [field, messages] of Object.entries(error.errors)) {
    if (messages[0]) {
      setError(field as Path<T>, { message: messages[0] });
    }
  }
}
