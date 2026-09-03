<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminBlogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'content_blocks' => $this->content_blocks ?? [],
            'author' => $this->author,
            'category' => $this->category,
            'image' => $this->image,
            'published_at' => $this->published_at,
            'read_time_label' => $this->read_time_label,
            'is_active' => $this->is_active,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'canonical_url' => $this->canonical_url,
            'og_image' => $this->og_image,
            'is_indexable' => $this->is_indexable,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
