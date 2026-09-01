<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RobotsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['app.url' => 'https://api.test']);
    }

    public function test_robots_returns_plain_text_response(): void
    {
        $this->get('/api/robots.txt')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
    }

    public function test_robots_contains_user_agent_and_allow_rules(): void
    {
        $content = $this->get('/api/robots.txt')->getContent();

        $this->assertStringContainsString('User-agent: *', $content);
        $this->assertStringContainsString('Allow: /', $content);
    }

    public function test_robots_references_sitemap_endpoint(): void
    {
        $content = $this->get('/api/robots.txt')->getContent();

        $this->assertStringContainsString('Sitemap: https://api.test/api/sitemap.xml', $content);
    }

    public function test_robots_does_not_require_authentication(): void
    {
        $this->get('/api/robots.txt')->assertOk();
    }
}
