<?php

namespace App\Http\Requests\Admin;

use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSectionStatRequest extends FormRequest
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
            'value' => [
                'required',
                'string',
                'max:50',
                Rule::unique('section_stats', 'value')->where('section_id', $sectionId),
            ],
            'label' => [
                'required',
                'string',
                'max:255',
                Rule::unique('section_stats', 'label')->where('section_id', $sectionId),
            ],
            'sort_order' => ['required', 'integer', 'min:0', 'max:255'],
        ];
    }
}
