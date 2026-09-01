<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageItineraryDay extends Model
{
    protected $fillable = [
        'package_id',
        'day',
        'title',
        'description',
        'stay_information',
        'notes',
        'images',
        'sort_order',
    ];

    protected $casts = [
        'day' => 'integer',
        'sort_order' => 'integer',
        'images' => 'array',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
