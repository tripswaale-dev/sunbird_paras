<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSeo extends Model
{
    public const PAGE_KEY_HOME = 'home';

    public const PAGE_KEY_GALLERY = 'gallery';

    public const PAGE_KEY_PACKAGES = 'packages';

    public const PAGE_KEY_SEARCH = 'search';

    public const PAGE_KEY_BLOGS = 'blogs';

    public const PAGE_KEY_ABOUT = 'about';

    public const PAGE_KEY_CONTACT = 'contact';

    public const PAGE_KEY_PAYMENT_POLICY = 'payment-policy';

    public const PAGE_KEY_CANCELLATION_POLICY = 'cancellation-policy';

    public const PAGE_KEY_DESTINATIONS = 'destinations';

    public const ALLOWED_PAGE_KEYS = [
        self::PAGE_KEY_HOME,
        self::PAGE_KEY_GALLERY,
        self::PAGE_KEY_PACKAGES,
        self::PAGE_KEY_SEARCH,
        self::PAGE_KEY_BLOGS,
        self::PAGE_KEY_ABOUT,
        self::PAGE_KEY_CONTACT,
        self::PAGE_KEY_PAYMENT_POLICY,
        self::PAGE_KEY_CANCELLATION_POLICY,
        self::PAGE_KEY_DESTINATIONS,
    ];

    /**
     * Static sitemap paths managed via page_seo (search is API-only — not in sitemap).
     *
     * @var array<string, string>
     */
    public const SITEMAP_PATH_TO_PAGE_KEY = [
        '/' => self::PAGE_KEY_HOME,
        '/about' => self::PAGE_KEY_ABOUT,
        '/contact' => self::PAGE_KEY_CONTACT,
        '/packages' => self::PAGE_KEY_PACKAGES,
        '/gallery' => self::PAGE_KEY_GALLERY,
        '/blogs' => self::PAGE_KEY_BLOGS,
        '/payment-policy' => self::PAGE_KEY_PAYMENT_POLICY,
        '/cancellation-policy' => self::PAGE_KEY_CANCELLATION_POLICY,
        '/destinations' => self::PAGE_KEY_DESTINATIONS,
    ];

    protected $table = 'page_seo';

    protected $fillable = [
        'page_key',
        'meta_title',
        'meta_description',
        'canonical_url',
        'og_image',
        'is_indexable',
    ];

    protected $casts = [
        'is_indexable' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'page_key';
    }
}
