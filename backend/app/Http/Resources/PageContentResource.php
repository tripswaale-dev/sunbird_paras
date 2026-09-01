<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'pageKey' => $this->page_key,
            'heroImage' => $this->hero_image,
            'heroTitle' => $this->hero_title,
            'heroSubtitle' => $this->hero_subtitle,
            'introText' => $this->intro_text,
            'body' => $this->body,
            'contactPhone' => $this->contact_phone,
            'contactEmail' => $this->contact_email,
            'contactAddress' => $this->contact_address,
            'workingHours' => $this->working_hours,
        ];
    }
}
