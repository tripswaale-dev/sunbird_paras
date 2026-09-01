<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\PackageDetail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPackageDetailTest extends TestCase
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
            'email' => 'admin-package-details@test.local',
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
            'email' => 'user-package-details@test.local',
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

    private function validDetailPayload(array $overrides = []): array
    {
        return array_merge([
            'overview' => 'A wonderful travel experience.',
            'destinations' => ['Srinagar', 'Gulmarg'],
            'sightseeing' => ['Dal Lake', 'Mughal Gardens'],
            'inclusions' => ['Accommodation', 'Meals'],
            'exclusions' => ['Airfare'],
            'highlights' => ['Scenic views'],
        ], $overrides);
    }

    private function createPackageWithoutDetail(array $overrides = [], ?array $headers = null): Package
    {
        $headers ??= $this->adminHeaders($this->createAdmin());

        $this->postJson('/api/admin/packages', $this->validPackagePayload($overrides), $headers)
            ->assertCreated();

        return Package::where('slug', $overrides['slug'] ?? 'test-package')->first();
    }

    public function test_unauthenticated_user_cannot_show_package_detail(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->getJson("/api/admin/packages/{$package->id}/detail")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_package_detail(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'no-detail-auth'], $headers);

        Auth::forgetGuards();

        $this->postJson("/api/admin/packages/{$package->id}/detail", $this->validDetailPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_package_detail(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->patchJson("/api/admin/packages/{$package->id}/detail", [
            'overview' => 'Updated overview',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_package_detail(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->deleteJson("/api/admin/packages/{$package->id}/detail")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_package_details(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/packages/{$package->id}/detail")
            ->assertForbidden();
    }

    public function test_admin_can_show_package_detail(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/detail")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.package_id', $package->id)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'package_id',
                    'overview',
                    'destinations',
                    'sightseeing',
                    'inclusions',
                    'exclusions',
                    'highlights',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function test_show_returns_404_when_package_has_no_detail(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'no-detail-show'], $headers);

        $this->getJson("/api/admin/packages/{$package->id}/detail", $headers)
            ->assertNotFound();
    }

    public function test_admin_can_create_package_detail(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'detail-create-package'], $headers);

        $this->postJson("/api/admin/packages/{$package->id}/detail", $this->validDetailPayload(), $headers)
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.package_id', $package->id)
            ->assertJsonPath('data.overview', 'A wonderful travel experience.')
            ->assertJsonCount(2, 'data.destinations');

        $this->assertDatabaseHas('package_details', [
            'package_id' => $package->id,
            'overview' => 'A wonderful travel experience.',
        ]);
    }

    public function test_create_validation_rejects_non_array_json_fields(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'detail-invalid-json'], $headers);

        $this->postJson("/api/admin/packages/{$package->id}/detail", [
            'inclusions' => 'not-an-array',
        ], $headers)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['inclusions']);
    }

    public function test_create_fails_for_nonexistent_package(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages/99999/detail', $this->validDetailPayload())
            ->assertNotFound();
    }

    public function test_duplicate_detail_is_rejected(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/packages/{$package->id}/detail", $this->validDetailPayload())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['package_id']);
    }

    public function test_package_id_cannot_be_injected_through_request_body(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'detail-inject-package'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->postJson("/api/admin/packages/{$package->id}/detail", array_merge(
            $this->validDetailPayload(),
            ['package_id' => $otherPackage->id]
        ), $headers)
            ->assertCreated()
            ->assertJsonPath('data.package_id', $package->id);

        $this->assertDatabaseHas('package_details', [
            'package_id' => $package->id,
            'overview' => 'A wonderful travel experience.',
        ]);
        $this->assertDatabaseMissing('package_details', [
            'package_id' => $otherPackage->id,
            'overview' => 'A wonderful travel experience.',
        ]);
    }

    public function test_admin_can_update_package_detail_with_put(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $detail = $package->detail;

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}/detail", [
                'overview' => 'Updated Kashmir overview',
                'destinations' => ['Srinagar', 'Pahalgam'],
                'sightseeing' => ['Dal Lake'],
                'inclusions' => ['Breakfast', 'Dinner'],
                'exclusions' => ['Lunch'],
                'highlights' => ['Houseboat stay'],
            ])
            ->assertOk()
            ->assertJsonPath('data.overview', 'Updated Kashmir overview')
            ->assertJsonPath('data.destinations', ['Srinagar', 'Pahalgam']);
    }

    public function test_admin_can_partially_update_package_detail_with_patch(): void
    {
        $package = Package::where('slug', 'misty-kerala')->first();
        $originalOverview = $package->detail->overview;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/detail", [
                'inclusions' => ['Updated inclusion only'],
            ])
            ->assertOk()
            ->assertJsonPath('data.inclusions', ['Updated inclusion only'])
            ->assertJsonPath('data.overview', $originalOverview);
    }

    public function test_update_validation_rejects_invalid_array_items(): void
    {
        $package = Package::where('slug', 'misty-kerala')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/detail", [
                'highlights' => [123],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['highlights.0']);
    }

    public function test_update_returns_404_when_detail_does_not_exist(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'no-detail-update'], $headers);

        $this->patchJson("/api/admin/packages/{$package->id}/detail", [
            'overview' => 'Should not work',
        ], $headers)
            ->assertNotFound();
    }

    public function test_delete_returns_404_when_detail_does_not_exist(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'no-detail-delete'], $headers);

        $this->deleteJson("/api/admin/packages/{$package->id}/detail", [], $headers)
            ->assertNotFound();
    }

    public function test_admin_can_delete_package_detail(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'detail-delete-package'], $headers);

        $this->postJson("/api/admin/packages/{$package->id}/detail", $this->validDetailPayload(), $headers)
            ->assertCreated();

        $this->deleteJson("/api/admin/packages/{$package->id}/detail", [], $headers)
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('package_details', ['package_id' => $package->id]);
    }

    public function test_deleting_detail_does_not_delete_package(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'detail-package-persist'], $headers);

        $this->postJson("/api/admin/packages/{$package->id}/detail", $this->validDetailPayload(), $headers)
            ->assertCreated();

        $this->deleteJson("/api/admin/packages/{$package->id}/detail", [], $headers)
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'slug' => 'detail-package-persist']);
    }

    public function test_deleting_kashmir_detail_does_not_delete_itinerary_faqs_or_images(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $itineraryCount = $package->itineraryDays()->count();
        $faqCount = $package->faqs()->count();
        $imageCount = $package->images()->count();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/detail")
            ->assertOk();

        $package = $package->fresh();

        $this->assertDatabaseHas('packages', ['slug' => 'kashmir-paradise']);
        $this->assertNull($package->detail);
        $this->assertSame($itineraryCount, $package->itineraryDays()->count());
        $this->assertSame($faqCount, $package->faqs()->count());
        $this->assertSame($imageCount, $package->images()->count());
    }

    public function test_updated_inclusions_are_reflected_in_public_package_show(): void
    {
        $package = Package::where('slug', 'goa-waterfall-trail')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/detail", [
                'inclusions' => ['Public inclusion update'],
            ])
            ->assertOk();

        $this->getJson('/api/packages/goa-waterfall-trail')
            ->assertOk()
            ->assertJsonPath('data.detail.inclusions', ['Public inclusion update']);
    }

    public function test_updated_inclusions_are_reflected_in_section_package_listing(): void
    {
        $package = Package::where('slug', 'colors-of-rajasthan')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/detail", [
                'inclusions' => ['Section listing inclusion'],
            ])
            ->assertOk();

        $inclusions = collect(
            $this->getJson('/api/sections/popular-destinations/packages')->json('data.packages')
        )->firstWhere('slug', 'colors-of-rajasthan')['inclusions'] ?? null;

        $this->assertSame(['Section listing inclusion'], $inclusions);
    }

    public function test_package_can_be_deleted_after_detail_is_removed(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutDetail(['slug' => 'detail-then-delete-package'], $headers);

        $this->postJson("/api/admin/packages/{$package->id}/detail", $this->validDetailPayload(), $headers)
            ->assertCreated();

        $this->deleteJson("/api/admin/packages/{$package->id}/detail", [], $headers)
            ->assertOk();

        $this->deleteJson("/api/admin/packages/{$package->id}", [], $headers)
            ->assertOk();

        $this->assertDatabaseMissing('packages', ['slug' => 'detail-then-delete-package']);
    }

    public function test_package_with_section_assignment_still_blocked_after_detail_delete(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/detail")
            ->assertOk();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('packages', ['slug' => 'spiti-valley']);
    }

    public function test_seeded_package_details_remain_intact(): void
    {
        $this->assertDatabaseCount('package_details', 53);

        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->assertNotNull($package->detail);
        $this->assertNotEmpty($package->detail->overview);
        $this->assertNotEmpty($package->detail->inclusions);
    }
}
