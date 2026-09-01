<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePackageDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge([
            'overview' => ['nullable', 'string'],
        ], $this->arrayFieldRules());
    }

    protected function arrayFieldRules(): array
    {
        $rules = [];

        foreach (['destinations', 'sightseeing', 'inclusions', 'exclusions', 'highlights'] as $field) {
            $rules[$field] = ['nullable', 'array'];
            $rules["{$field}.*"] = ['string', 'max:500'];
        }

        return $rules;
    }
}
