<?php

namespace Tests\Feature\Api;

use App\Models\DestinationCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminDestinationCategoryTest extends TestCase
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
            'email' => 'admin-destination-categories@test.local',
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
            'email' => 'user-destination-categories@test.local',
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

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Updated Popular Destinations',
            'hero_image' => '/images/custom/popular.jpg',
            'hero_title' => 'Updated Hero Title',
            'hero_subtitle' => 'Updated hero subtitle.',
            'listing_path' => '/popular-destinations',
            'sort_order' => 1,
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_destination_categories(): void
    {
        $this->getJson('/api/admin/destination-categories')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_destination_category(): void
    {
        $this->patchJson('/api/admin/destination-categories/popular', $this->validPayload())
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_destination_categories(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/destination-categories')
            ->assertForbidden();
    }

    public function test_admin_can_list_all_destination_categories(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/destination-categories')
            ->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('data.0.code', 'popular')
            ->assertJsonPath('data.0.section_slug', 'popular-destinations')
            ->assertJsonPath('data.2.code', 'beaches')
            ->assertJsonPath('data.2.package_category', 'Beaches');
    }

    public function test_admin_can_show_destination_category(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/destination-categories/beaches')
            ->assertOk()
            ->assertJsonPath('data.code', 'beaches')
            ->assertJsonPath('data.section_slug', null)
            ->assertJsonPath('data.package_category', 'Beaches')
            ->assertJsonPath('data.listing_path', '/packages');
    }

    public function test_admin_can_update_destination_category_with_patch(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/destination-categories/popular', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Popular Destinations')
            ->assertJsonPath('data.hero_title', 'Updated Hero Title');

        $this->assertDatabaseHas('destination_categories', [
            'code' => 'popular',
            'title' => 'Updated Popular Destinations',
            'hero_title' => 'Updated Hero Title',
        ]);
    }

    public function test_admin_update_does_not_change_structural_fields(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/destination-categories/beaches', $this->validPayload([
                'title' => 'Coastal Escapes',
            ]))
            ->assertOk()
            ->assertJsonPath('data.section_slug', null)
            ->assertJsonPath('data.package_category', 'Beaches');
    }

    public function test_unknown_destination_category_returns_404(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/destination-categories/unknown')
            ->assertNotFound();
    }

    public function test_update_validation_rejects_missing_title(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/destination-categories/popular', $this->validPayload([
                'title' => '',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    public function test_admin_can_show_inactive_destination_category(): void
    {
        DestinationCategory::where('code', 'wildlife')->update(['is_active' => false]);

        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/destination-categories/wildlife')
            ->assertOk()
            ->assertJsonPath('data.is_active', false);
    }
}
