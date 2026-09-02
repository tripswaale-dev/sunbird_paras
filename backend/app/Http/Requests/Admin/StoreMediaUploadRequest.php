<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:5120',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please choose an image to upload.',
            'file.image' => 'The file must be an image.',
            'file.mimes' => 'Upload a JPEG, PNG, WebP, or GIF image.',
            'file.max' => 'Images must be 5 MB or smaller.',
        ];
    }
}
