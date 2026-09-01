<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackageFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $packageId = (int) $this->route('id');

        return [
            'question' => [
                'required',
                'string',
                'max:500',
                Rule::unique('package_faqs', 'question')->where('package_id', $packageId),
            ],
            'answer' => ['required', 'string'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
        ];
    }
}
