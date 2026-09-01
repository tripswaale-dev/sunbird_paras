<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\Section;
use App\Models\SectionPackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSectionPackageTest extends TestCase
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
            'email' => 'admin-section-packages@test.local',
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
            'email' => 'user-section-packages@test.local',
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

    private function createIsolatedPackage(array $overrides = []): Package
    {
        return Package::create(array_merge([
            'slug' => 'isolated-package-'.uniqid(),
            'title' => 'Isolated Package',
            'subtitle' => 'Test package',
            'location' => 'Test Location',
            'price' => 9999,
            'duration_nights' => 3,
            'duration_days' => 4,
            'category' => 'Mountains',
            'tag' => 'Adventure',
            'image' => '/images/test.jpg',
            'is_active' => true,
        ], $overrides));
    }

    public function test_unauthenticated_user_cannot_list_section_packages(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();

        $this->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_assign_package(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();
        $package = $this->createIsolatedPackage();

        $this->postJson("/api/admin/sections/{$section->id}/packages", [
            'package_id' => $package->id,
            'display_order' => 1,
            'is_featured' => false,
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_assignment(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->patchJson("/api/admin/sections/{$section->id}/packages/{$package->id}", [
            'display_order' => 99,
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_remove_assignment(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->deleteJson("/api/admin/sections/{$section->id}/packages/{$package->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_section_packages(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $section = Section::where('slug', 'best-of-india')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertForbidden();
    }

    public function test_admin_can_manage_section_packages(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_list_section_packages(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(14, 'data');
    }

    public function test_section_packages_are_ordered_by_display_order(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();

        $response = $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertOk();

        $slugs = collect($response->json('data'))->pluck('slug')->all();

        $this->assertSame('golden-triangle', $slugs[0]);
        $this->assertSame('river-retreat-haridwar-rishikesh', $slugs[13]);
    }

    public function test_section_packages_include_pivot_fields(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'spiti-valley')->first();

        $response = $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertOk();

        $assignment = collect($response->json('data'))
            ->firstWhere('slug', 'spiti-valley');

        $this->assertNotNull($assignment);
        $this->assertSame($package->id, $assignment['id']);
        $this->assertArrayHasKey('display_order', $assignment);
        $this->assertArrayHasKey('is_featured', $assignment);
        $this->assertSame(0, $assignment['display_order']);
        $this->assertFalse($assignment['is_featured']);
    }

    public function test_admin_can_assign_package_to_section(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();
        $package = $this->createIsolatedPackage(['slug' => 'assignable-package']);

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 10,
                'is_featured' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'assignable-package')
            ->assertJsonPath('data.display_order', 10)
            ->assertJsonPath('data.is_featured', true);

        $this->assertDatabaseHas('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
            'display_order' => 10,
            'is_featured' => true,
        ]);
    }

    public function test_assign_fails_for_nonexistent_section(): void
    {
        $package = $this->createIsolatedPackage();

        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/sections/99999/packages', [
                'package_id' => $package->id,
                'display_order' => 1,
            ])
            ->assertNotFound();
    }

    public function test_assign_fails_for_nonexistent_package(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => 99999,
                'display_order' => 1,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['package_id']);
    }

    public function test_duplicate_assignment_fails(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 5,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['package_id']);

        $this->assertDatabaseCount('section_packages', 53);
    }

    public function test_inactive_package_can_be_assigned(): void
    {
        $section = Section::where('slug', 'best-of-india')->first();
        $package = $this->createIsolatedPackage([
            'slug' => 'inactive-assignable',
            'is_active' => false,
        ]);

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 20,
                'is_featured' => false,
            ])
            ->assertCreated()
            ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
        ]);
    }

    public function test_inactive_section_can_be_managed(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $section->update(['is_active' => false]);
        $package = $this->createIsolatedPackage(['slug' => 'inactive-section-package']);
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->getJson("/api/admin/sections/{$section->id}/packages")
            ->assertOk()
            ->assertJsonCount(12, 'data');

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 50,
            ])
            ->assertCreated();

        $this->getJson('/api/sections/popular-destinations')->assertNotFound();
    }

    public function test_admin_can_update_display_order(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/packages/{$package->id}", [
                'display_order' => 99,
            ])
            ->assertOk()
            ->assertJsonPath('data.display_order', 99);

        $this->assertDatabaseHas('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
            'display_order' => 99,
        ]);
    }

    public function test_admin_can_update_featured_status(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'heavenly-kashmir')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/packages/{$package->id}", [
                'is_featured' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.is_featured', true);

        $this->assertDatabaseHas('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
            'is_featured' => true,
        ]);
    }

    public function test_package_id_cannot_be_changed_through_update(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'spiti-valley')->first();
        $otherPackage = Package::where('slug', 'heavenly-kashmir')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/packages/{$package->id}", [
                'package_id' => $otherPackage->id,
                'display_order' => 5,
            ])
            ->assertOk()
            ->assertJsonPath('data.id', $package->id)
            ->assertJsonPath('data.slug', 'spiti-valley')
            ->assertJsonPath('data.display_order', 5);

        $this->assertDatabaseHas('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
        ]);
        $this->assertDatabaseMissing('section_packages', [
            'section_id' => $section->id,
            'package_id' => $otherPackage->id,
            'display_order' => 5,
        ]);
    }

    public function test_section_id_cannot_be_changed_through_update(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $otherSection = Section::where('slug', 'best-of-india')->first();
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/packages/{$package->id}", [
                'section_id' => $otherSection->id,
                'is_featured' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.is_featured', true);

        $this->assertDatabaseHas('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
            'is_featured' => true,
        ]);
        $this->assertDatabaseMissing('section_packages', [
            'section_id' => $otherSection->id,
            'package_id' => $package->id,
        ]);
    }

    public function test_admin_can_remove_assignment(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = $this->createIsolatedPackage(['slug' => 'removable-package']);

        SectionPackage::create([
            'section_id' => $section->id,
            'package_id' => $package->id,
            'display_order' => 3,
            'is_featured' => false,
        ]);

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/sections/{$section->id}/packages/{$package->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('section_packages', [
            'section_id' => $section->id,
            'package_id' => $package->id,
        ]);
    }

    public function test_removing_assignment_does_not_delete_package(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = $this->createIsolatedPackage(['slug' => 'persist-after-remove']);

        SectionPackage::create([
            'section_id' => $section->id,
            'package_id' => $package->id,
            'display_order' => 1,
            'is_featured' => false,
        ]);

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/sections/{$section->id}/packages/{$package->id}")
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'slug' => 'persist-after-remove']);
    }

    public function test_removing_assignment_does_not_delete_section(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = $this->createIsolatedPackage(['slug' => 'section-persist-test']);

        SectionPackage::create([
            'section_id' => $section->id,
            'package_id' => $package->id,
            'display_order' => 2,
            'is_featured' => false,
        ]);

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/sections/{$section->id}/packages/{$package->id}")
            ->assertOk();

        $this->assertDatabaseHas('sections', ['id' => $section->id, 'slug' => 'gateway-to-the-hills']);
    }

    public function test_dependent_package_data_remains_intact_after_removing_assignment(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $detailCount = $package->detail()->count();
        $itineraryCount = $package->itineraryDays()->count();
        $faqCount = $package->faqs()->count();
        $imageCount = $package->images()->count();

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 99,
                'is_featured' => true,
            ])
            ->assertCreated();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/packages/{$package->id}")
            ->assertOk();

        $package = $package->fresh();

        $this->assertDatabaseHas('packages', ['slug' => 'kashmir-paradise']);
        $this->assertSame($detailCount, $package->detail()->count());
        $this->assertSame($itineraryCount, $package->itineraryDays()->count());
        $this->assertSame($faqCount, $package->faqs()->count());
        $this->assertSame($imageCount, $package->images()->count());
    }

    public function test_assignment_appears_in_public_section_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = $this->createIsolatedPackage(['slug' => 'public-visible-package']);
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 0,
                'is_featured' => false,
            ])
            ->assertCreated();

        $publicSlugs = collect(
            $this->getJson('/api/sections/gateway-to-the-hills/packages')->json('data.packages')
        )->pluck('slug')->all();

        $this->assertContains('public-visible-package', $publicSlugs);
    }

    public function test_assignment_order_is_reflected_in_public_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $first = $this->createIsolatedPackage(['slug' => 'order-first-package']);
        $second = $this->createIsolatedPackage(['slug' => 'order-second-package']);

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $second->id,
                'display_order' => 0,
            ])
            ->assertCreated();

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $first->id,
                'display_order' => 1,
            ])
            ->assertCreated();

        $publicSlugs = collect(
            $this->getJson('/api/sections/gateway-to-the-hills/packages')->json('data.packages')
        )->pluck('slug')->all();

        $secondIndex = array_search('order-second-package', $publicSlugs, true);
        $firstIndex = array_search('order-first-package', $publicSlugs, true);

        $this->assertNotFalse($secondIndex);
        $this->assertNotFalse($firstIndex);
        $this->assertLessThan($firstIndex, $secondIndex);
    }

    public function test_removing_assignment_removes_package_from_public_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = $this->createIsolatedPackage(['slug' => 'public-removable-package']);
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 5,
            ])
            ->assertCreated();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/packages/{$package->id}")
            ->assertOk();

        $publicSlugs = collect(
            $this->getJson('/api/sections/gateway-to-the-hills/packages')->json('data.packages')
        )->pluck('slug')->all();

        $this->assertNotContains('public-removable-package', $publicSlugs);
    }

    public function test_inactive_package_remains_hidden_from_public_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = $this->createIsolatedPackage([
            'slug' => 'inactive-public-hidden',
            'is_active' => false,
        ]);
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/packages", [
                'package_id' => $package->id,
                'display_order' => 0,
            ])
            ->assertCreated();

        $adminSlugs = collect(
            $this->withHeaders($headers)
                ->getJson("/api/admin/sections/{$section->id}/packages")
                ->json('data')
        )->pluck('slug')->all();

        $publicSlugs = collect(
            $this->getJson('/api/sections/gateway-to-the-hills/packages')->json('data.packages')
        )->pluck('slug')->all();

        $this->assertContains('inactive-public-hidden', $adminSlugs);
        $this->assertNotContains('inactive-public-hidden', $publicSlugs);
    }
}
