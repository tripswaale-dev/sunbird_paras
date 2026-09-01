<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SectionPackage extends Model
{
    protected $fillable = [
        'section_id',
        'package_id',
        'display_order',
        'is_featured',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
