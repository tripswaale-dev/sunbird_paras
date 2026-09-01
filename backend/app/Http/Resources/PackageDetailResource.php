<?php

namespace App\Http\Resources;

use App\Support\PackageFormatter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $detail = $this->relationLoaded('detail') ? $this->detail : null;
        $images = $this->relationLoaded('images') ? $this->images : collect();

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
            'pax' => $this->pax,
            'is_active' => $this->is_active,
            'seo' => [
                'meta_title' => $this->meta_title,
                'meta_description' => $this->meta_description,
                'canonical_url' => $this->canonical_url,
                'og_image' => $this->og_image,
                'is_indexable' => $this->is_indexable,
            ],
            'detail' => $detail ? [
                'overview' => $detail->overview,
                'destinations' => $detail->destinations ?? [],
                'sightseeing' => $detail->sightseeing ?? [],
                'inclusions' => $detail->inclusions ?? [],
                'exclusions' => $detail->exclusions ?? [],
                'highlights' => $detail->highlights ?? [],
            ] : null,
            'itinerary' => $this->whenLoaded('itineraryDays', function () {
                return $this->itineraryDays->map(fn ($day) => [
                    'day' => $day->day,
                    'title' => $day->title,
                    'description' => $day->description,
                    'stay_information' => $day->stay_information,
                    'notes' => $day->notes,
                    'images' => $day->images ?? [],
                    'sort_order' => $day->sort_order,
                ])->values();
            }),
            'faqs' => $this->whenLoaded('faqs', function () {
                return $this->faqs->map(fn ($faq) => [
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                    'sort_order' => $faq->sort_order,
                ])->values();
            }),
            'images' => $this->whenLoaded('images', function () use ($images) {
                return [
                    'hero' => $images->where('type', 'hero')->map(fn ($image) => [
                        'path' => $image->path,
                        'alt_text' => $image->alt_text,
                        'sort_order' => $image->sort_order,
                    ])->values(),
                    'gallery' => $images->where('type', 'gallery')->map(fn ($image) => [
                        'path' => $image->path,
                        'alt_text' => $image->alt_text,
                        'sort_order' => $image->sort_order,
                    ])->values(),
                ];
            }),
        ];
    }
}
