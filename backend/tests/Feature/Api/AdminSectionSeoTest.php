<?php

namespace Tests\Feature\Api;

use App\Models\Section;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSectionSeoTest extends TestCase
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
            'email' => 'admin-section-seo@test.local',
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
            'email' => 'user-section-seo@test.local',
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

    private function validSeoPayload(array $overrides = []): array
    {
        return array_merge([
            'meta_title' => 'Popular Destinations | Sunbird Vacations',
            'meta_description' => 'Explore the most popular travel destinations with Sunbird Vacations.',
            'canonical_url' => 'https://sunbirdvacations.com/popular-destinations',
            'og_image' => 'https://example.com/og/popular-destinations.jpg',
            'is_indexable' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_show_section_seo(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->getJson("/api/admin/sections/{$section->id}/seo")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_section_seo_with_put(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->putJson("/api/admin/sections/{$section->id}/seo", $this->validSeoPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_section_seo_with_patch(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->patchJson("/api/admin/sections/{$section->id}/seo", [
            'meta_title' => 'Should not apply',
        ])->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_section_seo(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/sections/{$section->id}/seo")
            ->assertForbidden();
    }

    public function test_admin_can_show_section_seo(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/seo")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.section_id', $section->id)
            ->assertJsonPath('data.is_indexable', true)
            ->assertJsonPath('data.meta_title', null)
            ->assertJsonPath('data.meta_description', null)
            ->assertJsonPath('data.canonical_url', null)
            ->assertJsonPath('data.og_image', null);
    }

    public function test_show_returns_404_for_nonexistent_section(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/sections/99999/seo')
            ->assertNotFound();
    }

    public function test_admin_can_update_section_seo_with_put(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/sections/{$section->id}/seo", $this->validSeoPayload())
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.meta_title', 'Popular Destinations | Sunbird Vacations')
            ->assertJsonPath('data.canonical_url', 'https://sunbirdvacations.com/popular-destinations')
            ->assertJsonPath('data.is_indexable', true);

        $this->assertDatabaseHas('sections', [
            'id' => $section->id,
            'meta_title' => 'Popular Destinations | Sunbird Vacations',
            'canonical_url' => 'https://sunbirdvacations.com/popular-destinations',
        ]);
    }

    public function test_admin_can_partially_update_section_seo_with_patch(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/sections/{$section->id}/seo", $this->validSeoPayload([
                'meta_title' => 'Travel Your Way Original Title',
                'meta_description' => 'Original description',
                'canonical_url' => 'https://example.com/travel-your-way',
                'og_image' => 'https://example.com/travel-your-way.jpg',
            ]))
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/seo", [
                'meta_title' => 'Travel Your Way Updated Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.meta_title', 'Travel Your Way Updated Title')
            ->assertJsonPath('data.meta_description', 'Original description')
            ->assertJsonPath('data.canonical_url', 'https://example.com/travel-your-way');
    }

    public function test_update_validation_rejects_invalid_is_indexable(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/seo", [
                'is_indexable' => 'not-a-boolean',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['is_indexable']);
    }

    public function test_update_validation_rejects_overlong_canonical_url(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/seo", [
                'canonical_url' => str_repeat('a', 501),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['canonical_url']);
    }

    public function test_updated_seo_is_reflected_in_public_section_show(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/sections/{$section->id}/seo", $this->validSeoPayload())
            ->assertOk();

        $this->getJson('/api/sections/popular-destinations')
            ->assertOk()
            ->assertJsonPath('data.seo.meta_title', 'Popular Destinations | Sunbird Vacations')
            ->assertJsonPath('data.seo.meta_description', 'Explore the most popular travel destinations with Sunbird Vacations.')
            ->assertJsonPath('data.seo.canonical_url', 'https://sunbirdvacations.com/popular-destinations')
            ->assertJsonPath('data.seo.og_image', 'https://example.com/og/popular-destinations.jpg')
            ->assertJsonPath('data.seo.is_indexable', true);
    }

    public function test_is_indexable_false_is_reflected_in_public_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/seo", [
                'is_indexable' => false,
            ])
            ->assertOk()
            ->assertJsonPath('data.is_indexable', false);

        $this->getJson('/api/sections/gateway-to-the-hills')
            ->assertOk()
            ->assertJsonPath('data.seo.is_indexable', false);
    }

    public function test_seo_update_does_not_change_core_section_fields(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $originalTitle = $section->title;
        $originalSlug = $section->slug;
        $originalViewAllPath = $section->view_all_path;

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/sections/{$section->id}/seo", $this->validSeoPayload())
            ->assertOk();

        $section->refresh();
        $this->assertSame($originalTitle, $section->title);
        $this->assertSame($originalSlug, $section->slug);
        $this->assertSame($originalViewAllPath, $section->view_all_path);
    }

    public function test_core_section_patch_does_not_modify_seo_fields(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/sections/{$section->id}/seo", $this->validSeoPayload([
                'meta_title' => 'Best of India SEO Title',
            ]))
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}", [
                'title' => 'Best of India Updated Title',
                'meta_title' => 'Injected SEO title',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Best of India Updated Title');

        $section->refresh();
        $this->assertSame('Best of India SEO Title', $section->meta_title);
        $this->assertSame('Best of India Updated Title', $section->title);
    }

    public function test_put_allows_nullable_seo_text_fields(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/sections/{$section->id}/seo", [
                'meta_title' => null,
                'meta_description' => null,
                'canonical_url' => null,
                'og_image' => null,
                'is_indexable' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.meta_title', null)
            ->assertJsonPath('data.meta_description', null)
            ->assertJsonPath('data.canonical_url', null)
            ->assertJsonPath('data.og_image', null);
    }

    public function test_seeded_sections_have_is_indexable_true(): void
    {
        $this->assertSame(7, Section::where('is_indexable', true)->count());
        $this->assertSame(0, Section::where('is_indexable', false)->count());
    }
}
