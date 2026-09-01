<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\PackageItineraryDay;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPackageItineraryDayTest extends TestCase
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
            'email' => 'admin-package-itinerary@test.local',
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
            'email' => 'user-package-itinerary@test.local',
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

    private function validItineraryPayload(array $overrides = []): array
    {
        return array_merge([
            'day' => 1,
            'title' => 'Arrival Day',
            'description' => 'Arrive and check in to your hotel.',
            'stay_information' => 'Overnight stay at hotel.',
            'notes' => 'Optional travel notes.',
            'images' => ['/images/day-1.jpg'],
            'sort_order' => 1,
        ], $overrides);
    }

    private function createPackageWithoutItinerary(array $overrides = [], ?array $headers = null): Package
    {
        $headers ??= $this->adminHeaders($this->createAdmin());

        $this->postJson('/api/admin/packages', $this->validPackagePayload($overrides), $headers)
            ->assertCreated();

        return Package::where('slug', $overrides['slug'] ?? 'test-package')->first();
    }

    public function test_unauthenticated_user_cannot_list_itinerary_days(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->getJson("/api/admin/packages/{$package->id}/itinerary")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_itinerary_day(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutItinerary(['slug' => 'no-itinerary-auth'], $headers);

        Auth::forgetGuards();

        $this->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_show_itinerary_day(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->first();

        $this->getJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_itinerary_day(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->first();

        $this->patchJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}", [
            'title' => 'Updated title',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_itinerary_day(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->first();

        $this->deleteJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_itinerary_days(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/packages/{$package->id}/itinerary")
            ->assertForbidden();
    }

    public function test_admin_can_list_package_itinerary_days(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/itinerary")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(7, 'data')
            ->assertJsonPath('data.0.day', 1)
            ->assertJsonPath('data.0.title', 'Arrival in Srinagar');
    }

    public function test_itinerary_days_are_ordered_by_sort_order(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $days = collect(
            $this->withHeaders($this->adminHeaders())
                ->getJson("/api/admin/packages/{$package->id}/itinerary")
                ->json('data')
        )->pluck('day')->all();

        $this->assertSame([1, 2, 3, 4, 5, 6, 7], $days);
    }

    public function test_list_returns_empty_array_for_package_without_itinerary_days(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/itinerary")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(0, 'data');
    }

    public function test_admin_can_show_itinerary_day(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->where('day', 3)->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.day', 3)
            ->assertJsonPath('data.title', 'Gulmarg Day Excursion');
    }

    public function test_show_returns_404_for_nonexistent_itinerary_day(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/itinerary/99999")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_itinerary_day_in_another_package(): void
    {
        $kashmir = Package::where('slug', 'kashmir-paradise')->first();
        $spiti = Package::where('slug', 'spiti-valley')->first();
        $kashmirDay = $kashmir->itineraryDays()->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$spiti->id}/itinerary/{$kashmirDay->id}")
            ->assertNotFound();
    }

    public function test_admin_can_create_itinerary_day(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'itinerary-create-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Day One Adventure',
            ]))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.package_id', $package->id)
            ->assertJsonPath('data.day', 1)
            ->assertJsonPath('data.title', 'Day One Adventure');

        $this->assertDatabaseHas('package_itinerary_days', [
            'package_id' => $package->id,
            'day' => 1,
            'title' => 'Day One Adventure',
        ]);
    }

    public function test_create_validation_fails_for_missing_required_fields(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'itinerary-validation-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['day', 'title', 'description', 'sort_order']);
    }

    public function test_create_fails_for_nonexistent_package(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages/99999/itinerary', $this->validItineraryPayload())
            ->assertNotFound();
    }

    public function test_duplicate_day_number_is_rejected(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Duplicate day one',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['day']);
    }

    public function test_package_id_cannot_be_injected_through_request_body(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'itinerary-injection-test'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", array_merge(
                $this->validItineraryPayload(['day' => 2]),
                ['package_id' => $otherPackage->id]
            ))
            ->assertCreated()
            ->assertJsonPath('data.package_id', $package->id);

        $this->assertDatabaseHas('package_itinerary_days', [
            'package_id' => $package->id,
            'day' => 2,
        ]);
        $this->assertDatabaseMissing('package_itinerary_days', [
            'package_id' => $otherPackage->id,
            'day' => 2,
        ]);
    }

    public function test_admin_can_update_itinerary_day_with_put(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->where('day', 2)->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}", [
                'day' => 2,
                'title' => 'Updated Srinagar Sightseeing',
                'description' => 'Updated full description for day two.',
                'stay_information' => 'Updated overnight stay in Srinagar.',
                'notes' => 'Updated notes.',
                'images' => ['/updated.jpg'],
                'sort_order' => 2,
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Srinagar Sightseeing')
            ->assertJsonPath('data.description', 'Updated full description for day two.');
    }

    public function test_admin_can_partially_update_itinerary_day_with_patch(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->where('day', 4)->first();
        $originalTitle = $day->title;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}", [
                'stay_information' => 'Patched stay information.',
            ])
            ->assertOk()
            ->assertJsonPath('data.stay_information', 'Patched stay information.')
            ->assertJsonPath('data.title', $originalTitle);
    }

    public function test_update_validation_rejects_invalid_array_items(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->where('day', 5)->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}", [
                'images' => [123],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['images.0']);
    }

    public function test_update_returns_404_when_itinerary_day_does_not_exist(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/99999", [
                'title' => 'Missing day',
            ])
            ->assertNotFound();
    }

    public function test_package_id_cannot_be_changed_through_update(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'itinerary-update-scope'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
            ]))
            ->assertCreated();

        $day = PackageItineraryDay::where('package_id', $package->id)->first();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}", [
                'package_id' => $otherPackage->id,
                'title' => 'Scoped title update',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Scoped title update');

        $this->assertDatabaseHas('package_itinerary_days', [
            'id' => $day->id,
            'package_id' => $package->id,
            'title' => 'Scoped title update',
        ]);
    }

    public function test_update_fails_with_duplicate_day_number(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->where('day', 7)->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}", [
                'day' => 1,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['day']);
    }

    public function test_updating_sort_order_changes_admin_and_public_ordering(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $dayTwo = $package->itineraryDays()->where('day', 2)->first();
        $daySeven = $package->itineraryDays()->where('day', 7)->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/{$daySeven->id}", [
                'sort_order' => 0,
            ])
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/itinerary/{$dayTwo->id}", [
                'sort_order' => 10,
            ])
            ->assertOk();

        $adminTitles = collect(
            $this->withHeaders($headers)
                ->getJson("/api/admin/packages/{$package->id}/itinerary")
                ->json('data')
        )->pluck('title')->all();

        $publicTitles = collect(
            $this->getJson('/api/packages/kashmir-paradise')->json('data.itinerary')
        )->pluck('title')->all();

        $this->assertSame('Departure', $adminTitles[0]);
        $this->assertSame('Departure', $publicTitles[0]);
    }

    public function test_created_itinerary_day_appears_in_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'public-itinerary-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Public Visible Day',
            ]))
            ->assertCreated();

        $publicTitles = collect(
            $this->getJson('/api/packages/public-itinerary-test')->json('data.itinerary')
        )->pluck('title')->all();

        $this->assertContains('Public Visible Day', $publicTitles);
    }

    public function test_deleted_itinerary_day_is_removed_from_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'removable-itinerary-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Removable Public Day',
            ]))
            ->assertCreated();

        $day = PackageItineraryDay::where('title', 'Removable Public Day')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertOk();

        $publicTitles = collect(
            $this->getJson('/api/packages/removable-itinerary-test')->json('data.itinerary')
        )->pluck('title')->all();

        $this->assertNotContains('Removable Public Day', $publicTitles);
    }

    public function test_admin_can_delete_itinerary_day(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'deletable-itinerary-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Deletable Day',
            ]))
            ->assertCreated();

        $day = PackageItineraryDay::where('title', 'Deletable Day')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('package_itinerary_days', ['id' => $day->id]);
    }

    public function test_deleting_itinerary_day_does_not_delete_package(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'package-safe-itinerary-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Package Safe Day',
            ]))
            ->assertCreated();

        $day = PackageItineraryDay::where('title', 'Package Safe Day')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'slug' => 'package-safe-itinerary-test']);
    }

    public function test_deleting_kashmir_itinerary_day_does_not_delete_detail_faqs_or_images(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $day = $package->itineraryDays()->where('day', 1)->first();

        $detailCount = $package->detail()->count();
        $faqCount = $package->faqs()->count();
        $imageCount = $package->images()->count();
        $itineraryCount = $package->itineraryDays()->count();

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertOk();

        $package->refresh();
        $this->assertSame($detailCount, $package->detail()->count());
        $this->assertSame($faqCount, $package->faqs()->count());
        $this->assertSame($imageCount, $package->images()->count());
        $this->assertSame($itineraryCount - 1, $package->itineraryDays()->count());
    }

    public function test_package_can_be_deleted_after_itinerary_is_removed(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutItinerary(['slug' => 'itinerary-delete-unblocks-package'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/itinerary", $this->validItineraryPayload([
                'day' => 1,
                'title' => 'Blocking Day',
            ]))
            ->assertCreated();

        $day = PackageItineraryDay::where('title', 'Blocking Day')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertStatus(409);

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/itinerary/{$day->id}")
            ->assertOk();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertOk();

        $this->assertDatabaseMissing('packages', ['slug' => 'itinerary-delete-unblocks-package']);
    }

    public function test_seeded_itinerary_days_remain_intact(): void
    {
        $this->assertDatabaseCount('package_itinerary_days', 7);

        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->assertSame(7, $package->itineraryDays()->count());
        $this->assertDatabaseHas('package_itinerary_days', [
            'package_id' => $package->id,
            'day' => 1,
            'title' => 'Arrival in Srinagar',
        ]);
        $this->assertDatabaseHas('package_itinerary_days', [
            'package_id' => $package->id,
            'day' => 7,
            'title' => 'Departure',
        ]);
    }
}
