<?php

namespace Tests\Feature\Api;

use App\Models\Blog;
use App\Models\GalleryItem;
use App\Models\Package;
use App\Models\Section;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        config(['frontend.url' => 'https://frontend.test']);
    }

    public function test_sitemap_returns_xml_response(): void
    {
        $this->get('/api/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function test_sitemap_contains_valid_urlset(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<?xml version="1.0" encoding="UTF-8"?>', $content);
        $this->assertStringContainsString('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', $content);
        $this->assertStringContainsString('</urlset>', $content);
    }

    public function test_sitemap_contains_static_frontend_urls(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/about</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/packages</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/blogs</loc>', $content);
    }

    public function test_sitemap_contains_active_section_listing_urls(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/popular-destinations</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/travelyourway</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/explore-wild-india</loc>', $content);
    }

    public function test_sitemap_contains_active_indexable_package_urls(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/packages/kashmir-paradise</loc>', $content);
    }

    public function test_sitemap_excludes_inactive_packages(): void
    {
        Package::where('slug', 'kashmir-paradise')->update(['is_active' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/packages/kashmir-paradise</loc>', $content);
    }

    public function test_sitemap_excludes_non_indexable_packages(): void
    {
        Package::where('slug', 'colors-of-rajasthan')->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/packages/colors-of-rajasthan</loc>', $content);
    }

    public function test_sitemap_excludes_inactive_sections(): void
    {
        Section::where('slug', 'gateway-to-the-hills')->update(['is_active' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/gateway-to-the-hills</loc>', $content);
    }

    public function test_sitemap_excludes_non_indexable_sections(): void
    {
        Section::where('slug', 'gateway-to-the-hills')->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/gateway-to-the-hills</loc>', $content);
    }

    public function test_sitemap_uses_package_canonical_url_when_set(): void
    {
        Package::where('slug', 'spiti-valley')->update([
            'canonical_url' => 'https://frontend.test/custom/spiti-valley',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/spiti-valley</loc>', $content);
        $this->assertStringNotContainsString('<loc>https://frontend.test/packages/spiti-valley</loc>', $content);
    }

    public function test_sitemap_uses_section_canonical_url_when_set(): void
    {
        Section::where('slug', 'gateway-to-the-hills')->update([
            'canonical_url' => 'https://frontend.test/custom/gateway-to-the-hills',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/gateway-to-the-hills</loc>', $content);
        $this->assertStringNotContainsString('<loc>https://frontend.test/gateway-to-the-hills</loc>', $content);
    }

    public function test_sitemap_does_not_include_section_scoped_package_urls(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/popular-destinations/kashmir-paradise</loc>', $content);
        $this->assertStringNotContainsString('<loc>https://frontend.test/best-of-india/spiti-valley</loc>', $content);
    }

    public function test_sitemap_includes_active_blog_post_urls(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/blogs</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/blogs/story-behind-sunbird-vacations</loc>', $content);
    }

    public function test_sitemap_excludes_inactive_blogs(): void
    {
        Blog::where('slug', 'story-behind-sunbird-vacations')->update(['is_active' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/blogs</loc>', $content);
        $this->assertStringNotContainsString('<loc>https://frontend.test/blogs/story-behind-sunbird-vacations</loc>', $content);
    }

    public function test_sitemap_excludes_non_indexable_blogs(): void
    {
        Blog::where('slug', 'story-behind-sunbird-vacations')->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/blogs</loc>', $content);
        $this->assertStringNotContainsString('<loc>https://frontend.test/blogs/story-behind-sunbird-vacations</loc>', $content);
    }

    public function test_sitemap_uses_blog_canonical_url_when_set(): void
    {
        Blog::where('slug', 'story-behind-sunbird-vacations')->update([
            'canonical_url' => 'https://frontend.test/custom/story-behind-sunbird-vacations',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/story-behind-sunbird-vacations</loc>', $content);
        $this->assertStringNotContainsString('<loc>https://frontend.test/blogs/story-behind-sunbird-vacations</loc>', $content);
    }

    public function test_sitemap_includes_gallery_listing_url(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/gallery</loc>', $content);
    }

    public function test_sitemap_does_not_include_gallery_item_urls(): void
    {
        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/gallery</loc>', $content);
        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/gallery\/[^<]+<\/loc>/', $content);
    }

    public function test_sitemap_gallery_listing_has_lastmod_from_active_items(): void
    {
        GalleryItem::query()->active()->update(['updated_at' => '2026-09-01 00:00:00']);
        GalleryItem::where('external_id', 'raj-1')->update(['updated_at' => '2026-09-15 12:00:00']);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertMatchesRegularExpression(
            '/<url>\s*<loc>https:\/\/frontend\.test\/gallery<\/loc>\s*<lastmod>2026-09-15<\/lastmod>/s',
            $content
        );
    }

    public function test_sitemap_gallery_lastmod_ignores_inactive_items(): void
    {
        GalleryItem::query()->active()->update(['updated_at' => '2026-09-01 00:00:00']);
        GalleryItem::where('external_id', 'raj-1')->update([
            'is_active' => false,
            'updated_at' => '2026-09-20 12:00:00',
        ]);
        GalleryItem::where('external_id', 'raj-2')->update(['updated_at' => '2026-09-10 12:00:00']);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertMatchesRegularExpression(
            '/<url>\s*<loc>https:\/\/frontend\.test\/gallery<\/loc>\s*<lastmod>2026-09-10<\/lastmod>/s',
            $content
        );
    }

    public function test_sitemap_includes_expected_url_count(): void
    {
        $urlCount = substr_count($this->get('/api/sitemap.xml')->getContent(), '<url>');

        $this->assertSame(70, $urlCount);
    }
}
