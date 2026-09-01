<?php

namespace App\Http\Resources;

use App\Support\PackageFormatter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'location' => $this->location,
            'price' => $this->price,
            'duration' => [
                'nights' => $this->duration_nights,
                'days' => $this->duration_days,
                'formatted' => PackageFormatter::durationFormatted(
                    $this->duration_nights,
                    $this->duration_days
                ),
            ],
            'category' => $this->category,
            'tag' => $this->tag,
            'image' => $this->image,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
