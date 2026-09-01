<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $section = $this->route('section');
        $sectionId = $section instanceof \App\Models\Section ? $section->id : (int) $section;
        $categoryId = (int) $this->route('category');
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return [
            'title' => [
                $required,
                'string',
                'max:255',
                Rule::unique('section_categories', 'title')
                    ->where('section_id', $sectionId)
                    ->ignore($categoryId),
            ],
            'filter_value' => [
                $required,
                'nullable',
                'string',
                'max:100',
                Rule::unique('section_categories', 'filter_value')
                    ->where('section_id', $sectionId)
                    ->whereNotNull('filter_value')
                    ->ignore($categoryId),
            ],
            'image' => ['nullable', 'string', 'max:500'],
            'sort_order' => [$required, 'integer', 'min:0', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
