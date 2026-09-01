<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\PackageFaq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPackageFaqTest extends TestCase
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
            'email' => 'admin-package-faqs@test.local',
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
            'email' => 'user-package-faqs@test.local',
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

    private function validFaqPayload(array $overrides = []): array
    {
        return array_merge([
            'question' => 'What is included in this package?',
            'answer' => 'Accommodation, meals, and sightseeing as per itinerary.',
            'sort_order' => 0,
        ], $overrides);
    }

    private function createPackageWithoutFaqs(array $overrides = [], ?array $headers = null): Package
    {
        $headers ??= $this->adminHeaders($this->createAdmin());

        $this->postJson('/api/admin/packages', $this->validPackagePayload($overrides), $headers)
            ->assertCreated();

        return Package::where('slug', $overrides['slug'] ?? 'test-package')->first();
    }

    public function test_unauthenticated_user_cannot_list_faqs(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->getJson("/api/admin/packages/{$package->id}/faqs")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_faq(): void
    {
        $admin = $this->createAdmin();
        $headers = $this->adminHeaders($admin);
        $package = $this->createPackageWithoutFaqs(['slug' => 'no-faq-auth'], $headers);

        Auth::forgetGuards();

        $this->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_show_faq(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->first();

        $this->getJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_faq(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->first();

        $this->patchJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}", [
            'answer' => 'Updated answer',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_faq(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->first();

        $this->deleteJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_faqs(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/packages/{$package->id}/faqs")
            ->assertForbidden();
    }

    public function test_admin_can_list_package_faqs(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/faqs")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.question', 'What is the best time to visit Kashmir?');
    }

    public function test_faqs_are_ordered_by_sort_order(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $questions = collect(
            $this->withHeaders($this->adminHeaders())
                ->getJson("/api/admin/packages/{$package->id}/faqs")
                ->json('data')
        )->pluck('question')->all();

        $this->assertSame([
            'What is the best time to visit Kashmir?',
            'Is the Gondola ride included in the package?',
            'Are Union cabs required for local sightseeing?',
        ], $questions);
    }

    public function test_list_returns_empty_array_for_package_without_faqs(): void
    {
        $package = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/faqs")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(0, 'data');
    }

    public function test_admin_can_show_faq(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->where('question', 'Is the Gondola ride included in the package?')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.question', 'Is the Gondola ride included in the package?')
            ->assertJsonPath('data.package_id', $package->id);
    }

    public function test_show_returns_404_for_nonexistent_faq(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$package->id}/faqs/99999")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_faq_in_another_package(): void
    {
        $kashmir = Package::where('slug', 'kashmir-paradise')->first();
        $spiti = Package::where('slug', 'spiti-valley')->first();
        $kashmirFaq = $kashmir->faqs()->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/packages/{$spiti->id}/faqs/{$kashmirFaq->id}")
            ->assertNotFound();
    }

    public function test_admin_can_create_faq(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'faq-create-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'How do I book this package?',
                'sort_order' => 1,
            ]))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.package_id', $package->id)
            ->assertJsonPath('data.question', 'How do I book this package?');

        $this->assertDatabaseHas('package_faqs', [
            'package_id' => $package->id,
            'question' => 'How do I book this package?',
        ]);
    }

    public function test_create_validation_fails_for_missing_required_fields(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'faq-validation-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question', 'answer', 'sort_order']);
    }

    public function test_create_fails_for_nonexistent_package(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/packages/99999/faqs', $this->validFaqPayload())
            ->assertNotFound();
    }

    public function test_duplicate_question_is_rejected(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'What is the best time to visit Kashmir?',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question']);
    }

    public function test_package_id_cannot_be_injected_through_request_body(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'faq-injection-test'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", array_merge(
                $this->validFaqPayload(['question' => 'Unique injection question?']),
                ['package_id' => $otherPackage->id]
            ))
            ->assertCreated()
            ->assertJsonPath('data.package_id', $package->id);

        $this->assertDatabaseHas('package_faqs', [
            'package_id' => $package->id,
            'question' => 'Unique injection question?',
        ]);
        $this->assertDatabaseMissing('package_faqs', [
            'package_id' => $otherPackage->id,
            'question' => 'Unique injection question?',
        ]);
    }

    public function test_admin_can_update_faq_with_put(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->where('question', 'Is the Gondola ride included in the package?')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}", [
                'question' => 'Is the Gondola ride included in the package?',
                'answer' => 'Updated: Gondola tickets must be booked separately.',
                'sort_order' => $faq->sort_order,
            ])
            ->assertOk()
            ->assertJsonPath('data.answer', 'Updated: Gondola tickets must be booked separately.');
    }

    public function test_admin_can_partially_update_faq_with_patch(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->where('question', 'Are Union cabs required for local sightseeing?')->first();
        $originalQuestion = $faq->question;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}", [
                'answer' => 'Patched answer about union cabs.',
            ])
            ->assertOk()
            ->assertJsonPath('data.answer', 'Patched answer about union cabs.')
            ->assertJsonPath('data.question', $originalQuestion);
    }

    public function test_update_validation_rejects_invalid_sort_order(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}", [
                'sort_order' => -1,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sort_order']);
    }

    public function test_update_returns_404_when_faq_does_not_exist(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/faqs/99999", [
                'answer' => 'Missing FAQ answer',
            ])
            ->assertNotFound();
    }

    public function test_package_id_cannot_be_changed_through_update(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'faq-update-scope'], $headers);
        $otherPackage = Package::where('slug', 'spiti-valley')->first();

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'Scoped FAQ question?',
            ]))
            ->assertCreated();

        $faq = PackageFaq::where('question', 'Scoped FAQ question?')->first();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}", [
                'package_id' => $otherPackage->id,
                'answer' => 'Scoped answer update',
            ])
            ->assertOk()
            ->assertJsonPath('data.answer', 'Scoped answer update');

        $this->assertDatabaseHas('package_faqs', [
            'id' => $faq->id,
            'package_id' => $package->id,
            'answer' => 'Scoped answer update',
        ]);
    }

    public function test_update_fails_with_duplicate_question(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->where('question', 'Are Union cabs required for local sightseeing?')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}", [
                'question' => 'What is the best time to visit Kashmir?',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question']);
    }

    public function test_updating_sort_order_changes_admin_and_public_ordering(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $firstFaq = $package->faqs()->where('question', 'What is the best time to visit Kashmir?')->first();
        $lastFaq = $package->faqs()->where('question', 'Are Union cabs required for local sightseeing?')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/faqs/{$lastFaq->id}", [
                'sort_order' => 0,
            ])
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/packages/{$package->id}/faqs/{$firstFaq->id}", [
                'sort_order' => 10,
            ])
            ->assertOk();

        $adminQuestions = collect(
            $this->withHeaders($headers)
                ->getJson("/api/admin/packages/{$package->id}/faqs")
                ->json('data')
        )->pluck('question')->all();

        $publicQuestions = collect(
            $this->getJson('/api/packages/kashmir-paradise')->json('data.faqs')
        )->pluck('question')->all();

        $this->assertSame('Are Union cabs required for local sightseeing?', $adminQuestions[0]);
        $this->assertSame('Are Union cabs required for local sightseeing?', $publicQuestions[0]);
    }

    public function test_created_faq_appears_in_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'public-faq-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'Public Visible FAQ?',
            ]))
            ->assertCreated();

        $publicQuestions = collect(
            $this->getJson('/api/packages/public-faq-test')->json('data.faqs')
        )->pluck('question')->all();

        $this->assertContains('Public Visible FAQ?', $publicQuestions);
    }

    public function test_deleted_faq_is_removed_from_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'removable-faq-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'Removable Public FAQ?',
            ]))
            ->assertCreated();

        $faq = PackageFaq::where('question', 'Removable Public FAQ?')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertOk();

        $publicQuestions = collect(
            $this->getJson('/api/packages/removable-faq-test')->json('data.faqs')
        )->pluck('question')->all();

        $this->assertNotContains('Removable Public FAQ?', $publicQuestions);
    }

    public function test_admin_can_delete_faq(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'deletable-faq-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'Deletable FAQ?',
            ]))
            ->assertCreated();

        $faq = PackageFaq::where('question', 'Deletable FAQ?')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('package_faqs', ['id' => $faq->id]);
    }

    public function test_deleting_faq_does_not_delete_package(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'package-safe-faq-test'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'Package Safe FAQ?',
            ]))
            ->assertCreated();

        $faq = PackageFaq::where('question', 'Package Safe FAQ?')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'slug' => 'package-safe-faq-test']);
    }

    public function test_deleting_kashmir_faq_does_not_delete_detail_itinerary_or_images(): void
    {
        $package = Package::where('slug', 'kashmir-paradise')->first();
        $faq = $package->faqs()->first();

        $detailCount = $package->detail()->count();
        $itineraryCount = $package->itineraryDays()->count();
        $imageCount = $package->images()->count();
        $faqCount = $package->faqs()->count();

        $this->withHeaders($this->adminHeaders())
            ->deleteJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertOk();

        $package->refresh();
        $this->assertSame($detailCount, $package->detail()->count());
        $this->assertSame($itineraryCount, $package->itineraryDays()->count());
        $this->assertSame($imageCount, $package->images()->count());
        $this->assertSame($faqCount - 1, $package->faqs()->count());
    }

    public function test_package_can_be_deleted_after_faqs_are_removed(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());
        $package = $this->createPackageWithoutFaqs(['slug' => 'faq-delete-unblocks-package'], $headers);

        $this->withHeaders($headers)
            ->postJson("/api/admin/packages/{$package->id}/faqs", $this->validFaqPayload([
                'question' => 'Blocking FAQ?',
            ]))
            ->assertCreated();

        $faq = PackageFaq::where('question', 'Blocking FAQ?')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertStatus(409);

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}/faqs/{$faq->id}")
            ->assertOk();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertOk();

        $this->assertDatabaseMissing('packages', ['slug' => 'faq-delete-unblocks-package']);
    }

    public function test_seeded_faqs_remain_intact(): void
    {
        $this->assertDatabaseCount('package_faqs', 3);

        $package = Package::where('slug', 'kashmir-paradise')->first();

        $this->assertSame(3, $package->faqs()->count());
        $this->assertDatabaseHas('package_faqs', [
            'package_id' => $package->id,
            'question' => 'What is the best time to visit Kashmir?',
        ]);
        $this->assertDatabaseHas('package_faqs', [
            'package_id' => $package->id,
            'question' => 'Are Union cabs required for local sightseeing?',
        ]);
    }
}
