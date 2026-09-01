<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageSeoApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_page_seo_show_returns_blogs_seo(): void
    {
        $this->getJson('/api/page-seo/blogs')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.page_key', 'blogs')
            ->assertJsonStructure([
                'success',
                'data' => [
                    'page_key',
                    'seo' => [
                        'meta_title',
                        'meta_description',
                        'canonical_url',
                        'og_image',
                        'is_indexable',
                    ],
                ],
            ])
            ->assertJsonPath('data.seo.meta_title', 'Travel Blogs | Sunbird Vacations')
            ->assertJsonPath('data.seo.is_indexable', true);
    }

    public function test_page_seo_show_returns_home_seo(): void
    {
        $this->getJson('/api/page-seo/home')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'home')
            ->assertJsonPath('data.seo.meta_title', 'Sunbird Vacations — Your dream vacays start here!');
    }

    public function test_page_seo_show_returns_gallery_seo(): void
    {
        $this->getJson('/api/page-seo/gallery')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'gallery')
            ->assertJsonPath('data.seo.meta_title', 'Gallery');
    }

    public function test_page_seo_show_returns_packages_seo(): void
    {
        $this->getJson('/api/page-seo/packages')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'packages')
            ->assertJsonPath('data.seo.meta_title', 'Tour Packages | Sunbird Vacations');
    }

    public function test_page_seo_show_returns_search_seo(): void
    {
        $this->getJson('/api/page-seo/search')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'search')
            ->assertJsonPath('data.seo.meta_title', 'Search Results | Sunbird Vacations');
    }

    public function test_page_seo_show_returns_destinations_seo(): void
    {
        $this->getJson('/api/page-seo/destinations')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'destinations')
            ->assertJsonPath('data.seo.meta_title', 'Destinations | Sunbird Vacations')
            ->assertJsonPath('data.seo.is_indexable', true);
    }

  /**
   * @dataProvider staticContentPageSeoProvider
   */
    public function test_page_seo_show_returns_static_content_page_seo(string $pageKey, string $metaTitle): void
    {
        $this->getJson("/api/page-seo/{$pageKey}")
            ->assertOk()
            ->assertJsonPath('data.page_key', $pageKey)
            ->assertJsonPath('data.seo.meta_title', $metaTitle);
    }

    public static function staticContentPageSeoProvider(): array
    {
        return [
            'about' => ['about', 'About Us | Sunbird Vacations'],
            'contact' => ['contact', 'Contact Us | Sunbird Vacations'],
            'payment-policy' => ['payment-policy', 'Payment Policy | Sunbird Vacations'],
            'cancellation-policy' => ['cancellation-policy', 'Cancellation & Refund Policy | Sunbird Vacations'],
        ];
    }

    public function test_unknown_page_key_returns_404(): void
    {
        $this->getJson('/api/page-seo/homepage')
            ->assertNotFound();
    }
}
