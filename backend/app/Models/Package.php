<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Package extends Model
{
    protected $table = 'packages';

    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'location',
        'price',
        'duration_nights',
        'duration_days',
        'category',
        'tag',
        'image',
        'pax',
        'is_active',
        'meta_title',
        'meta_description',
        'canonical_url',
        'og_image',
        'is_indexable',
    ];

    protected $casts = [
        'price' => 'integer',
        'duration_nights' => 'integer',
        'duration_days' => 'integer',
        'pax' => 'integer',
        'is_active' => 'boolean',
        'is_indexable' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function sectionPackages(): HasMany
    {
        return $this->hasMany(SectionPackage::class);
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class, 'section_packages')
            ->withPivot(['display_order', 'is_featured'])
            ->withTimestamps()
            ->orderByPivot('display_order');
    }

    public function detail(): HasOne
    {
        return $this->hasOne(PackageDetail::class);
    }

    public function itineraryDays(): HasMany
    {
        return $this->hasMany(PackageItineraryDay::class)->orderBy('sort_order');
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(PackageFaq::class)->orderBy('sort_order');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PackageImage::class)->orderBy('sort_order');
    }
}
