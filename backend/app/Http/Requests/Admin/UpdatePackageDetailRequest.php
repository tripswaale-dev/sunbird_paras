<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePackageDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return array_merge([
            'overview' => [$required, 'nullable', 'string'],
        ], $this->arrayFieldRules($required));
    }

    protected function arrayFieldRules(string $required): array
    {
        $rules = [];

        foreach (['destinations', 'sightseeing', 'inclusions', 'exclusions', 'highlights'] as $field) {
            $rules[$field] = [$required, 'nullable', 'array'];
            $rules["{$field}.*"] = ['string', 'max:500'];
        }

        return $rules;
    }
}
