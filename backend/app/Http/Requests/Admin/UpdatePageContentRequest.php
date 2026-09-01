<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageContentRequest extends FormRequest
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
            'hero_image' => [$required, 'string', 'max:500'],
            'hero_title' => [$required, 'string', 'max:255'],
            'hero_subtitle' => [$present, 'nullable', 'string', 'max:500'],
            'intro_text' => [$present, 'nullable', 'string'],
            'body' => [$present, 'nullable', 'string'],
            'contact_phone' => [$present, 'nullable', 'string', 'max:50'],
            'contact_email' => [$present, 'nullable', 'email', 'max:255'],
            'contact_address' => [$present, 'nullable', 'string'],
            'working_hours' => [$present, 'nullable', 'string'],
            'is_active' => [$required, 'boolean'],
        ];
    }
}
