<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionStatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $section = $this->route('section');
        $sectionId = $section instanceof \App\Models\Section ? $section->id : (int) $section;
        $statId = (int) $this->route('stat');
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return [
            'value' => [
                $required,
                'string',
                'max:50',
                Rule::unique('section_stats', 'value')
                    ->where('section_id', $sectionId)
                    ->ignore($statId),
            ],
            'label' => [
                $required,
                'string',
                'max:255',
                Rule::unique('section_stats', 'label')
                    ->where('section_id', $sectionId)
                    ->ignore($statId),
            ],
            'sort_order' => [$required, 'integer', 'min:0', 'max:255'],
        ];
    }
}
