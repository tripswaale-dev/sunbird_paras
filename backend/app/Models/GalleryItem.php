<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    public const CATEGORY_CODES = [
        'RAJASTHAN',
        'UTTARAKHAND',
        'HIMACHAL',
        'KASHMIR',
        'KERALA',
        'GOA',
        'LADAKH',
        'ANDAMAN',
        'INTERNATIONAL',
    ];

    public const ASPECT_RATIOS = [
        'square',
        'portrait',
        'landscape',
    ];

    protected $fillable = [
        'external_id',
        'src',
        'category',
        'title',
        'subtitle',
        'aspect_ratio',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'external_id';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @return list<string>
     */
    public static function categoryCodes(): array
    {
        return self::CATEGORY_CODES;
    }
}
