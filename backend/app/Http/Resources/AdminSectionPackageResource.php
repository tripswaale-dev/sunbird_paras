<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminSectionPackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'image' => $this->image,
            'category' => $this->category,
            'price' => $this->price,
            'is_active' => $this->is_active,
            'display_order' => $this->pivot->display_order,
            'is_featured' => (bool) $this->pivot->is_featured,
        ];
    }
}
