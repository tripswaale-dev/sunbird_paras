<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePackageFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $packageId = (int) $this->route('id');
        $faqId = (int) $this->route('faq');
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return [
            'question' => [
                $required,
                'string',
                'max:500',
                Rule::unique('package_faqs', 'question')
                    ->where('package_id', $packageId)
                    ->ignore($faqId),
            ],
            'answer' => [$required, 'string'],
            'sort_order' => [$required, 'integer', 'min:0', 'max:65535'],
        ];
    }
}
