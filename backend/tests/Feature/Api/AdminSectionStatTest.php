<?php

namespace Tests\Feature\Api;

use App\Models\Section;
use App\Models\SectionStat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSectionStatTest extends TestCase
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
            'email' => 'admin-section-stats@test.local',
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
            'email' => 'user-section-stats@test.local',
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

    private function validStatPayload(array $overrides = []): array
    {
        return array_merge([
            'value' => '100+',
            'label' => 'test stat label',
            'sort_order' => 10,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_stats(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->getJson("/api/admin/sections/{$section->id}/stats")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_stat(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_show_stat(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->first();

        $this->getJson("/api/admin/sections/{$section->id}/stats/{$stat->id}")
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_stat(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->first();

        $this->patchJson("/api/admin/sections/{$section->id}/stats/{$stat->id}", [
            'label' => 'updated label',
        ])->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_stat(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->first();

        $this->deleteJson("/api/admin/sections/{$section->id}/stats/{$stat->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_stats(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson("/api/admin/sections/{$section->id}/stats")
            ->assertForbidden();
    }

    public function test_admin_can_manage_stats(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/stats")
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_list_section_stats(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/stats")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(4, 'data');
    }

    public function test_stats_are_ordered_by_sort_order(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $response = $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/stats")
            ->assertOk();

        $labels = collect($response->json('data'))->pluck('label')->all();

        $this->assertSame('years of experience', $labels[0]);
        $this->assertSame('destinations covered', $labels[3]);
    }

    public function test_seeded_popular_destinations_has_four_stats(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->assertSame(4, $section->stats()->count());
    }

    public function test_admin_can_create_stat(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '25+',
                'label' => 'hill stations visited',
                'sort_order' => 0,
            ]))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.value', '25+')
            ->assertJsonPath('data.label', 'hill stations visited')
            ->assertJsonPath('data.sort_order', 0);

        $this->assertDatabaseHas('section_stats', [
            'section_id' => $section->id,
            'value' => '25+',
            'label' => 'hill stations visited',
        ]);
    }

    public function test_create_validation_fails_for_missing_required_fields(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/stats", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['value', 'label', 'sort_order']);
    }

    public function test_create_fails_for_nonexistent_section(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/sections/99999/stats', $this->validStatPayload())
            ->assertNotFound();
    }

    public function test_duplicate_value_is_rejected(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '2+',
                'label' => 'different label',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['value']);
    }

    public function test_duplicate_label_is_rejected(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '99+',
                'label' => 'years of experience',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['label']);
    }

    public function test_section_id_cannot_be_injected_through_request_body(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $otherSection = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '5+',
                'label' => 'injected section stat',
                'section_id' => $otherSection->id,
            ]))
            ->assertCreated()
            ->assertJsonPath('data.label', 'injected section stat');

        $this->assertDatabaseHas('section_stats', [
            'section_id' => $section->id,
            'label' => 'injected section stat',
        ]);
        $this->assertDatabaseMissing('section_stats', [
            'section_id' => $otherSection->id,
            'label' => 'injected section stat',
        ]);
    }

    public function test_admin_can_show_stat(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->where('value', '90+')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/stats/{$stat->id}")
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.value', '90+')
            ->assertJsonPath('data.label', 'happy travellers');
    }

    public function test_show_returns_404_for_nonexistent_stat(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/stats/99999")
            ->assertNotFound();
    }

    public function test_show_returns_404_for_stat_in_another_section(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $popularSection = Section::where('slug', 'popular-destinations')->first();
        $popularStat = $popularSection->stats()->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/sections/{$section->id}/stats/{$popularStat->id}")
            ->assertNotFound();
    }

    public function test_admin_can_update_stat_with_put(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->where('value', '50+')->first();

        $this->withHeaders($this->adminHeaders())
            ->putJson("/api/admin/sections/{$section->id}/stats/{$stat->id}", [
                'value' => '55+',
                'label' => 'curated travel packages updated',
                'sort_order' => $stat->sort_order,
            ])
            ->assertOk()
            ->assertJsonPath('data.value', '55+')
            ->assertJsonPath('data.label', 'curated travel packages updated');
    }

    public function test_admin_can_partially_update_stat_with_patch(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->where('value', '15+')->first();
        $originalLabel = $stat->label;

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/stats/{$stat->id}", [
                'value' => '20+',
            ])
            ->assertOk()
            ->assertJsonPath('data.value', '20+')
            ->assertJsonPath('data.label', $originalLabel);
    }

    public function test_section_cannot_be_changed_through_update(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $otherSection = Section::where('slug', 'gateway-to-the-hills')->first();
        $stat = $section->stats()->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/stats/{$stat->id}", [
                'section_id' => $otherSection->id,
                'label' => 'updated label only',
            ])
            ->assertOk()
            ->assertJsonPath('data.label', 'updated label only');

        $this->assertDatabaseHas('section_stats', [
            'id' => $stat->id,
            'section_id' => $section->id,
            'label' => 'updated label only',
        ]);
    }

    public function test_update_fails_with_duplicate_label(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->where('value', '15+')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/sections/{$section->id}/stats/{$stat->id}", [
                'label' => 'happy travellers',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['label']);
    }

    public function test_updating_sort_order_changes_admin_and_public_ordering(): void
    {
        $section = Section::where('slug', 'popular-destinations')->first();
        $stat = $section->stats()->where('value', '15+')->first();
        $firstStat = $section->stats()->where('value', '2+')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/stats/{$firstStat->id}", [
                'sort_order' => 10,
            ])
            ->assertOk();

        $this->withHeaders($headers)
            ->patchJson("/api/admin/sections/{$section->id}/stats/{$stat->id}", [
                'sort_order' => 0,
            ])
            ->assertOk();

        $adminLabels = collect(
            $this->withHeaders($headers)
                ->getJson("/api/admin/sections/{$section->id}/stats")
                ->json('data')
        )->pluck('label')->all();

        $publicLabels = collect(
            $this->getJson('/api/sections/popular-destinations')->json('data.stats')
        )->pluck('label')->all();

        $this->assertSame('destinations covered', $adminLabels[0]);
        $this->assertSame('destinations covered', $publicLabels[0]);
    }

    public function test_created_stat_appears_in_public_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '12+',
                'label' => 'public visible stat',
                'sort_order' => 0,
            ]))
            ->assertCreated();

        $publicLabels = collect(
            $this->getJson('/api/sections/gateway-to-the-hills')->json('data.stats')
        )->pluck('label')->all();

        $this->assertContains('public visible stat', $publicLabels);
    }

    public function test_deleted_stat_is_removed_from_public_api(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '8+',
                'label' => 'removable public stat',
                'sort_order' => 0,
            ]))
            ->assertCreated();

        $stat = SectionStat::where('label', 'removable public stat')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/stats/{$stat->id}")
            ->assertOk();

        $publicLabels = collect(
            $this->getJson('/api/sections/gateway-to-the-hills')->json('data.stats')
        )->pluck('label')->all();

        $this->assertNotContains('removable public stat', $publicLabels);
    }

    public function test_admin_can_delete_stat(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '3+',
                'label' => 'deletable stat',
            ]))
            ->assertCreated();

        $stat = SectionStat::where('label', 'deletable stat')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/stats/{$stat->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('section_stats', ['id' => $stat->id]);
    }

    public function test_deleting_stat_does_not_delete_section(): void
    {
        $section = Section::where('slug', 'gateway-to-the-hills')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson("/api/admin/sections/{$section->id}/stats", $this->validStatPayload([
                'value' => '4+',
                'label' => 'section safe stat',
            ]))
            ->assertCreated();

        $stat = SectionStat::where('label', 'section safe stat')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/sections/{$section->id}/stats/{$stat->id}")
            ->assertOk();

        $this->assertDatabaseHas('sections', ['id' => $section->id, 'slug' => 'gateway-to-the-hills']);
    }

    public function test_seeded_stats_remain_intact(): void
    {
        $this->assertDatabaseCount('section_stats', 4);

        $section = Section::where('slug', 'popular-destinations')->first();

        $this->assertSame(4, $section->stats()->count());
        $this->assertDatabaseHas('section_stats', [
            'section_id' => $section->id,
            'value' => '2+',
            'label' => 'years of experience',
        ]);
        $this->assertDatabaseHas('section_stats', [
            'section_id' => $section->id,
            'value' => '90+',
            'label' => 'happy travellers',
        ]);
    }
}
