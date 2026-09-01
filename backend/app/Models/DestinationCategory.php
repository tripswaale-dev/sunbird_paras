<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class DestinationCategory extends Model
{
    public const CODE_POPULAR = 'popular';

    public const CODE_HILLS = 'hills';

    public const CODE_BEACHES = 'beaches';

    public const CODE_SPIRITUAL = 'spiritual';

    public const CODE_WILDLIFE = 'wildlife';

    public const CODE_INTERNATIONAL = 'international';

    public const ALLOWED_CODES = [
        self::CODE_POPULAR,
        self::CODE_HILLS,
        self::CODE_BEACHES,
        self::CODE_SPIRITUAL,
        self::CODE_WILDLIFE,
        self::CODE_INTERNATIONAL,
    ];

    protected $fillable = [
        'code',
        'title',
        'section_slug',
        'package_category',
        'hero_image',
        'hero_title',
        'hero_subtitle',
        'listing_path',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (DestinationCategory $category) {
            if (empty($category->section_slug) && empty($category->package_category)) {
                throw new InvalidArgumentException(
                    'Either section_slug or package_category must be set.'
                );
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
