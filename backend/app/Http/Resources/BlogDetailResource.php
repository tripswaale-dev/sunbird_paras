<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class BlogDetailResource extends BlogSummaryResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'content' => $this->content,
        ]);
    }
}
