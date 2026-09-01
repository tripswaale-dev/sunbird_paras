<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageHeroResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'backgroundVideo' => $this->background_video,
            'chips' => $this->chips,
            'featuredChip' => $this->featured_chip,
        ];
    }
}
