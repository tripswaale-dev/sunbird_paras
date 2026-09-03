<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class BlogDetailResource extends BlogSummaryResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'content' => $this->content,
            'contentBlocks' => $this->content_blocks ?? [],
            'seo' => [
                'meta_title' => $this->meta_title,
                'meta_description' => $this->meta_description,
                'canonical_url' => $this->canonical_url,
                'og_image' => $this->og_image,
                'is_indexable' => $this->is_indexable,
            ],
        ]);
    }
}
