'use client';

import { useState } from 'react';
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from 'react-hook-form';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { BlogFormValues } from '@/lib/admin/blog-form-schema';
import {
  contentBlocksLabel,
  createEmptyBlogContentBlock,
  type BlogContentBlockType,
} from '@/lib/blog-content-blocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BLOCK_TYPES: BlogContentBlockType[] = ['heading', 'subheading', 'paragraph', 'image'];

interface BlogContentBlocksFieldProps {
  control: Control<BlogFormValues>;
  register: UseFormRegister<BlogFormValues>;
  setValue: UseFormSetValue<BlogFormValues>;
  watch: UseFormWatch<BlogFormValues>;
  errors: FieldErrors<BlogFormValues>;
}

function getBlockErrorMessage(
  errors: FieldErrors<BlogFormValues>,
  index: number,
  field: 'text' | 'image'
): string | undefined {
  const blockErrors = errors.content_blocks?.[index] as
    | { text?: { message?: string }; image?: { message?: string } }
    | undefined;

  const fieldError = blockErrors?.[field];

  return typeof fieldError?.message === 'string' ? fieldError.message : undefined;
}

export function BlogContentBlocksField({
  control,
  register,
  setValue,
  watch,
  errors,
}: BlogContentBlocksFieldProps) {
  const [selectedType, setSelectedType] = useState<BlogContentBlockType>('paragraph');
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'content_blocks',
  });

  const blocks = watch('content_blocks');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Article body</h3>
        <p className="mt-1 text-sm text-gray-600">
          Build your article section by section with headings, text, and inline images.
        </p>
        {typeof errors.content_blocks?.message === 'string' ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errors.content_blocks.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const block = blocks?.[index];
          const blockType = block?.type ?? 'paragraph';

          return (
            <div
              key={field.id}
              className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {contentBlocksLabel(blockType)}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                  >
                    Move up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => move(index, index + 1)}
                    disabled={index === fields.length - 1}
                  >
                    Move down
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {blockType === 'heading' || blockType === 'subheading' ? (
                <Input
                  label={blockType === 'heading' ? 'Heading' : 'Subheading'}
                  error={getBlockErrorMessage(errors, index, 'text')}
                  {...register(`content_blocks.${index}.text` as Path<BlogFormValues>)}
                />
              ) : null}

              {blockType === 'paragraph' ? (
                <Textarea
                  label="Paragraph"
                  rows={5}
                  error={getBlockErrorMessage(errors, index, 'text')}
                  {...register(`content_blocks.${index}.text` as Path<BlogFormValues>)}
                />
              ) : null}

              {blockType === 'image' ? (
                <div className="space-y-4">
                  <ImageUploadField
                    label="Image"
                    value={block?.type === 'image' ? block.image : ''}
                    onChange={(path) =>
                      setValue(`content_blocks.${index}.image`, path, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    error={getBlockErrorMessage(errors, index, 'image')}
                    previewAlt={
                      block?.type === 'image' ? block.alt || 'Blog content image' : 'Blog content image'
                    }
                    fieldId={`blog-content-image-${index}`}
                  />
                  <Input
                    label="Alt text"
                    {...register(`content_blocks.${index}.alt` as Path<BlogFormValues>)}
                  />
                  <Input
                    label="Caption (optional)"
                    {...register(`content_blocks.${index}.caption` as Path<BlogFormValues>)}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px]">
          <label htmlFor="blog-block-type" className="block text-sm font-medium text-gray-900">
            Add block
          </label>
          <select
            id="blog-block-type"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as BlogContentBlockType)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {BLOCK_TYPES.map((type) => (
              <option key={type} value={type}>
                {contentBlocksLabel(type)}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => append(createEmptyBlogContentBlock(selectedType))}
        >
          Add block
        </Button>
      </div>
    </div>
  );
}
