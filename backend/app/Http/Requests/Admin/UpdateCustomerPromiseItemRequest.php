<?php

namespace App\Http\Requests\Admin;

use App\Models\CustomerPromiseItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerPromiseItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return [
            'title' => [$required, 'string', 'max:255'],
            'description' => [$required, 'string'],
            'icon' => [$required, 'string', Rule::in(CustomerPromiseItem::ALLOWED_ICONS)],
            'sort_order' => [$required, 'integer', 'min:0'],
            'is_active' => [$required, 'boolean'],
        ];
    }
}
