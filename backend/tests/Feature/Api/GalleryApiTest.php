<?php

namespace Tests\Feature\Api;

use App\Models\GalleryItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GalleryApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_gallery_index_returns_active_items(): void
    {
        $response = $this->getJson('/api/gallery');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(22, 'data.items')
            ->assertJsonStructure([
                'success',
                'data' => [
                    'categories',
                    'items' => [
                        [
                            'id',
                            'src',
                            'category',
                            'title',
                            'subtitle',
                            'aspectRatio',
                        ],
                    ],
                ],
            ])
            ->assertJsonPath('data.items.0.id', 'raj-1')
            ->assertJsonPath('data.items.0.title', 'Jaipur City')
            ->assertJsonPath('data.items.0.category', 'RAJASTHAN')
            ->assertJsonPath('data.items.0.aspectRatio', 'landscape');
    }

    public function test_gallery_index_includes_categories_without_all(): void
    {
        $response = $this->getJson('/api/gallery');

        $response->assertOk()
            ->assertJsonPath('data.categories', [
                'RAJASTHAN',
                'UTTARAKHAND',
                'HIMACHAL',
                'KASHMIR',
                'KERALA',
                'GOA',
                'LADAKH',
                'ANDAMAN',
                'INTERNATIONAL',
            ]);

        $categories = $response->json('data.categories');
        $this->assertNotContains('ALL', $categories);
    }

    public function test_gallery_index_preserves_seeded_item_order(): void
    {
        $response = $this->getJson('/api/gallery');

        $response->assertOk();

        $ids = collect($response->json('data.items'))->pluck('id')->all();

        $this->assertSame([
            'raj-1',
            'raj-2',
            'raj-3',
            'raj-4',
            'uk-1',
            'uk-2',
            'hp-1',
            'hp-2',
            'kas-1',
            'ker-1',
            'ker-2',
            'ker-3',
            'goa-1',
            'goa-2',
            'lad-1',
            'lad-2',
            'and-1',
            'int-1',
            'int-2',
            'int-3',
            'int-4',
            'int-5',
        ], $ids);
    }

    public function test_gallery_excludes_inactive_items(): void
    {
        GalleryItem::where('external_id', 'raj-1')->update(['is_active' => false]);

        $response = $this->getJson('/api/gallery');

        $response->assertOk()
            ->assertJsonCount(21, 'data.items');

        $ids = collect($response->json('data.items'))->pluck('id')->all();
        $this->assertNotContains('raj-1', $ids);
    }

    public function test_gallery_item_categories_match_frontend_enum(): void
    {
        $response = $this->getJson('/api/gallery');

        $response->assertOk();

        $categories = collect($response->json('data.items'))->pluck('category')->unique()->sort()->values()->all();

        $this->assertSame([
            'ANDAMAN',
            'GOA',
            'HIMACHAL',
            'INTERNATIONAL',
            'KASHMIR',
            'KERALA',
            'LADAKH',
            'RAJASTHAN',
            'UTTARAKHAND',
        ], $categories);
    }
}
