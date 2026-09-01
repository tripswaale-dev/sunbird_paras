<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlogRequest extends FormRequest
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
            'slug' => [$required, 'string', 'max:255', Rule::unique('blogs', 'slug')->ignore($id), 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'title' => [$required, 'string', 'max:255'],
            'excerpt' => [$required, 'string'],
            'content' => [$required, 'string'],
            'author' => [$required, 'string', 'max:255'],
            'category' => [$required, 'string', 'max:100'],
            'image' => [$required, 'string', 'max:500'],
            'published_at' => [$required, 'date'],
            'read_time_label' => [$required, 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
