<?php

namespace Tests\Feature\Api;

use App\Models\HomepageHero;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminHomepageHeroTest extends TestCase
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
            'email' => 'admin-homepage-hero@test.local',
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
            'email' => 'user-homepage-hero@test.local',
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
            'background_video' => '/bg2.mp4',
            'chips' => [
                ['icon' => 'mountain', 'label' => 'Updated Mountains'],
                ['icon' => 'umbrella', 'label' => 'Updated Beaches'],
            ],
            'featured_chip' => [
                'icon' => 'map-pin',
                'label' => 'Updated Trending',
            ],
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_show_homepage_hero(): void
    {
        $this->getJson('/api/admin/homepage-hero')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_homepage_hero(): void
    {
        $this->patchJson('/api/admin/homepage-hero', $this->validPayload())
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_homepage_hero(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/homepage-hero')
            ->assertForbidden();
    }

    public function test_admin_can_show_homepage_hero(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/homepage-hero')
            ->assertOk()
            ->assertJsonPath('data.id', HomepageHero::SINGLETON_ID)
            ->assertJsonPath('data.background_video', '/bg1.mp4')
            ->assertJsonCount(3, 'data.chips')
            ->assertJsonPath('data.featured_chip.label', 'Trending in India');
    }

    public function test_admin_can_update_homepage_hero_with_patch(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/homepage-hero', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('data.background_video', '/bg2.mp4')
            ->assertJsonPath('data.chips.0.label', 'Updated Mountains');

        $this->assertDatabaseHas('homepage_hero', [
            'id' => HomepageHero::SINGLETON_ID,
            'background_video' => '/bg2.mp4',
        ]);
    }

    public function test_update_validation_rejects_invalid_chip_icon(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/homepage-hero', $this->validPayload([
                'chips' => [
                    ['icon' => 'invalid-icon', 'label' => 'Bad'],
                ],
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['chips.0.icon']);
    }

    public function test_update_validation_rejects_invalid_featured_chip_icon(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/homepage-hero', $this->validPayload([
                'featured_chip' => [
                    'icon' => 'headphones',
                    'label' => 'Wrong icon set',
                ],
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['featured_chip.icon']);
    }

    public function test_admin_update_reflects_on_public_homepage(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/homepage-hero', $this->validPayload());

        $this->getJson('/api/homepage')
            ->assertOk()
            ->assertJsonPath('data.hero.backgroundVideo', '/bg2.mp4')
            ->assertJsonPath('data.hero.chips.0.label', 'Updated Mountains');
    }
}
