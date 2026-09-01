<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageHero extends Model
{
    public const SINGLETON_ID = 1;

    public const ICON_MOUNTAIN = 'mountain';

    public const ICON_UMBRELLA = 'umbrella';

    public const ICON_TREE_PINE = 'tree-pine';

    public const ICON_MAP_PIN = 'map-pin';

    public const ALLOWED_CHIP_ICONS = [
        self::ICON_MOUNTAIN,
        self::ICON_UMBRELLA,
        self::ICON_TREE_PINE,
        self::ICON_MAP_PIN,
    ];

    protected $table = 'homepage_hero';

    protected $fillable = [
        'background_video',
        'chips',
        'featured_chip',
        'is_active',
    ];

    protected $casts = [
        'chips' => 'array',
        'featured_chip' => 'array',
        'is_active' => 'boolean',
    ];
}
