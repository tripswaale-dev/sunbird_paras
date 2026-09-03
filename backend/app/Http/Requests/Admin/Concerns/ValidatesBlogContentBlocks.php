<?php

namespace App\Http\Requests\Admin\Concerns;

use App\Support\BlogContentBlocks;
use Illuminate\Validation\Validator;

trait ValidatesBlogContentBlocks
{
    /**
     * @return array<string, mixed>
     */
    protected function blogContentBlockRules(string $required = 'required'): array
    {
        return [
            'content_blocks' => [$required, 'array', 'min:1'],
            'content_blocks.*.type' => ['required', 'string', 'in:'.implode(',', BlogContentBlocks::TYPES)],
            'content_blocks.*.text' => ['nullable', 'string'],
            'content_blocks.*.image' => ['nullable', 'string', 'max:500'],
            'content_blocks.*.alt' => ['nullable', 'string', 'max:255'],
            'content_blocks.*.caption' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string'],
        ];
    }

    protected function validateBlogContentBlocks(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $blocks = $this->input('content_blocks');

            if (! is_array($blocks)) {
                return;
            }

            foreach ($blocks as $index => $block) {
                if (! is_array($block)) {
                    $validator->errors()->add("content_blocks.$index", 'Each content block must be an object.');

                    continue;
                }

                $type = $block['type'] ?? null;

                if (in_array($type, ['heading', 'subheading', 'paragraph'], true)) {
                    $text = trim((string) ($block['text'] ?? ''));

                    if ($text === '') {
                        $validator->errors()->add(
                            "content_blocks.$index.text",
                            'Text is required for '.$type.' blocks.'
                        );
                    }
                }

                if ($type === 'image' && trim((string) ($block['image'] ?? '')) === '') {
                    $validator->errors()->add(
                        "content_blocks.$index.image",
                        'Image is required for image blocks.'
                    );
                }
            }
        });
    }
}
