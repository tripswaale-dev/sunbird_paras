<?php

namespace Tests\Feature\Api;

use App\Models\PageContent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageContentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_page_content_show_returns_about_content(): void
    {
        $this->getJson('/api/page-content/about')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.pageKey', 'about')
            ->assertJsonStructure([
                'success',
                'data' => [
                    'pageKey',
                    'heroImage',
                    'heroTitle',
                    'heroSubtitle',
                    'introText',
                    'body',
                    'contactPhone',
                    'contactEmail',
                    'contactAddress',
                    'workingHours',
                ],
            ])
            ->assertJsonPath('data.heroTitle', 'The Story Behind Sunbird Vacations')
            ->assertJsonPath('data.heroImage', '/images/destinations/ladakh.jpg')
            ->assertJsonPath('data.contactPhone', null);
    }

    public function test_page_content_show_returns_contact_content(): void
    {
        $this->getJson('/api/page-content/contact')
            ->assertOk()
            ->assertJsonPath('data.pageKey', 'contact')
            ->assertJsonPath('data.heroTitle', 'Contact Us')
            ->assertJsonPath('data.contactPhone', '+91 81412 67610')
            ->assertJsonPath('data.contactEmail', 'vacations.sunbird@gmail.com')
            ->assertJsonPath('data.workingHours', "Monday - Saturday: 10:00 AM - 7:00 PM\nSunday: Closed");
    }

    public function test_unknown_page_key_returns_404(): void
    {
        $this->getJson('/api/page-content/home')
            ->assertNotFound();
    }

    public function test_inactive_page_content_returns_404_on_public_api(): void
    {
        PageContent::where('page_key', 'about')->update(['is_active' => false]);

        $this->getJson('/api/page-content/about')
            ->assertNotFound();
    }
}
