<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionSeoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';
        $present = $isPut ? 'present' : 'sometimes';

        return [
            'meta_title' => [$present, 'nullable', 'string', 'max:255'],
            'meta_description' => [$present, 'nullable', 'string'],
            'canonical_url' => [$present, 'nullable', 'string', 'max:500'],
            'og_image' => [$present, 'nullable', 'string', 'max:500'],
            'is_indexable' => [$required, 'boolean'],
        ];
    }
}
