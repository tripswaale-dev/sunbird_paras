<?php

namespace App\Http\Requests\Admin;

use App\Models\GalleryItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGalleryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'external_id' => ['required', 'string', 'max:100', 'unique:gallery_items,external_id', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'src' => ['required', 'string', 'max:500'],
            'category' => ['required', 'string', Rule::in(GalleryItem::CATEGORY_CODES)],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'aspect_ratio' => ['required', 'string', Rule::in(GalleryItem::ASPECT_RATIOS)],
            'sort_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
