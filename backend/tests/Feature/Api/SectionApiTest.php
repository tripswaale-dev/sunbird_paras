<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\Section;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SectionApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_sections_index_returns_active_sections_ordered(): void
    {
        $response = $this->getJson('/api/sections');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(7, 'data')
            ->assertJsonPath('data.0.slug', 'popular-destinations')
            ->assertJsonPath('data.6.slug', 'explore-wild-india');
    }

    public function test_section_show_returns_packages_and_stats_for_popular_destinations(): void
    {
        $response = $this->getJson('/api/sections/popular-destinations');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'popular-destinations')
            ->assertJsonPath('data.seo.is_indexable', true)
            ->assertJsonPath('data.seo.meta_title', null)
            ->assertJsonCount(12, 'data.packages')
            ->assertJsonCount(4, 'data.stats')
            ->assertJsonPath('data.packages.0.slug', 'spiti-valley');
    }

    public function test_section_show_returns_categories_for_travel_your_way(): void
    {
        $response = $this->getJson('/api/sections/travel-your-way');

        $response->assertOk()
            ->assertJsonPath('data.slug', 'travel-your-way')
            ->assertJsonCount(4, 'data.categories')
            ->assertJsonPath('data.categories.0.title', 'Pocket-Friendly');
    }

    public function test_invalid_section_slug_returns_404(): void
    {
        $this->getJson('/api/sections/invalid-slug')
            ->assertNotFound()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Resource not found.');
    }

    public function test_inactive_section_returns_404(): void
    {
        Section::where('slug', 'popular-destinations')->update(['is_active' => false]);

        $this->getJson('/api/sections/popular-destinations')
            ->assertNotFound();
    }

    public function test_section_packages_returns_ordered_packages(): void
    {
        $response = $this->getJson('/api/sections/best-of-india/packages');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(14, 'data.packages')
            ->assertJsonPath('data.packages.0.slug', 'golden-triangle');
    }

    public function test_section_packages_supports_category_filter(): void
    {
        $response = $this->getJson('/api/sections/best-of-india/packages?category=North');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $slugs = collect($response->json('data.packages'))->pluck('slug')->all();

        $this->assertContains('golden-triangle', $slugs);
        $this->assertNotContains('southern-odyssey', $slugs);
    }

    public function test_river_retreat_appears_in_both_sections(): void
    {
        $bestOfIndia = $this->getJson('/api/sections/best-of-india/packages')
            ->json('data.packages');
        $spiritual = $this->getJson('/api/sections/spiritual-destinations/packages')
            ->json('data.packages');

        $this->assertContains(
            'river-retreat-haridwar-rishikesh',
            collect($bestOfIndia)->pluck('slug')->all()
        );
        $this->assertContains(
            'river-retreat-haridwar-rishikesh',
            collect($spiritual)->pluck('slug')->all()
        );
    }
}
