<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\ValidatesBlogContentBlocks;
use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    use ValidatesBlogContentBlocks;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge([
            'slug' => ['required', 'string', 'max:255', 'unique:blogs,slug', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string'],
            'author' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'image' => ['required', 'string', 'max:500'],
            'published_at' => ['required', 'date'],
            'read_time_label' => ['required', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'is_indexable' => ['sometimes', 'boolean'],
        ], $this->blogContentBlockRules());
    }

    public function withValidator($validator): void
    {
        $this->validateBlogContentBlocks($validator);
    }
}
