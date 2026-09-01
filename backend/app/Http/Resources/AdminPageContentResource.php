<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPageContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'page_key' => $this->page_key,
            'hero_image' => $this->hero_image,
            'hero_title' => $this->hero_title,
            'hero_subtitle' => $this->hero_subtitle,
            'intro_text' => $this->intro_text,
            'body' => $this->body,
            'contact_phone' => $this->contact_phone,
            'contact_email' => $this->contact_email,
            'contact_address' => $this->contact_address,
            'working_hours' => $this->working_hours,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
