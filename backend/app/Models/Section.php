<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'view_all_path',
        'sort_order',
        'hero_image',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function sectionPackages(): HasMany
    {
        return $this->hasMany(SectionPackage::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'section_packages')
            ->withPivot(['display_order', 'is_featured'])
            ->withTimestamps()
            ->orderByPivot('display_order');
    }

    public function activePackages(): BelongsToMany
    {
        return $this->packages()->where('packages.is_active', true);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(SectionCategory::class)->orderBy('sort_order');
    }

    public function stats(): HasMany
    {
        return $this->hasMany(SectionStat::class)->orderBy('sort_order');
    }
}
