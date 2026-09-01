<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    public const PAGE_KEY_ABOUT = 'about';

    public const PAGE_KEY_CONTACT = 'contact';

    public const ALLOWED_PAGE_KEYS = [
        self::PAGE_KEY_ABOUT,
        self::PAGE_KEY_CONTACT,
    ];

    protected $fillable = [
        'page_key',
        'hero_image',
        'hero_title',
        'hero_subtitle',
        'intro_text',
        'body',
        'contact_phone',
        'contact_email',
        'contact_address',
        'working_hours',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'page_key';
    }
}
