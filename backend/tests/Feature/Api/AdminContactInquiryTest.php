<?php

namespace Tests\Feature\Api;

use App\Models\ContactInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminContactInquiryTest extends TestCase
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
            'email' => 'admin-contact-inquiries@test.local',
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
            'email' => 'user-contact-inquiries@test.local',
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

    private function createInquiry(array $overrides = []): ContactInquiry
    {
        return ContactInquiry::create(array_merge([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '+91 98765 43210',
            'subject' => 'general',
            'message' => 'Test inquiry message.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PHPUnit',
        ], $overrides));
    }

    public function test_unauthenticated_user_cannot_list_contact_inquiries(): void
    {
        $this->getJson('/api/admin/contact-inquiries')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_show_contact_inquiry(): void
    {
        $inquiry = $this->createInquiry();

        $this->getJson("/api/admin/contact-inquiries/{$inquiry->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_contact_inquiries(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/contact-inquiries')
            ->assertForbidden();
    }

    public function test_admin_can_list_contact_inquiries(): void
    {
        $this->createInquiry();
        $this->createInquiry([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'subject' => 'booking',
        ]);

        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/contact-inquiries')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data',
                'meta' => ['current_page', 'per_page', 'total', 'last_page'],
            ])
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('data.0.first_name', 'Jane');
    }

    public function test_admin_can_filter_contact_inquiries_by_subject(): void
    {
        $this->createInquiry(['subject' => 'general']);
        $this->createInquiry(['subject' => 'support']);

        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/contact-inquiries?subject=support')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.subject', 'support');
    }

    public function test_admin_can_search_contact_inquiries(): void
    {
        $this->createInquiry(['first_name' => 'UniqueSearchName']);
        $this->createInquiry(['first_name' => 'Other']);

        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/contact-inquiries?search=UniqueSearchName')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.first_name', 'UniqueSearchName');
    }

    public function test_admin_can_show_contact_inquiry(): void
    {
        $inquiry = $this->createInquiry([
            'message' => 'Detailed inquiry message.',
        ]);

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/contact-inquiries/{$inquiry->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $inquiry->id)
            ->assertJsonPath('data.first_name', 'John')
            ->assertJsonPath('data.message', 'Detailed inquiry message.');
    }

    public function test_admin_show_returns_404_for_missing_inquiry(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/contact-inquiries/99999')
            ->assertNotFound();
    }
}
