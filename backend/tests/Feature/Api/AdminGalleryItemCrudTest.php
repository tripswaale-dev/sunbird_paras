<?php

namespace Tests\Feature\Api;

use App\Models\GalleryItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminGalleryItemCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function createAdmin(): User
    {
        $user = User::create([
            'name' => 'Test Admin',
            'email' => 'admin-gallery@test.local',
            'password' => Hash::make('password123'),
        ]);
        $user->is_admin = true;
        $user->save();

        return $user->fresh();
    }

    private function createNonAdmin(): User
    {
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user-gallery@test.local',
            'password' => Hash::make('password123'),
        ]);
        $user->is_admin = false;
        $user->save();

        return $user->fresh();
    }

    private function adminHeaders(?User $admin = null): array
    {
        $admin ??= $this->createAdmin();
        $token = $admin->createToken('admin-api')->plainTextToken;

        return ['Authorization' => 'Bearer '.$token];
    }

    private function validGalleryItemPayload(array $overrides = []): array
    {
        return array_merge([
            'external_id' => 'test-gallery-item',
            'src' => '/images/test/gallery.jpg',
            'category' => 'RAJASTHAN',
            'title' => 'Test Gallery Item',
            'subtitle' => 'Test subtitle',
            'aspect_ratio' => 'landscape',
            'sort_order' => 99,
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_gallery_items(): void
    {
        $this->getJson('/api/admin/gallery-items')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_gallery_item(): void
    {
        $this->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_gallery_item(): void
    {
        $item = GalleryItem::first();

        $this->putJson("/api/admin/gallery-items/{$item->id}", ['title' => 'Updated'])
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_gallery_item(): void
    {
        $item = GalleryItem::first();

        $this->deleteJson("/api/admin/gallery-items/{$item->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_gallery_items(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/gallery-items')
            ->assertForbidden();
    }

    public function test_admin_can_list_gallery_items(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/gallery-items')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data',
                'meta' => ['current_page', 'per_page', 'total', 'last_page'],
            ])
            ->assertJsonPath('meta.total', 22)
            ->assertJsonPath('data.0.external_id', 'raj-1');
    }

    public function test_admin_can_show_gallery_item(): void
    {
        $item = GalleryItem::where('external_id', 'raj-1')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/gallery-items/{$item->id}")
            ->assertOk()
            ->assertJsonPath('data.external_id', 'raj-1')
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'external_id',
                    'src',
                    'category',
                    'title',
                    'subtitle',
                    'aspect_ratio',
                    'sort_order',
                    'is_active',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function test_admin_can_create_gallery_item(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.external_id', 'test-gallery-item')
            ->assertJsonPath('data.aspect_ratio', 'landscape');

        $this->assertDatabaseHas('gallery_items', ['external_id' => 'test-gallery-item']);
    }

    public function test_create_fails_with_missing_required_fields(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/gallery-items', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'external_id',
                'src',
                'category',
                'title',
                'subtitle',
                'aspect_ratio',
                'sort_order',
            ]);
    }

    public function test_create_fails_with_duplicate_external_id(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload([
                'external_id' => 'raj-1',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['external_id']);
    }

    public function test_create_fails_with_invalid_category(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload([
                'category' => 'ALL',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['category']);
    }

    public function test_create_fails_with_invalid_aspect_ratio(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload([
                'aspect_ratio' => 'wide',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['aspect_ratio']);
    }

    public function test_admin_can_partially_update_gallery_item_with_patch(): void
    {
        $item = GalleryItem::where('external_id', 'raj-1')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/gallery-items/{$item->id}", [
                'title' => 'Updated Gallery Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Gallery Title')
            ->assertJsonPath('data.external_id', 'raj-1');
    }

    public function test_admin_can_delete_gallery_item(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload([
                'external_id' => 'deletable-gallery-item',
            ]))
            ->assertCreated();

        $item = GalleryItem::where('external_id', 'deletable-gallery-item')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/gallery-items/{$item->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('gallery_items', ['external_id' => 'deletable-gallery-item']);
    }

    public function test_newly_created_active_gallery_item_appears_in_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload([
                'external_id' => 'public-visible-gallery-item',
            ]))
            ->assertCreated();

        $ids = collect($this->getJson('/api/gallery')->json('data.items'))
            ->pluck('id')
            ->all();

        $this->assertContains('public-visible-gallery-item', $ids);
    }

    public function test_deactivated_gallery_item_is_excluded_from_public_api(): void
    {
        $item = GalleryItem::where('external_id', 'raj-1')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/gallery-items/{$item->id}", ['is_active' => false])
            ->assertOk();

        $publicIds = collect($this->getJson('/api/gallery')->json('data.items'))
            ->pluck('id')
            ->all();

        $this->assertNotContains('raj-1', $publicIds);
    }

    public function test_deleted_gallery_item_is_excluded_from_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/gallery-items', $this->validGalleryItemPayload([
                'external_id' => 'temp-public-gallery-item',
            ]))
            ->assertCreated();

        $item = GalleryItem::where('external_id', 'temp-public-gallery-item')->first();
        $this->assertContains('temp-public-gallery-item', collect($this->getJson('/api/gallery')->json('data.items'))->pluck('id')->all());

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/gallery-items/{$item->id}")
            ->assertOk();

        $publicIds = collect($this->getJson('/api/gallery')->json('data.items'))
            ->pluck('id')
            ->all();

        $this->assertNotContains('temp-public-gallery-item', $publicIds);
    }
}
