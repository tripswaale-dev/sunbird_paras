<?php

namespace App\Http\Requests\Admin;

use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSectionCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $section = $this->route('section');
        $sectionId = $section instanceof Section ? $section->id : (int) $section;

        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('section_categories', 'title')->where('section_id', $sectionId),
            ],
            'filter_value' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('section_categories', 'filter_value')
                    ->where('section_id', $sectionId)
                    ->whereNotNull('filter_value'),
            ],
            'image' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
