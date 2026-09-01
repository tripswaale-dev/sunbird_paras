<?php

namespace Tests\Feature\Api;

use App\Models\Section;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSectionCrudTest extends TestCase
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
            'email' => 'admin-sections@test.local',
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
            'email' => 'user-sections@test.local',
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

    private function validSectionPayload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'test-section',
            'title' => 'Test Section',
            'subtitle' => 'A test section',
            'view_all_path' => '/test-section',
            'hero_image' => '/images/test.jpg',
            'sort_order' => 99,
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_sections(): void
    {
        $this->getJson('/api/admin/sections')
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_section(): void
    {
        $this->postJson('/api/admin/sections', $this->validSectionPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_section(): void
    {
        $section = Section::first();

        $this->putJson("/api/admin/sections/{$section->id}", ['title' => 'Updated'])
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_section(): void
    {
        $section = Section::first();

        $this->deleteJson("/api/admin/sections/{$section->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_sections(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/sections')
            ->assertForbidden();
    }

    public function test_admin_can_list_all_sections(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/sections')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(7, 'data');
    }

    public function test_admin_list_is_ordered_by_sort_order(): void
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/sections')
            ->assertOk();

        $slugs = collect($response->json('data'))->pluck('slug')->all();

        $this->assertSame('popular-destinations', $slugs[0]);
        $this->assertSame('explore-wild-india', $slugs[6]);
    }

    public function test_admin_can_create_section(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/sections', $this->validSectionPayload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'test-section')
            ->assertJsonPath('data.sort_order', 99);

        $this->assertDatabaseHas('sections', ['slug' => 'test-section']);
    }

    public function test_create_fails_with_duplicate_slug(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/sections', $this->validSectionPayload([
                'slug' => 'popular-destinations',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_create_fails_with_missing_required_fields(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/sections', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug', 'title', 'view_all_path', 'sort_order']);
    }

    public function test_admin_can_show_section(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}")
            ->assertOk()
            ->assertJsonPath('data.slug', 'popular-destinations')
            ->assertJsonStructure([
                'data' => [
                    'id', 'slug', 'title', 'subtitle', 'view_all_path',
                    'hero_image', 'sort_order', 'is_active', 'created_at', 'updated_at',
                ],
            ]);
    }

    public function test_show_returns_404_for_nonexistent_id(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/sections/99999')
            ->assertNotFound();
    }

    public function test_admin_can_full_update_section_with_put(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/sections/{$section->id}", [
                'slug' => 'travel-your-way',
                'title' => 'Travel Your Way Updated',
                'subtitle' => 'Updated subtitle',
                'view_all_path' => '/travelyourway',
                'hero_image' => '/images/hero/travel-your-way.png',
                'sort_order' => 2,
                'is_active' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Travel Your Way Updated')
            ->assertJsonPath('data.subtitle', 'Updated subtitle');
    }

    public function test_admin_can_partially_update_section_with_patch(): void
    {
        $section = Section::where('slug', 'across-boundaries')->first();
        $originalSubtitle = $section->subtitle;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}", [
                'title' => 'Across Boundaries Updated',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Across Boundaries Updated')
            ->assertJsonPath('data.subtitle', $originalSubtitle);
    }

    public function test_update_fails_with_duplicate_slug_on_another_section(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}", [
                'slug' => 'popular-destinations',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_update_allows_unchanged_own_slug(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}", [
                'slug' => 'gateway-to-the-hills',
                'title' => 'Gateway Updated Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'gateway-to-the-hills')
            ->assertJsonPath('data.title', 'Gateway Updated Title');
    }

    public function test_deactivated_section_disappears_from_public_listing(): void
    {
        $section = Section::where('slug', 'spiritual-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}", ['is_active' => false])
            ->assertOk();

        $publicSlugs = collect($this->getJson('/api/sections')->json('data'))->pluck('slug')->all();

        $this->assertNotContains('spiritual-destinations', $publicSlugs);

        $this->getJson('/api/sections/spiritual-destinations')
            ->assertNotFound();
    }

    public function test_updating_sort_order_changes_public_ordering(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $section = Section::where('slug', 'explore-wild-india')->first();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}", ['sort_order' => 0])
            ->assertOk();

        $firstSlug = $this->getJson('/api/sections')->json('data.0.slug');

        $this->assertSame('explore-wild-india', $firstSlug);

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}", ['sort_order' => 7])
            ->assertOk();
    }

    public function test_admin_can_delete_section_without_dependencies(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/sections', $this->validSectionPayload([
                'slug' => 'empty-section',
            ]))
            ->assertCreated();

        $section = Section::where('slug', 'empty-section')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('sections', ['slug' => 'empty-section']);
    }

    public function test_cannot_delete_section_with_dependencies(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/sections/{$section->id}")
            ->assertStatus(409)
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('sections', ['slug' => 'popular-destinations']);
    }
}
