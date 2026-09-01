<?php

namespace App\Http\Requests\Admin;

use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSectionPackageRequest extends FormRequest
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
            'package_id' => [
                'required',
                'integer',
                Rule::exists('packages', 'id'),
                Rule::unique('section_packages', 'package_id')->where('section_id', $sectionId),
            ],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}
