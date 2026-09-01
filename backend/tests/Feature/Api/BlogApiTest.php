<?php

namespace Tests\Feature\Api;

use App\Models\Blog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_blogs_index_returns_active_blogs(): void
    {
        $response = $this->getJson('/api/blogs');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonStructure([
                'success',
                'data' => [
                    [
                        'slug',
                        'title',
                        'excerpt',
                        'author',
                        'date',
                        'category',
                        'image',
                        'readTime',
                    ],
                ],
            ])
            ->assertJsonPath('data.0.slug', 'story-behind-sunbird-vacations')
            ->assertJsonPath('data.0.readTime', '3 min read')
            ->assertJsonMissingPath('data.0.content');
    }

    public function test_blog_show_returns_full_detail(): void
    {
        $response = $this->getJson('/api/blogs/story-behind-sunbird-vacations');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'story-behind-sunbird-vacations')
            ->assertJsonPath('data.title', 'The Story Behind Sunbird Vacations')
            ->assertJsonPath('data.author', 'Shwetangi')
            ->assertJsonPath('data.date', 'July 13, 2026')
            ->assertJsonPath('data.category', 'Story')
            ->assertJsonPath('data.image', '/images/destinations/ladakh.jpg')
            ->assertJsonPath('data.readTime', '3 min read');
    }

    public function test_blog_show_includes_content(): void
    {
        $response = $this->getJson('/api/blogs/story-behind-sunbird-vacations');

        $response->assertOk();

        $content = $response->json('data.content');
        $this->assertNotEmpty($content);
        $this->assertStringContainsString('Two years ago, Sunbird Vacations was born', $content);
        $this->assertStringContainsString('Welcome to Sunbird Vacations-', $content);
    }

    public function test_invalid_blog_slug_returns_404(): void
    {
        $this->getJson('/api/blogs/does-not-exist')
            ->assertNotFound()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Resource not found.');
    }

    public function test_inactive_blog_returns_404(): void
    {
        Blog::where('slug', 'story-behind-sunbird-vacations')->update(['is_active' => false]);

        $this->getJson('/api/blogs/story-behind-sunbird-vacations')
            ->assertNotFound();
    }
}
