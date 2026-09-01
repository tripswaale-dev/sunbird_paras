<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDestinationCategoryRequest extends FormRequest
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
            'title' => [$required, 'string', 'max:255'],
            'hero_image' => [$required, 'string', 'max:500'],
            'hero_title' => [$required, 'string', 'max:255'],
            'hero_subtitle' => [$present, 'nullable', 'string', 'max:500'],
            'listing_path' => [$required, 'string', 'max:255'],
            'sort_order' => [$required, 'integer', 'min:0'],
            'is_active' => [$required, 'boolean'],
        ];
    }
}
