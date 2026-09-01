<?php

namespace App\Http\Resources;

use App\Support\PackageFormatter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageSummaryResource extends JsonResource
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
                'short' => PackageFormatter::durationShort(
                    $this->duration_nights,
                    $this->duration_days
                ),
            ],
            'category' => $this->category,
            'tag' => $this->tag,
            'image' => $this->image,
            'pax' => $this->pax,
            'display_order' => $this->when(
                $this->pivot !== null,
                fn () => $this->pivot->display_order
            ),
            'is_featured' => $this->when(
                $this->pivot !== null,
                fn () => (bool) $this->pivot->is_featured
            ),
            'inclusions' => $this->whenLoaded('detail', fn () => $this->detail?->inclusions ?? []),
        ];
    }
}
