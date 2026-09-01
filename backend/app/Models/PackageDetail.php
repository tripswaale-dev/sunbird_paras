<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageDetail extends Model
{
    protected $fillable = [
        'package_id',
        'overview',
        'destinations',
        'sightseeing',
        'inclusions',
        'exclusions',
        'highlights',
    ];

    protected $casts = [
        'destinations' => 'array',
        'sightseeing' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'highlights' => 'array',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
