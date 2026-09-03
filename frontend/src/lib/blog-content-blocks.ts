export type BlogContentBlockType = 'heading' | 'subheading' | 'paragraph' | 'image';

export interface BlogContentHeadingBlock {
  type: 'heading';
  text: string;
}

export interface BlogContentSubheadingBlock {
  type: 'subheading';
  text: string;
}

export interface BlogContentParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface BlogContentImageBlock {
  type: 'image';
  image: string;
  alt?: string;
  caption?: string;
}

export type BlogContentBlock =
  | BlogContentHeadingBlock
  | BlogContentSubheadingBlock
  | BlogContentParagraphBlock
  | BlogContentImageBlock;

export function createEmptyBlogContentBlock(type: BlogContentBlockType): BlogContentBlock {
  switch (type) {
    case 'heading':
    case 'subheading':
    case 'paragraph':
      return { type, text: '' };
    case 'image':
      return { type, image: '', alt: '', caption: '' };
  }
}

export function contentBlocksFromLegacyContent(content: string): BlogContentBlock[] {
  const trimmed = content.trim();

  if (!trimmed) {
    return [];
  }

  let paragraphs = trimmed.split(/\n\s*\n/);

  if (paragraphs.length === 1) {
    paragraphs = trimmed.split('\n');
  }

  return paragraphs
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'paragraph' as const, text }));
}

export function contentBlocksLabel(type: BlogContentBlockType): string {
  switch (type) {
    case 'heading':
      return 'Heading';
    case 'subheading':
      return 'Subheading';
    case 'paragraph':
      return 'Paragraph';
    case 'image':
      return 'Image';
  }
}
