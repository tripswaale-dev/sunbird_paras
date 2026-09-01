<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionStatResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'value' => $this->value,
            'label' => $this->label,
            'sort_order' => $this->sort_order,
        ];
    }
}
