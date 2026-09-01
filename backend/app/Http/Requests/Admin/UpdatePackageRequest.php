<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePackageRequest extends FormRequest
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
            'slug' => [$required, 'string', 'max:255', Rule::unique('packages', 'slug')->ignore($id), 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'title' => [$required, 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'location' => ['nullable', 'string', 'max:255'],
            'price' => [$required, 'integer', 'min:0'],
            'duration_nights' => [$required, 'integer', 'min:0', 'max:65535'],
            'duration_days' => [$required, 'integer', 'min:0', 'max:65535'],
            'category' => ['nullable', 'string', 'max:100'],
            'tag' => ['nullable', 'string', 'max:100'],
            'image' => [$required, 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
