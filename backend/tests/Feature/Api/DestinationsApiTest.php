<?php

namespace Tests\Feature\Api;

use App\Models\DestinationCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DestinationsApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_destinations_index_returns_default_category_when_param_omitted(): void
    {
        $this->getJson('/api/destinations')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.activeCategory', 'popular')
            ->assertJsonPath('data.heroTitle', 'Popular Destinations')
            ->assertJsonPath('data.listingPath', '/popular-destinations');
    }

    public function test_destinations_index_returns_six_active_categories(): void
    {
        $this->getJson('/api/destinations')
            ->assertOk()
            ->assertJsonCount(6, 'data.categories')
            ->assertJsonPath('data.categories.0.code', 'popular')
            ->assertJsonPath('data.categories.1.code', 'hills')
            ->assertJsonPath('data.categories.2.code', 'beaches')
            ->assertJsonPath('data.categories.5.code', 'international');
    }

    public function test_destinations_index_uses_camel_case_keys(): void
    {
        $this->getJson('/api/destinations')
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'categories' => [
                        '*' => [
                            'code',
                            'title',
                            'heroImage',
                            'heroTitle',
                            'heroSubtitle',
                            'listingPath',
                        ],
                    ],
                    'activeCategory',
                    'heroImage',
                    'heroTitle',
                    'heroSubtitle',
                    'listingPath',
                    'packages',
                ],
            ]);
    }

    public function test_destinations_index_returns_section_packages_for_popular(): void
    {
        $sectionPackages = collect(
            $this->getJson('/api/sections/popular-destinations/packages')->json('data.packages')
        )->pluck('slug')->all();

        $destinationPackages = collect(
            $this->getJson('/api/destinations?category=popular')->json('data.packages')
        )->pluck('slug')->all();

        $this->assertSame($sectionPackages, $destinationPackages);
        $this->assertContains('spiti-valley', $destinationPackages);
    }

    public function test_destinations_index_returns_global_beaches_packages(): void
    {
        $this->getJson('/api/destinations?category=beaches')
            ->assertOk()
            ->assertJsonPath('data.activeCategory', 'beaches')
            ->assertJsonPath('data.listingPath', '/packages')
            ->assertJsonCount(3, 'data.packages');

        $slugs = collect($this->getJson('/api/destinations?category=beaches')->json('data.packages'))
            ->pluck('slug')
            ->all();

        $this->assertEqualsCanonicalizing(
            ['andaman-escape', 'misty-kerala', 'goa-waterfall-trail'],
            $slugs
        );
    }

    public function test_destinations_index_switches_active_category_with_query_param(): void
    {
        $this->getJson('/api/destinations?category=hills')
            ->assertOk()
            ->assertJsonPath('data.activeCategory', 'hills')
            ->assertJsonPath('data.heroTitle', 'Gateway to the Hills')
            ->assertJsonPath('data.listingPath', '/gateway-to-the-hills');
    }

    public function test_destinations_index_falls_back_to_default_for_invalid_category(): void
    {
        $this->getJson('/api/destinations?category=unknown')
            ->assertOk()
            ->assertJsonPath('data.activeCategory', 'popular');
    }

    public function test_destinations_index_excludes_inactive_categories_from_list(): void
    {
        DestinationCategory::where('code', 'hills')->update(['is_active' => false]);

        $this->getJson('/api/destinations')
            ->assertOk()
            ->assertJsonCount(5, 'data.categories')
            ->assertJsonMissing(['code' => 'hills']);
    }

    public function test_destinations_index_falls_back_when_requesting_inactive_category(): void
    {
        DestinationCategory::where('code', 'hills')->update(['is_active' => false]);

        $this->getJson('/api/destinations?category=hills')
            ->assertOk()
            ->assertJsonPath('data.activeCategory', 'popular');
    }

    public function test_destinations_packages_use_summary_shape(): void
    {
        $this->getJson('/api/destinations?category=popular')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'packages' => [
                        '*' => [
                            'id',
                            'slug',
                            'title',
                            'duration' => ['nights', 'days', 'formatted', 'short'],
                            'inclusions',
                        ],
                    ],
                ],
            ]);
    }
}
