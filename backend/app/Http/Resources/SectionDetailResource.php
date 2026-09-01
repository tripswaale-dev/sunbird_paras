<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'view_all_path' => $this->view_all_path,
            'hero_image' => $this->hero_image,
            'seo' => [
                'meta_title' => $this->meta_title,
                'meta_description' => $this->meta_description,
                'canonical_url' => $this->canonical_url,
                'og_image' => $this->og_image,
                'is_indexable' => $this->is_indexable,
            ],
            'categories' => SectionCategoryResource::collection(
                $this->whenLoaded('categories')
            ),
            'stats' => SectionStatResource::collection(
                $this->whenLoaded('stats')
            ),
            'packages' => PackageSummaryResource::collection(
                $this->whenLoaded('activePackages')
            ),
        ];
    }
}
