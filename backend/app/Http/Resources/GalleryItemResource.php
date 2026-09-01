<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GalleryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->external_id,
            'src' => $this->src,
            'category' => $this->category,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'aspectRatio' => $this->aspect_ratio,
        ];
    }
}
