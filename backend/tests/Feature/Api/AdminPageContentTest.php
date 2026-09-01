<?php

namespace Tests\Feature\Api;

use App\Models\PageContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPageContentTest extends TestCase
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
            'email' => 'admin-page-content@test.local',
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
            'email' => 'user-page-content@test.local',
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

    private function validContactPayload(array $overrides = []): array
    {
        return array_merge([
            'hero_image' => '/images/destinations/kerala.jpg',
            'hero_title' => 'Updated Contact Us',
            'hero_subtitle' => 'Updated subtitle.',
            'intro_text' => 'Updated intro text.',
            'body' => null,
            'contact_phone' => '+91 99999 99999',
            'contact_email' => 'updated@sunbird.test',
            'contact_address' => 'Updated address line.',
            'working_hours' => "Monday - Friday: 9:00 AM - 6:00 PM\nSunday: Closed",
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_show_page_content(): void
    {
        $this->getJson('/api/admin/page-content/contact')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_page_content(): void
    {
        $this->patchJson('/api/admin/page-content/contact', $this->validContactPayload())
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_page_content(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/page-content/contact')
            ->assertForbidden();
    }

    public function test_admin_can_show_page_content(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/page-content/contact')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'contact')
            ->assertJsonPath('data.contact_phone', '+91 81412 67610');
    }

    public function test_admin_can_update_page_content_with_patch(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/page-content/contact', $this->validContactPayload())
            ->assertOk()
            ->assertJsonPath('data.hero_title', 'Updated Contact Us')
            ->assertJsonPath('data.contact_phone', '+91 99999 99999');

        $this->assertDatabaseHas('page_contents', [
            'page_key' => 'contact',
            'hero_title' => 'Updated Contact Us',
            'contact_phone' => '+91 99999 99999',
        ]);
    }

    public function test_update_validation_rejects_invalid_email(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/page-content/contact', $this->validContactPayload([
                'contact_email' => 'not-an-email',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['contact_email']);
    }

    public function test_unknown_page_key_returns_404_for_admin(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/page-content/home')
            ->assertNotFound();
    }

    public function test_public_api_reflects_admin_page_content_update(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson('/api/admin/page-content/contact', $this->validContactPayload([
                'contact_phone' => '+91 88888 88888',
            ]))
            ->assertOk();

        $this->getJson('/api/page-content/contact')
            ->assertOk()
            ->assertJsonPath('data.contactPhone', '+91 88888 88888');
    }

    public function test_inactive_page_content_returns_404_on_public_api(): void
    {
        PageContent::where('page_key', PageContent::PAGE_KEY_CONTACT)->update(['is_active' => false]);

        $this->getJson('/api/page-content/contact')
            ->assertNotFound();

        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/page-content/contact')
            ->assertOk()
            ->assertJsonPath('data.is_active', false);
    }
}
