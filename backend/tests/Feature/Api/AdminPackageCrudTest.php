<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPackageCrudTest extends TestCase
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
            'email' => 'admin-packages@test.local',
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
            'email' => 'user-packages@test.local',
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

    private function validPackagePayload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'test-package',
            'title' => 'Test Package',
            'subtitle' => 'A test package',
            'location' => 'Test Location',
            'price' => 19999,
            'duration_nights' => 5,
            'duration_days' => 6,
            'category' => 'Mountains',
            'tag' => 'Adventure',
            'image' => '/images/test.jpg',
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_packages(): void
    {
        $this->getJson('/api/admin/packages')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_package(): void
    {
        $this->postJson('/api/admin/packages', $this->validPackagePayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_package(): void
    {
        $package = Package::first();

        $this->putJson("/api/admin/packages/{$package->id}", ['title' => 'Updated'])
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_package(): void
    {
        $package = Package::first();

        $this->deleteJson("/api/admin/packages/{$package->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_packages(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/packages')
            ->assertForbidden();
    }

    public function test_admin_can_list_packages(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/packages')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data',
                'meta' => ['current_page', 'per_page', 'total', 'last_page'],
            ])
            ->assertJsonPath('meta.total', 53);
    }

    public function test_admin_list_pagination_works(): void
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/packages?per_page=10&page=2')
            ->assertOk();

        $this->assertSame(10, $response->json('meta.per_page'));
        $this->assertSame(2, $response->json('meta.current_page'));
        $this->assertCount(10, $response->json('data'));
    }

    public function test_admin_list_search_works(): void
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/packages?search=kashmir')
            ->assertOk();

        $slugs = collect($response->json('data'))->pluck('slug')->all();

        $this->assertContains('kashmir-paradise', $slugs);
        $this->assertContains('heavenly-kashmir', $slugs);
    }

    public function test_admin_list_category_filter_works(): void
    {
        $response = $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/packages?category=Pilgrimage')
            ->assertOk();

        $categories = collect($response->json('data'))->pluck('category')->unique()->all();
        $this->assertSame(['Pilgrimage'], $categories);
    }

    public function test_admin_list_active_filter_works(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);

        $this->withHeaders($headers)
            ->postJson('/api/admin/packages', $this->validPackagePayload([
                'slug' => 'inactive-package',
                'is_active' => false,
            ]))
            ->assertCreated();

        $inactiveResponse = $this->withHeaders($headers)
            ->getJson('/api/admin/packages?is_active=0')
            ->assertOk();

        $inactiveSlugs = collect($inactiveResponse->json('data'))->pluck('slug')->all();
        $this->assertContains('inactive-package', $inactiveSlugs);

        $activeResponse = $this->withHeaders($headers)
            ->getJson('/api/admin/packages?is_active=1&per_page=50')
            ->assertOk();

        $activeSlugs = collect($activeResponse->json('data'))->pluck('slug')->all();
        $this->assertNotContains('inactive-package', $activeSlugs);
        $this->assertContains('spiti-valley', $activeSlugs);
        $this->assertTrue(
            collect($activeResponse->json('data'))->every(fn ($pkg) => $pkg['is_active'] === true)
        );
    }

    public function test_admin_can_create_package(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages', $this->validPackagePayload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'test-package')
            ->assertJsonPath('data.price', 19999)
            ->assertJsonPath('data.duration.nights', 5);

        $this->assertDatabaseHas('packages', ['slug' => 'test-package', 'price' => 19999]);
    }

    public function test_create_fails_with_missing_required_fields(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'slug', 'title', 'price', 'duration_nights', 'duration_days', 'image',
            ]);
    }

    public function test_create_fails_with_duplicate_slug(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages', $this->validPackagePayload([
                'slug' => 'spiti-valley',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_create_fails_with_invalid_price(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/packages', $this->validPackagePayload([
                'slug' => 'invalid-price-package-1',
                'price' => '₹7,999',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['price']);

        $this->withHeaders($headers)
            ->postJson('/api/admin/packages', $this->validPackagePayload([
                'slug' => 'invalid-price-package-2',
                'price' => -100,
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['price']);
    }

    public function test_create_fails_with_invalid_duration(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages', $this->validPackagePayload([
                'duration_nights' => -1,
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['duration_nights']);
    }

    public function test_admin_can_show_package(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}")
            ->assertOk()
            ->assertJsonPath('data.slug', 'spiti-valley')
            ->assertJsonStructure([
                'data' => [
                    'id', 'slug', 'title', 'subtitle', 'location', 'price',
                    'duration', 'category', 'tag', 'image', 'is_active',
                    'created_at', 'updated_at',
                ],
            ]);
    }

    public function test_show_returns_404_for_nonexistent_id(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/packages/99999')
            ->assertNotFound();
    }

    public function test_admin_can_update_package_with_put(): void
    {
        $package = Package::where('slug', 'heavenly-kashmir')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}", [
                'slug' => 'heavenly-kashmir',
                'title' => 'Heavenly Kashmir Updated',
                'subtitle' => $package->subtitle,
                'location' => $package->location,
                'price' => 25999,
                'duration_nights' => 6,
                'duration_days' => 7,
                'category' => $package->category,
                'tag' => $package->tag,
                'image' => $package->image,
                'is_active' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Heavenly Kashmir Updated')
            ->assertJsonPath('data.price', 25999);
    }

    public function test_admin_can_partially_update_package_with_patch(): void
    {
        $package = Package::where('slug', 'andaman-escape')->first();
        $originalPrice = $package->price;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}", [
                'title' => 'Andaman Escape Updated',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Andaman Escape Updated')
            ->assertJsonPath('data.price', $originalPrice);
    }

    public function test_update_allows_unchanged_own_slug(): void
    {
        $package = Package::where('slug', 'misty-kerala')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}", [
                'slug' => 'misty-kerala',
                'title' => 'Misty Kerala Updated',
            ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'misty-kerala');
    }

    public function test_update_fails_with_duplicate_slug_on_another_package(): void
    {
        $package = Package::where('slug', 'goa-waterfall-trail')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}", [
                'slug' => 'spiti-valley',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_deactivated_package_disappears_from_public_api(): void
    {
        $package = Package::where('slug', 'colors-of-rajasthan')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}", ['is_active' => false])
            ->assertOk();

        $publicSlugs = collect($this->getJson('/api/packages?per_page=50')->json('data'))
            ->pluck('slug')
            ->all();

        $this->assertNotContains('colors-of-rajasthan', $publicSlugs);
        $this->getJson('/api/packages/colors-of-rajasthan')->assertNotFound();
    }

    public function test_admin_can_delete_package_without_dependencies(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/packages', $this->validPackagePayload([
                'slug' => 'empty-package',
            ]))
            ->assertCreated();

        $package = Package::where('slug', 'empty-package')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('packages', ['slug' => 'empty-package']);
    }

    public function test_cannot_delete_package_with_dependencies(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertStatus(409)
            ->assertJsonPath('success', false);

        $this->assertDatabaseHas('packages', ['slug' => 'spiti-valley']);
        $this->assertDatabaseHas('section_packages', ['package_id' => $package->id]);
        $this->assertDatabaseHas('package_details', ['package_id' => $package->id]);
    }

    public function test_dependent_records_remain_when_deletion_is_blocked(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $detailCount = $package->detail()->count();
        $itineraryCount = $package->itineraryDays()->count();
        $faqCount = $package->faqs()->count();
        $imageCount = $package->images()->count();
        $sectionPivotCount = $package->sectionPackages()->count();

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('packages', ['slug' => 'kashmir-paradise']);
        $this->assertSame($detailCount, $package->fresh()->detail()->count());
        $this->assertSame($itineraryCount, $package->fresh()->itineraryDays()->count());
        $this->assertSame($faqCount, $package->fresh()->faqs()->count());
        $this->assertSame($imageCount, $package->fresh()->images()->count());
        $this->assertSame($sectionPivotCount, $package->fresh()->sectionPackages()->count());
    }
}
