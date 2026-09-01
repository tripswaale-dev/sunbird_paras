<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function createAdmin(array $overrides = []): User
    {
        $isAdmin = $overrides['is_admin'] ?? true;
        unset($overrides['is_admin']);

        $user = User::create(array_merge([
            'name' => 'Test Admin',
            'email' => 'admin@test.local',
            'password' => Hash::make('password123'),
        ], $overrides));

        if ($isAdmin) {
            $user->is_admin = true;
            $user->save();
        }

        return $user->fresh();
    }

    private function createUser(array $overrides = []): User
    {
        return $this->createAdmin(array_merge($overrides, [
            'name' => 'Regular User',
            'email' => 'user@test.local',
            'is_admin' => false,
        ]));
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $this->createAdmin();

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.local',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['token', 'user' => ['id', 'name', 'email']],
            ])
            ->assertJsonPath('data.user.email', 'admin@test.local');
    }

    public function test_login_fails_with_invalid_password(): void
    {
        $this->createAdmin();

        $this->postJson('/api/admin/login', [
            'email' => 'admin@test.local',
            'password' => 'wrong-password',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Invalid credentials.');
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $this->postJson('/api/admin/login', [
            'email' => 'missing@test.local',
            'password' => 'password123',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Invalid credentials.');
    }

    public function test_non_admin_user_cannot_login(): void
    {
        $this->createUser();

        $this->postJson('/api/admin/login', [
            'email' => 'user@test.local',
            'password' => 'password123',
        ])
            ->assertForbidden()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'You are not authorized to access the admin area.');
    }

    public function test_login_validation_failure(): void
    {
        $this->postJson('/api/admin/login', [
            'email' => 'not-an-email',
            'password' => '',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/admin/me')
            ->assertUnauthorized()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Unauthenticated.');
    }

    public function test_admin_can_access_me_endpoint(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/me')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', 'admin@test.local')
            ->assertJsonMissing(['password']);
    }

    public function test_non_admin_token_cannot_access_me_endpoint(): void
    {
        $user = $this->createUser();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/me')
            ->assertForbidden()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Forbidden.');
    }

    public function test_admin_can_logout_and_token_becomes_invalid(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/admin/logout')
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseCount('personal_access_tokens', 0);

        Auth::forgetGuards();

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/me')
            ->assertUnauthorized();
    }

    public function test_password_is_stored_hashed(): void
    {
        $admin = $this->createAdmin();

        $this->assertNotSame('password123', $admin->fresh()->password);
        $this->assertTrue(Hash::check('password123', $admin->fresh()->password));
    }

    public function test_login_response_does_not_expose_sensitive_fields(): void
    {
        $this->createAdmin();

        $response = $this->postJson('/api/admin/login', [
            'email' => 'admin@test.local',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonMissing(['password'])
            ->assertJsonMissing(['remember_token']);
    }
}
