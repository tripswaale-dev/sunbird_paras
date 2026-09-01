<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminDestinationCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'title' => $this->title,
            'section_slug' => $this->section_slug,
            'package_category' => $this->package_category,
            'hero_image' => $this->hero_image,
            'hero_title' => $this->hero_title,
            'hero_subtitle' => $this->hero_subtitle,
            'listing_path' => $this->listing_path,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
