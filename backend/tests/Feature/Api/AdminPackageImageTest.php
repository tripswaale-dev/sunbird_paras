<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\PackageImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPackageImageTest extends TestCase
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
            'email' => 'admin-package-images@test.local',
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
            'email' => 'user-package-images@test.local',
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

    private function validImagePayload(array $overrides = []): array
    {
        return array_merge([
            'path' => '/images/gallery-1.jpg',
            'type' => 'gallery',
            'alt_text' => 'Gallery image alt text',
            'sort_order' => 0,
        ], $overrides);
    }

    private function createPackageWithoutImages(array $overrides = [], ?array $headers = null): Package
    {
        $headers ??= $this->adminHeaders($this->createAdmin());

        $this->postJson('/api/admin/packages', $this->validPackagePayload($overrides), $headers)
            ->assertCreated();

        return Package::where('slug', $overrides['slug'] ?? 'test-package')->first();
    }

    public function test_unauthenticated_user_cannot_list_images(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->getJson("/api/admin/packages/{$package->id}/images")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_image(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutImages(['slug' => 'no-image-auth'], $headers);

        Auth::forgetGuards();

        $this->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_show_image(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->where('type', 'hero')->first();

        $this->getJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_image(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->first();

        $this->patchJson("/api/admin/packages/{$package->id}/images/{$image->id}", [
            'alt_text' => 'Updated alt text',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_image(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->first();

        $this->deleteJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_images(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/packages/{$package->id}/images")
            ->assertForbidden();
    }

    public function test_admin_can_list_package_images(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/images")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('data.0.type', 'hero')
            ->assertJsonPath('data.0.alt_text', 'Kashmir Paradise');
    }

    public function test_images_are_ordered_by_sort_order(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $paths = collect(
            $this->withHeaders($this->adminHeaders())
                ->getJson("/api/admin/packages/{$package->id}/images")
                ->json('data')
        )->pluck('path')->all();

        $this->assertSame(
            'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
            $paths[0]
        );
        $this->assertSame('/Package details.jpg', $paths[1]);
    }

    public function test_list_returns_empty_array_for_package_without_images(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/images")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(0, 'data');
    }

    public function test_admin_can_show_image(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->where('type', 'hero')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.type', 'hero')
            ->assertJsonPath('data.alt_text', 'Kashmir Paradise')
            ->assertJsonPath('data.package_id', $package->id);
    }

    public function test_show_returns_404_for_nonexistent_image(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/images/99999")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_image_in_another_package(): void
    {
        $kashmir = Package::where('slug', 'kashmir-paradise')->first();
        $spiti = Package::where('slug', 'spiti-valley')->first();
        $kashmirImage = $kashmir->images()->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$spiti->id}/images/{$kashmirImage->id}")
            ->assertNotFound();
    }

    public function test_admin_can_create_image(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'image-create-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/new-gallery.jpg',
                'type' => 'gallery',
            ]))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.package_id', $package->id)
            ->assertJsonPath('data.path', '/images/new-gallery.jpg')
            ->assertJsonPath('data.type', 'gallery');

        $this->assertDatabaseHas('package_images', [
            'package_id' => $package->id,
            'path' => '/images/new-gallery.jpg',
            'type' => 'gallery',
        ]);
    }

    public function test_create_validation_fails_for_missing_required_fields(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'image-validation-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['path', 'type', 'sort_order']);
    }

    public function test_create_validation_rejects_invalid_type(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'image-type-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/invalid-type.jpg',
                'type' => 'banner',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type']);
    }

    public function test_create_fails_for_nonexistent_package(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages/99999/images', $this->validImagePayload())
            ->assertNotFound();
    }

    public function test_duplicate_path_is_rejected(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $existingPath = $package->images()->where('type', 'hero')->first()->path;

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => $existingPath,
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['path']);
    }

    public function test_package_id_cannot_be_injected_through_request_body(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'image-injection-test'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", array_merge(
                $this->validImagePayload(['path' => '/images/unique-injection.jpg']),
                ['package_id' => $otherPackage->id]
            ))
            ->assertCreated()
            ->assertJsonPath('data.package_id', $package->id);

        $this->assertDatabaseHas('package_images', [
            'package_id' => $package->id,
            'path' => '/images/unique-injection.jpg',
        ]);
        $this->assertDatabaseMissing('package_images', [
            'package_id' => $otherPackage->id,
            'path' => '/images/unique-injection.jpg',
        ]);
    }

    public function test_admin_can_update_image_with_put(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->where('type', 'hero')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}/images/{$image->id}", [
                'path' => $image->path,
                'type' => 'hero',
                'alt_text' => 'Updated Kashmir Paradise hero',
                'sort_order' => $image->sort_order,
            ])
            ->assertOk()
            ->assertJsonPath('data.alt_text', 'Updated Kashmir Paradise hero');
    }

    public function test_admin_can_partially_update_image_with_patch(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->where('type', 'gallery')->first();
        $originalPath = $image->path;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/images/{$image->id}", [
                'alt_text' => 'Patched gallery alt text',
            ])
            ->assertOk()
            ->assertJsonPath('data.alt_text', 'Patched gallery alt text')
            ->assertJsonPath('data.path', $originalPath);
    }

    public function test_update_validation_rejects_invalid_type(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/images/{$image->id}", [
                'type' => 'thumbnail',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type']);
    }

    public function test_update_returns_404_when_image_does_not_exist(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/images/99999", [
                'alt_text' => 'Missing image alt',
            ])
            ->assertNotFound();
    }

    public function test_package_id_cannot_be_changed_through_update(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'image-update-scope'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/scoped-image.jpg',
            ]))
            ->assertCreated();

        $image = PackageImage::where('path', '/images/scoped-image.jpg')->first();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/images/{$image->id}", [
                'package_id' => $otherPackage->id,
                'alt_text' => 'Scoped alt text update',
            ])
            ->assertOk()
            ->assertJsonPath('data.alt_text', 'Scoped alt text update');

        $this->assertDatabaseHas('package_images', [
            'id' => $image->id,
            'package_id' => $package->id,
            'alt_text' => 'Scoped alt text update',
        ]);
    }

    public function test_update_fails_with_duplicate_path(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $heroPath = $package->images()->where('type', 'hero')->first()->path;
        $galleryImage = $package->images()->where('type', 'gallery')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/images/{$galleryImage->id}", [
                'path' => $heroPath,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['path']);
    }

    public function test_updating_sort_order_changes_admin_and_public_ordering(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $firstGallery = $package->images()->where('path', '/Package details.jpg')->first();
        $lastGallery = $package->images()->where('path', '/Package details(4).jpg')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/images/{$lastGallery->id}", [
                'sort_order' => 1,
            ])
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/images/{$firstGallery->id}", [
                'sort_order' => 10,
            ])
            ->assertOk();

        $adminGalleryPaths = collect(
            $this->withHeaders($headers)
                ->getJson("/api/admin/packages/{$package->id}/images")
                ->json('data')
        )->where('type', 'gallery')->pluck('path')->values()->all();

        $publicGalleryPaths = collect(
            $this->getJson('/api/packages/kashmir-paradise')->json('data.images.gallery')
        )->pluck('path')->all();

        $this->assertSame('/Package details(4).jpg', $adminGalleryPaths[0]);
        $this->assertSame('/Package details(4).jpg', $publicGalleryPaths[0]);
    }

    public function test_created_image_appears_in_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'public-image-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/public-visible.jpg',
                'type' => 'gallery',
            ]))
            ->assertCreated();

        $publicGalleryPaths = collect(
            $this->getJson('/api/packages/public-image-test')->json('data.images.gallery')
        )->pluck('path')->all();

        $this->assertContains('/images/public-visible.jpg', $publicGalleryPaths);
    }

    public function test_deleted_image_is_removed_from_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'removable-image-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/removable-public.jpg',
            ]))
            ->assertCreated();

        $image = PackageImage::where('path', '/images/removable-public.jpg')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertOk();

        $publicGalleryPaths = collect(
            $this->getJson('/api/packages/removable-image-test')->json('data.images.gallery')
        )->pluck('path')->all();

        $this->assertNotContains('/images/removable-public.jpg', $publicGalleryPaths);
    }

    public function test_admin_can_delete_image(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'deletable-image-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/deletable.jpg',
            ]))
            ->assertCreated();

        $image = PackageImage::where('path', '/images/deletable.jpg')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('package_images', ['id' => $image->id]);
    }

    public function test_deleting_image_does_not_delete_package(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'package-safe-image-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/package-safe.jpg',
            ]))
            ->assertCreated();

        $image = PackageImage::where('path', '/images/package-safe.jpg')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'slug' => 'package-safe-image-test']);
    }

    public function test_deleting_kashmir_image_does_not_delete_detail_itinerary_or_faqs(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $image = $package->images()->where('type', 'hero')->first();

        $detailCount = $package->detail()->count();
        $itineraryCount = $package->itineraryDays()->count();
        $faqCount = $package->faqs()->count();
        $imageCount = $package->images()->count();

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertOk();

        $package->refresh();
        $this->assertSame($detailCount, $package->detail()->count());
        $this->assertSame($itineraryCount, $package->itineraryDays()->count());
        $this->assertSame($faqCount, $package->faqs()->count());
        $this->assertSame($imageCount - 1, $package->images()->count());
    }

    public function test_package_can_be_deleted_after_images_are_removed(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutImages(['slug' => 'image-delete-unblocks-package'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/images", $this->validImagePayload([
                'path' => '/images/blocking.jpg',
            ]))
            ->assertCreated();

        $image = PackageImage::where('path', '/images/blocking.jpg')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertStatus(409);

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/images/{$image->id}")
            ->assertOk();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertOk();

        $this->assertDatabaseMissing('packages', ['slug' => 'image-delete-unblocks-package']);
    }

    public function test_seeded_images_remain_intact(): void
    {
        $this->assertDatabaseCount('package_images', 6);

        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->assertSame(6, $package->images()->count());
        $this->assertSame(1, $package->images()->where('type', 'hero')->count());
        $this->assertSame(5, $package->images()->where('type', 'gallery')->count());
        $this->assertDatabaseHas('package_images', [
            'package_id' => $package->id,
            'type' => 'hero',
            'alt_text' => 'Kashmir Paradise',
        ]);
    }
}
