<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PackageApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_packages_index_returns_paginated_active_packages(): void
    {
        $response = $this->getJson('/api/packages');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data',
                'meta' => ['current_page', 'per_page', 'total', 'last_page'],
            ])
            ->assertJsonPath('meta.total', 53)
            ->assertJsonPath('meta.per_page', 15);
    }

    public function test_packages_index_filters_by_category(): void
    {
        $response = $this->getJson('/api/packages?category=Pilgrimage');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $categories = collect($response->json('data'))->pluck('category')->unique()->all();
        $this->assertSame(['Pilgrimage'], $categories);
    }

    public function test_packages_index_supports_search(): void
    {
        $response = $this->getJson('/api/packages?search=kashmir');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $slugs = collect($response->json('data'))->pluck('slug')->all();
        $this->assertContains('kashmir-paradise', $slugs);
        $this->assertContains('heavenly-kashmir', $slugs);
    }

    public function test_packages_index_rejects_per_page_above_maximum(): void
    {
        $this->getJson('/api/packages?per_page=100')
            ->assertUnprocessable()
            ->assertJsonPath('success', false);
    }

    public function test_package_show_returns_full_detail_for_kashmir_paradise(): void
    {
        $response = $this->getJson('/api/packages/kashmir-paradise');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'kashmir-paradise')
            ->assertJsonPath('data.seo.is_indexable', true)
            ->assertJsonCount(7, 'data.itinerary')
            ->assertJsonCount(3, 'data.faqs')
            ->assertJsonPath('data.images.hero.0.type', null)
            ->assertJsonStructure([
                'data' => [
                    'detail' => ['overview', 'destinations', 'inclusions'],
                    'images' => ['hero', 'gallery'],
                ],
            ]);

        $this->assertCount(1, $response->json('data.images.hero'));
        $this->assertCount(5, $response->json('data.images.gallery'));
    }

    public function test_invalid_package_slug_returns_404(): void
    {
        $this->getJson('/api/packages/does-not-exist')
            ->assertNotFound()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Resource not found.');
    }

    public function test_inactive_package_returns_404(): void
    {
        Package::where('slug', 'kashmir-paradise')->update(['is_active' => false]);

        $this->getJson('/api/packages/kashmir-paradise')
            ->assertNotFound();
    }
}
