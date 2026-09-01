<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DestinationCategorySummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'title' => $this->title,
            'heroImage' => $this->hero_image,
            'heroTitle' => $this->hero_title,
            'heroSubtitle' => $this->hero_subtitle,
            'listingPath' => $this->listing_path,
        ];
    }
}
