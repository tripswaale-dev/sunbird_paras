<?php

namespace App\Http\Requests\Admin;

use App\Models\HomepageHero;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHomepageHeroRequest extends FormRequest
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
            'background_video' => [$required, 'string', 'max:500'],
            'chips' => [$required, 'array', 'min:1'],
            'chips.*.icon' => ['required', 'string', Rule::in(HomepageHero::ALLOWED_CHIP_ICONS)],
            'chips.*.label' => ['required', 'string', 'max:255'],
            'featured_chip' => [$present, 'nullable', 'array'],
            'featured_chip.icon' => ['required_with:featured_chip', 'string', Rule::in(HomepageHero::ALLOWED_CHIP_ICONS)],
            'featured_chip.label' => ['required_with:featured_chip', 'string', 'max:255'],
            'is_active' => [$required, 'boolean'],
        ];
    }
}
