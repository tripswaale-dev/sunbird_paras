<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'author' => $this->author,
            'date' => $this->published_at?->format('F j, Y'),
            'category' => $this->category,
            'image' => $this->image,
            'readTime' => $this->read_time_label,
        ];
    }
}
