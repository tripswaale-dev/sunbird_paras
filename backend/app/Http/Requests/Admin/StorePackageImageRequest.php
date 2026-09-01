<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackageImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $packageId = (int) $this->route('id');

        return [
            'path' => [
                'required',
                'string',
                'max:500',
                Rule::unique('package_images', 'path')->where('package_id', $packageId),
            ],
            'type' => ['required', 'string', Rule::in(['hero', 'gallery'])],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
        ];
    }
}
