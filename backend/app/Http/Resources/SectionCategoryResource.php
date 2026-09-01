<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'filter_value' => $this->filter_value,
            'image' => $this->image,
            'is_featured' => $this->is_featured,
            'sort_order' => $this->sort_order,
        ];
    }
}
