<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPackageItineraryDayResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'package_id' => $this->package_id,
            'day' => $this->day,
            'title' => $this->title,
            'description' => $this->description,
            'stay_information' => $this->stay_information,
            'notes' => $this->notes,
            'images' => $this->images ?? [],
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
