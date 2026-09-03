import Image from 'next/image';

import type { BlogContentBlock } from '@/lib/blog-content-blocks';
import { resolvePublicImageSrc } from '@/lib/media';

interface BlogContentRendererProps {
  blocks: BlogContentBlock[];
}

export function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  let paragraphIndex = 0;

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={`heading-${index}`}
                className="mt-10 mb-4 text-3xl font-bold text-primary first:mt-0"
              >
                {block.text}
              </h2>
            );
          case 'subheading':
            return (
              <h3
                key={`subheading-${index}`}
                className="mt-8 mb-3 text-2xl font-semibold text-gray-900"
              >
                {block.text}
              </h3>
            );
          case 'paragraph': {
            const isFirstParagraph = paragraphIndex === 0;
            paragraphIndex += 1;

            return (
              <p
                key={`paragraph-${index}`}
                className={
                  isFirstParagraph
                    ? 'first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none pt-2 mb-6 whitespace-pre-line'
                    : 'mb-6 whitespace-pre-line'
                }
              >
                {block.text}
              </p>
            );
          }
          case 'image':
            return (
              <figure key={`image-${index}`} className="my-8">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={resolvePublicImageSrc(block.image)}
                    alt={block.alt || 'Blog image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="mt-3 text-center text-sm text-gray-500">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
