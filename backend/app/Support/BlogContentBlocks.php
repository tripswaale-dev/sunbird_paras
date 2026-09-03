<?php

namespace App\Support;

class BlogContentBlocks
{
    public const TYPES = ['heading', 'subheading', 'paragraph', 'image'];

    /**
     * @param  array<int, array<string, mixed>>  $blocks
     */
    public static function toPlainContent(array $blocks): string
    {
        $parts = [];

        foreach ($blocks as $block) {
            $type = $block['type'] ?? null;

            if (! in_array($type, ['heading', 'subheading', 'paragraph'], true)) {
                continue;
            }

            $text = trim((string) ($block['text'] ?? ''));

            if ($text !== '') {
                $parts[] = $text;
            }
        }

        return implode("\n\n", $parts);
    }

    /**
     * @return array<int, array<string, string>>
     */
    public static function fromLegacyContent(string $content): array
    {
        $trimmed = trim($content);

        if ($trimmed === '') {
            return [];
        }

        $paragraphs = preg_split('/\R\s*\R/', $trimmed) ?: [];

        if (count($paragraphs) === 1) {
            $paragraphs = preg_split('/\R/', $trimmed) ?: [];
        }

        $blocks = [];

        foreach ($paragraphs as $paragraph) {
            $text = trim($paragraph);

            if ($text === '') {
                continue;
            }

            $blocks[] = [
                'type' => 'paragraph',
                'text' => $text,
            ];
        }

        return $blocks;
    }
}
