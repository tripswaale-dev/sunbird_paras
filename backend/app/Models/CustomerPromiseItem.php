<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CustomerPromiseItem extends Model
{
    public const ICON_HEADPHONES = 'headphones';

    public const ICON_ALARM_CLOCK = 'alarm-clock';

    public const ICON_HANDSHAKE = 'handshake';

    public const ICON_USERS = 'users';

    public const ALLOWED_ICONS = [
        self::ICON_HEADPHONES,
        self::ICON_ALARM_CLOCK,
        self::ICON_HANDSHAKE,
        self::ICON_USERS,
    ];

    protected $fillable = [
        'title',
        'description',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
