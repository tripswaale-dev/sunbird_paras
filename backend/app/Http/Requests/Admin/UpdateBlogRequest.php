<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesBlogContentBlocks;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlogRequest extends FormRequest
{
    use ValidatesBlogContentBlocks;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = (int) $this->route('id');
        $isPut = $this->isMethod('PUT');
        $required = $isPut ? 'required' : 'sometimes';

        return array_merge([
            'slug' => [$required, 'string', 'max:255', Rule::unique('blogs', 'slug')->ignore($id), 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'title' => [$required, 'string', 'max:255'],
            'excerpt' => [$required, 'string'],
            'author' => [$required, 'string', 'max:255'],
            'category' => [$required, 'string', 'max:100'],
            'image' => [$required, 'string', 'max:500'],
            'published_at' => [$required, 'date'],
            'read_time_label' => [$required, 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'is_indexable' => ['sometimes', 'boolean'],
        ], $this->blogContentBlockRules($required));
    }

    public function withValidator($validator): void
    {
        $this->validateBlogContentBlocks($validator);
    }
}
