<?php

namespace Tests\Feature\Api;

use App\Models\Package;
use App\Models\Section;
use App\Models\SectionCategory;
use App\Models\SectionPackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSectionCategoryTest extends TestCase
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
            'email' => 'admin-section-categories@test.local',
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
            'email' => 'user-section-categories@test.local',
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

    private function validCategoryPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Test Category',
            'filter_value' => 'Test Filter',
            'image' => '/images/test.jpg',
            'sort_order' => 50,
            'is_featured' => false,
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_categories(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->getJson("/api/admin/sections/{$section->id}/categories")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_show_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->first();

        $this->getJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->first();

        $this->patchJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
            'title' => 'Updated',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->first();

        $this->deleteJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_categories(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/sections/{$section->id}/categories")
            ->assertForbidden();
    }

    public function test_admin_can_manage_categories(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/categories")
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_list_section_categories(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/categories")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(4, 'data');
    }

    public function test_admin_list_includes_active_and_inactive_categories(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Inactive Category',
                'filter_value' => 'Inactive Filter',
                'is_active' => false,
            ]))
            ->assertCreated();

        $response = $this->withHeaders($headers)
            ->getJson("/api/admin/sections/{$section->id}/categories")
            ->assertOk();

        $titles = collect($response->json('data'))->pluck('title')->all();

        $this->assertContains('Inactive Category', $titles);
        $this->assertContains('Pocket-Friendly', $titles);
    }

    public function test_categories_are_ordered_by_sort_order(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $response = $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/categories")
            ->assertOk();

        $titles = collect($response->json('data'))->pluck('title')->all();

        $this->assertSame('Pocket-Friendly', $titles[0]);
        $this->assertSame('Couple Packages', $titles[3]);
    }

    public function test_admin_can_create_category(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'New Hill Category',
                'filter_value' => 'New Hill Filter',
                'sort_order' => 10,
            ]))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'New Hill Category')
            ->assertJsonPath('data.filter_value', 'New Hill Filter')
            ->assertJsonPath('data.sort_order', 10);

        $this->assertDatabaseHas('section_categories', [
            'section_id' => $section->id,
            'title' => 'New Hill Category',
            'filter_value' => 'New Hill Filter',
        ]);
    }

    public function test_create_validation_fails_for_missing_required_fields(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/categories", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'sort_order']);
    }

    public function test_create_fails_for_nonexistent_section(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/sections/99999/categories', $this->validCategoryPayload())
            ->assertNotFound();
    }

    public function test_duplicate_filter_value_is_rejected(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Duplicate Filter Title',
                'filter_value' => 'Pocket Friendly',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['filter_value']);
    }

    public function test_section_id_cannot_be_injected_through_request_body(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $otherSection = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Injected Section Category',
                'filter_value' => 'Injected Filter',
                'section_id' => $otherSection->id,
            ]))
            ->assertCreated()
            ->assertJsonPath('data.title', 'Injected Section Category');

        $this->assertDatabaseHas('section_categories', [
            'section_id' => $section->id,
            'title' => 'Injected Section Category',
        ]);
        $this->assertDatabaseMissing('section_categories', [
            'section_id' => $otherSection->id,
            'title' => 'Injected Section Category',
        ]);
    }

    public function test_admin_can_show_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->where('title', 'Pocket-Friendly')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Pocket-Friendly')
            ->assertJsonPath('data.filter_value', 'Pocket Friendly');
    }

    public function test_show_returns_404_for_nonexistent_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/categories/99999")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_category_in_another_section(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $otherSection = Section::where('slug', 'gateway-to-the-hills')->first();
        $otherCategory = $otherSection->categories()->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/categories/{$otherCategory->id}")
            ->assertNotFound();
    }

    public function test_admin_can_update_category_with_put(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $category = $section->categories()->where('title', 'Northern Himalayas')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
                'title' => 'Northern Himalayas Updated',
                'filter_value' => 'Northern Himalayas',
                'image' => $category->image,
                'sort_order' => $category->sort_order,
                'is_featured' => true,
                'is_active' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Northern Himalayas Updated')
            ->assertJsonPath('data.is_featured', true);
    }

    public function test_admin_can_partially_update_category_with_patch(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $category = $section->categories()->where('title', 'North-East')->first();
        $originalFilterValue = $category->filter_value;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
                'title' => 'North-East Updated',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'North-East Updated')
            ->assertJsonPath('data.filter_value', $originalFilterValue);
    }

    public function test_section_cannot_be_changed_through_update(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $otherSection = Section::where('slug', 'gateway-to-the-hills')->first();
        $category = $section->categories()->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
                'section_id' => $otherSection->id,
                'title' => 'Updated Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Title');

        $this->assertDatabaseHas('section_categories', [
            'id' => $category->id,
            'section_id' => $section->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_update_fails_with_duplicate_filter_value(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->where('title', 'Off-Beat')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
                'filter_value' => 'Pocket Friendly',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['filter_value']);
    }

    public function test_admin_can_deactivate_category(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->where('title', 'Adventure & Thrill')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('section_categories', [
            'id' => $category->id,
            'is_active' => false,
        ]);
    }

    public function test_deactivated_category_is_hidden_from_public_api(): void
    {
        $section = Section::where('slug', 'travel-your-way')->first();
        $category = $section->categories()->where('title', 'Couple Packages')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$category->id}", [
                'is_active' => false,
            ])
            ->assertOk();

        $publicTitles = collect(
            $this->getJson('/api/sections/travel-your-way')->json('data.categories')
        )->pluck('title')->all();

        $this->assertNotContains('Couple Packages', $publicTitles);
    }

    public function test_updating_sort_order_changes_ordering(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $northEast = $section->categories()->where('title', 'North-East')->first();
        $northernHimalayas = $section->categories()->where('title', 'Northern Himalayas')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$northernHimalayas->id}", [
                'sort_order' => 5,
            ])
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/categories/{$northEast->id}", [
                'sort_order' => 0,
            ])
            ->assertOk();

        $adminTitles = collect(
            $this->withHeaders($headers)
                ->getJson("/api/admin/sections/{$section->id}/categories")
                ->json('data')
        )->pluck('title')->all();

        $publicTitles = collect(
            $this->getJson('/api/sections/gateway-to-the-hills')->json('data.categories')
        )->pluck('title')->all();

        $this->assertSame('North-East', $adminTitles[0]);
        $this->assertSame('North-East', $publicTitles[0]);
    }

    public function test_admin_can_delete_category(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Deletable Category',
                'filter_value' => 'Deletable Filter',
            ]))
            ->assertCreated();

        $category = SectionCategory::where('title', 'Deletable Category')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('section_categories', ['id' => $category->id]);
    }

    public function test_deleting_category_does_not_delete_section(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Temp Delete Category',
                'filter_value' => 'Temp Delete Filter',
            ]))
            ->assertCreated();

        $category = SectionCategory::where('title', 'Temp Delete Category')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertOk();

        $this->assertDatabaseHas('sections', ['id' => $section->id, 'slug' => 'gateway-to-the-hills']);
    }

    public function test_deleting_category_does_not_delete_package(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $package = Package::where('slug', 'hill-1')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Package Safe Category',
                'filter_value' => 'Package Safe Filter',
            ]))
            ->assertCreated();

        $category = SectionCategory::where('title', 'Package Safe Category')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'slug' => 'hill-1']);
    }

    public function test_deleting_category_does_not_delete_section_package_assignments(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $assignmentCount = SectionPackage::where('section_id', $section->id)->count();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/categories", $this->validCategoryPayload([
                'title' => 'Assignment Safe Category',
                'filter_value' => 'Assignment Safe Filter',
            ]))
            ->assertCreated();

        $category = SectionCategory::where('title', 'Assignment Safe Category')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/categories/{$category->id}")
            ->assertOk();

        $this->assertSame($assignmentCount, SectionPackage::where('section_id', $section->id)->count());
    }

    public function test_seeded_categories_remain_intact(): void
    {
        $this->assertDatabaseCount('section_categories', 27);

        $travelYourWay = Section::where('slug', 'travel-your-way')->first();
        $this->assertSame(4, $travelYourWay->categories()->count());
        $this->assertDatabaseHas('section_categories', [
            'section_id' => $travelYourWay->id,
            'title' => 'Pocket-Friendly',
            'filter_value' => 'Pocket Friendly',
        ]);
    }
}
