<?php

namespace Tests\Feature\Api;

use App\Models\CustomerPromiseItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminCustomerPromiseItemTest extends TestCase
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
            'email' => 'admin-customer-promise@test.local',
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
            'email' => 'user-customer-promise@test.local',
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

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Updated Promise',
            'description' => 'Updated description text.',
            'icon' => CustomerPromiseItem::ICON_USERS,
            'sort_order' => 1,
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_customer_promise_items(): void
    {
        $this->getJson('/api/admin/customer-promise-items')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_customer_promise_item(): void
    {
        $this->patchJson('/api/admin/customer-promise-items/1', $this->validPayload())
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_customer_promise_items(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/customer-promise-items')
            ->assertForbidden();
    }

    public function test_admin_can_list_all_customer_promise_items(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/customer-promise-items')
            ->assertOk()
            ->assertJsonCount(4, 'data')
            ->assertJsonPath('data.0.title', 'We Listen')
            ->assertJsonPath('data.0.icon', 'headphones')
            ->assertJsonPath('data.3.title', 'We Stay with You');
    }

    public function test_admin_can_show_customer_promise_item(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/customer-promise-items/2')
            ->assertOk()
            ->assertJsonPath('data.id', 2)
            ->assertJsonPath('data.title', 'We Act Fast')
            ->assertJsonPath('data.icon', 'alarm-clock');
    }

    public function test_admin_can_update_customer_promise_item_with_patch(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/customer-promise-items/1', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Promise')
            ->assertJsonPath('data.icon', 'users');

        $this->assertDatabaseHas('customer_promise_items', [
            'id' => 1,
            'title' => 'Updated Promise',
            'icon' => 'users',
        ]);
    }

    public function test_unknown_customer_promise_item_returns_404(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/customer-promise-items/99')
            ->assertNotFound();
    }

    public function test_update_validation_rejects_invalid_icon(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/customer-promise-items/1', $this->validPayload([
                'icon' => 'mountain',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['icon']);
    }

    public function test_inactive_item_excluded_from_public_homepage(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/customer-promise-items/3', $this->validPayload([
                'title' => 'We Take Responsibility',
                'description' => 'If the issue is from our end, we take full responsibility and make it right.',
                'icon' => CustomerPromiseItem::ICON_HANDSHAKE,
                'sort_order' => 3,
                'is_active' => false,
            ]))
            ->assertOk();

        $this->getJson('/api/homepage')
            ->assertOk()
            ->assertJsonCount(3, 'data.customerPromises');
    }
}
