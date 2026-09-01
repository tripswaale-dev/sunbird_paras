<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageFaq extends Model
{
    protected $fillable = [
        'package_id',
        'question',
        'answer',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
