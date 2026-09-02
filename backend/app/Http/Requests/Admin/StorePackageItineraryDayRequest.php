<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackageItineraryDayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $packageId = (int) $this->route('id');

        return [
            'day' => [
                'required',
                'integer',
                'min:1',
                'max:65535',
                Rule::unique('package_itinerary_days', 'day')->where('package_id', $packageId),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'stay_information' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:500'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
        ];
    }

    public function messages(): array
    {
        return [
            'day.unique' => 'This day number already exists for this package.',
        ];
    }
}
