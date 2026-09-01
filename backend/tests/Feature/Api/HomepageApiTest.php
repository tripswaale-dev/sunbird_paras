<?php

namespace Tests\Feature\Api;

use App\Models\CustomerPromiseItem;
use App\Models\HomepageHero;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_homepage_returns_hero_and_customer_promises(): void
    {
        $this->getJson('/api/homepage')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.hero.backgroundVideo', '/bg1.mp4')
            ->assertJsonPath('data.hero.featuredChip.icon', 'map-pin')
            ->assertJsonPath('data.hero.featuredChip.label', 'Trending in India')
            ->assertJsonCount(3, 'data.hero.chips')
            ->assertJsonCount(4, 'data.customerPromises')
            ->assertJsonPath('data.customerPromises.0.title', 'We Listen')
            ->assertJsonPath('data.customerPromises.0.icon', 'headphones');
    }

    public function test_homepage_uses_camel_case_keys(): void
    {
        $this->getJson('/api/homepage')
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'hero' => [
                        'backgroundVideo',
                        'chips' => [
                            '*' => ['icon', 'label'],
                        ],
                        'featuredChip' => ['icon', 'label'],
                    ],
                    'customerPromises' => [
                        '*' => ['id', 'title', 'description', 'icon'],
                    ],
                ],
            ]);
    }

    public function test_homepage_excludes_inactive_customer_promise_items(): void
    {
        CustomerPromiseItem::where('id', 2)->update(['is_active' => false]);

        $this->getJson('/api/homepage')
            ->assertOk()
            ->assertJsonCount(3, 'data.customerPromises');

        $titles = collect($this->getJson('/api/homepage')->json('data.customerPromises'))
            ->pluck('title')
            ->all();

        $this->assertNotContains('We Act Fast', $titles);
    }

    public function test_homepage_returns_404_when_hero_is_inactive(): void
    {
        HomepageHero::where('id', HomepageHero::SINGLETON_ID)->update(['is_active' => false]);

        $this->getJson('/api/homepage')
            ->assertNotFound()
            ->assertJsonPath('success', false);
    }

    public function test_homepage_chips_match_seeded_icons(): void
    {
        $chips = $this->getJson('/api/homepage')->json('data.hero.chips');

        $this->assertSame('mountain', $chips[0]['icon']);
        $this->assertSame('Mountains', $chips[0]['label']);
        $this->assertSame('umbrella', $chips[1]['icon']);
        $this->assertSame('tree-pine', $chips[2]['icon']);
    }
}
