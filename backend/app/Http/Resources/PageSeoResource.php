<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageSeoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'page_key' => $this->page_key,
            'seo' => [
                'meta_title' => $this->meta_title,
                'meta_description' => $this->meta_description,
                'canonical_url' => $this->canonical_url,
                'og_image' => $this->og_image,
                'is_indexable' => $this->is_indexable,
            ],
        ];
    }
}
