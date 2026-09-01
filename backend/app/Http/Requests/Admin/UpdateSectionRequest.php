<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = (int) $this->route('id');
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return [
            'slug' => [$required, 'string', 'max:100', Rule::unique('sections', 'slug')->ignore($id)],
            'title' => [$required, 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'view_all_path' => [$required, 'string', 'max:255'],
            'hero_image' => ['nullable', 'string', 'max:500'],
            'sort_order' => [$required, 'integer', 'min:0', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
