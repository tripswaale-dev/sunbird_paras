<?php

namespace Tests\Feature\Api;

use App\Models\ContactInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactInquiryApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'firstName' => 'John',
            'lastName' => 'Doe',
            'phone' => '+91 98765 43210',
            'subject' => 'general',
            'message' => 'I would like to know more about your Kashmir packages.',
        ], $overrides);
    }

    public function test_contact_inquiry_can_be_submitted(): void
    {
        $this->postJson('/api/contact-inquiries', $this->validPayload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', 1)
            ->assertJsonPath('data.message', 'Thank you for your inquiry. We will get back to you soon.');

        $this->assertDatabaseHas('contact_inquiries', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '+91 98765 43210',
            'subject' => 'general',
            'message' => 'I would like to know more about your Kashmir packages.',
        ]);
    }

    public function test_contact_inquiry_accepts_snake_case_fields(): void
    {
        $this->postJson('/api/contact-inquiries', [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'phone' => '+91 90000 00000',
            'subject' => 'booking',
            'message' => 'Please help me book a package.',
        ])
            ->assertCreated()
            ->assertJsonPath('data.id', 1);

        $this->assertDatabaseHas('contact_inquiries', [
            'first_name' => 'Jane',
            'subject' => 'booking',
        ]);
    }

    public function test_contact_inquiry_stores_request_metadata(): void
    {
        $this->postJson('/api/contact-inquiries', $this->validPayload(), [
            'User-Agent' => 'SunbirdTestAgent/1.0',
        ])
            ->assertCreated();

        $inquiry = ContactInquiry::first();

        $this->assertNotNull($inquiry->ip_address);
        $this->assertSame('SunbirdTestAgent/1.0', $inquiry->user_agent);
    }

    public function test_contact_inquiry_validation_requires_all_fields(): void
    {
        $this->postJson('/api/contact-inquiries', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'first_name',
                'last_name',
                'phone',
                'subject',
                'message',
            ]);
    }

    public function test_contact_inquiry_validation_rejects_invalid_subject(): void
    {
        $this->postJson('/api/contact-inquiries', $this->validPayload([
            'subject' => 'invalid-subject',
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['subject']);
    }

    /**
     * @dataProvider validSubjectProvider
     */
    public function test_contact_inquiry_accepts_valid_subjects(string $subject): void
    {
        $this->postJson('/api/contact-inquiries', $this->validPayload([
            'subject' => $subject,
        ]))
            ->assertCreated();

        $this->assertDatabaseHas('contact_inquiries', [
            'subject' => $subject,
        ]);
    }

    public static function validSubjectProvider(): array
    {
        return [
            'general' => ['general'],
            'booking' => ['booking'],
            'custom' => ['custom'],
            'support' => ['support'],
        ];
    }
}
