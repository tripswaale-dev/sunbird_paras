<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPackageSeoTest extends TestCase
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
            'email' => 'admin-package-seo@test.local',
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
            'email' => 'user-package-seo@test.local',
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
            'meta_title' => 'Kashmir Paradise Tour | Sunbird Vacations',
            'meta_description' => 'Book the best Kashmir Paradise tour package with Sunbird Vacations.',
            'canonical_url' => 'https://sunbirdvacations.com/packages/kashmir-paradise',
            'og_image' => 'https://example.com/og/kashmir-paradise.jpg',
            'is_indexable' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_show_package_seo(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->getJson("/api/admin/packages/{$package->id}/seo")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_package_seo_with_put(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->putJson("/api/admin/packages/{$package->id}/seo", $this->validSeoPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_package_seo_with_patch(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->patchJson("/api/admin/packages/{$package->id}/seo", [
            'meta_title' => 'Should not apply',
        ])->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_package_seo(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/packages/{$package->id}/seo")
            ->assertForbidden();
    }

    public function test_admin_can_show_package_seo(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/seo")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.package_id', $package->id)
            ->assertJsonPath('data.is_indexable', true)
            ->assertJsonPath('data.meta_title', null)
            ->assertJsonPath('data.meta_description', null)
            ->assertJsonPath('data.canonical_url', null)
            ->assertJsonPath('data.og_image', null);
    }

    public function test_show_returns_404_for_nonexistent_package(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/packages/99999/seo')
            ->assertNotFound();
    }

    public function test_admin_can_update_package_seo_with_put(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}/seo", $this->validSeoPayload())
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.meta_title', 'Kashmir Paradise Tour | Sunbird Vacations')
            ->assertJsonPath('data.canonical_url', 'https://sunbirdvacations.com/packages/kashmir-paradise')
            ->assertJsonPath('data.is_indexable', true);

        $this->assertDatabaseHas('packages', [
            'id' => $package->id,
            'meta_title' => 'Kashmir Paradise Tour | Sunbird Vacations',
            'canonical_url' => 'https://sunbirdvacations.com/packages/kashmir-paradise',
        ]);
    }

    public function test_admin_can_partially_update_package_seo_with_patch(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/packages/{$package->id}/seo", $this->validSeoPayload([
                'meta_title' => 'Spiti Valley Original Title',
                'meta_description' => 'Original description',
                'canonical_url' => 'https://example.com/spiti',
                'og_image' => 'https://example.com/spiti.jpg',
            ]))
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/seo", [
                'meta_title' => 'Spiti Valley Updated Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.meta_title', 'Spiti Valley Updated Title')
            ->assertJsonPath('data.meta_description', 'Original description')
            ->assertJsonPath('data.canonical_url', 'https://example.com/spiti');
    }

    public function test_update_validation_rejects_invalid_is_indexable(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/seo", [
                'is_indexable' => 'not-a-boolean',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['is_indexable']);
    }

    public function test_update_validation_rejects_overlong_canonical_url(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/seo", [
                'canonical_url' => str_repeat('a', 501),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['canonical_url']);
    }

    public function test_updated_seo_is_reflected_in_public_package_show(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/packages/{$package->id}/seo", $this->validSeoPayload())
            ->assertOk();

        $this->getJson('/api/packages/kashmir-paradise')
            ->assertOk()
            ->assertJsonPath('data.seo.meta_title', 'Kashmir Paradise Tour | Sunbird Vacations')
            ->assertJsonPath('data.seo.meta_description', 'Book the best Kashmir Paradise tour package with Sunbird Vacations.')
            ->assertJsonPath('data.seo.canonical_url', 'https://sunbirdvacations.com/packages/kashmir-paradise')
            ->assertJsonPath('data.seo.og_image', 'https://example.com/og/kashmir-paradise.jpg')
            ->assertJsonPath('data.seo.is_indexable', true);
    }

    public function test_is_indexable_false_is_reflected_in_public_api(): void
    {
        $package = Package::where('slug', 'colors-of-rajasthan')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/seo", [
                'is_indexable' => false,
            ])
            ->assertOk()
            ->assertJsonPath('data.is_indexable', false);

        $this->getJson('/api/packages/colors-of-rajasthan')
            ->assertOk()
            ->assertJsonPath('data.seo.is_indexable', false);
    }

    public function test_seo_update_does_not_change_core_package_fields(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $originalTitle = $package->title;
        $originalSlug = $package->slug;
        $originalPrice = $package->price;

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}/seo", $this->validSeoPayload())
            ->assertOk();

        $package->refresh();
        $this->assertSame($originalTitle, $package->title);
        $this->assertSame($originalSlug, $package->slug);
        $this->assertSame($originalPrice, $package->price);
    }

    public function test_core_package_patch_does_not_modify_seo_fields(): void
    {
        $package = Package::where('slug', 'heavenly-kashmir')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/packages/{$package->id}/seo", $this->validSeoPayload([
                'meta_title' => 'Heavenly Kashmir SEO Title',
            ]))
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}", [
                'title' => 'Heavenly Kashmir Updated Title',
                'meta_title' => 'Injected SEO title',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Heavenly Kashmir Updated Title');

        $package->refresh();
        $this->assertSame('Heavenly Kashmir SEO Title', $package->meta_title);
        $this->assertSame('Heavenly Kashmir Updated Title', $package->title);
    }

    public function test_put_allows_nullable_seo_text_fields(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->putJson("/api/admin/packages/{$package->id}/seo", [
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

    public function test_seeded_packages_have_is_indexable_true(): void
    {
        $this->assertSame(53, Package::where('is_indexable', true)->count());
        $this->assertSame(0, Package::where('is_indexable', false)->count());
    }
}
