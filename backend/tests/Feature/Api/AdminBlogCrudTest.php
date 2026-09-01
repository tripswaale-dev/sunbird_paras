<?php

namespace Tests\Feature\Api;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminBlogCrudTest extends TestCase
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
            'email' => 'admin-blogs@test.local',
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
            'email' => 'user-blogs@test.local',
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

    private function validBlogPayload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'test-blog-post',
            'title' => 'Test Blog Post',
            'excerpt' => 'A short excerpt for the test blog.',
            'content' => 'Full blog content for testing purposes.',
            'author' => 'Test Author',
            'category' => 'Travel',
            'image' => '/images/test.jpg',
            'published_at' => '2026-08-01',
            'read_time_label' => '5 min read',
            'is_active' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_list_blogs(): void
    {
        $this->getJson('/api/admin/blogs')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_create_blog(): void
    {
        $this->postJson('/api/admin/blogs', $this->validBlogPayload())
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_blog(): void
    {
        $blog = Blog::first();

        $this->putJson("/api/admin/blogs/{$blog->id}", ['title' => 'Updated'])
            ->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_delete_blog(): void
    {
        $blog = Blog::first();

        $this->deleteJson("/api/admin/blogs/{$blog->id}")
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_blogs(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/blogs')
            ->assertForbidden();
    }

    public function test_admin_can_list_blogs(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/blogs')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data',
                'meta' => ['current_page', 'per_page', 'total', 'last_page'],
            ])
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.slug', 'story-behind-sunbird-vacations');
    }

    public function test_admin_can_show_blog(): void
    {
        $blog = Blog::where('slug', 'story-behind-sunbird-vacations')->first();

        $this->withHeaders($this->adminHeaders())
            ->getJson("/api/admin/blogs/{$blog->id}")
            ->assertOk()
            ->assertJsonPath('data.slug', 'story-behind-sunbird-vacations')
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'slug',
                    'title',
                    'excerpt',
                    'content',
                    'author',
                    'category',
                    'image',
                    'published_at',
                    'read_time_label',
                    'is_active',
                    'meta_title',
                    'meta_description',
                    'canonical_url',
                    'og_image',
                    'is_indexable',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function test_admin_can_create_blog(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/blogs', $this->validBlogPayload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'test-blog-post')
            ->assertJsonPath('data.read_time_label', '5 min read');

        $this->assertDatabaseHas('blogs', ['slug' => 'test-blog-post']);
    }

    public function test_admin_can_create_blog_with_seo_fields(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/blogs', $this->validBlogPayload([
                'slug' => 'seo-blog-post',
                'meta_title' => 'SEO Blog Title',
                'meta_description' => 'SEO blog description.',
                'canonical_url' => 'https://example.com/blogs/seo-blog-post',
                'og_image' => '/images/seo-og.jpg',
                'is_indexable' => false,
            ]))
            ->assertCreated()
            ->assertJsonPath('data.meta_title', 'SEO Blog Title')
            ->assertJsonPath('data.is_indexable', false);

        $this->assertDatabaseHas('blogs', [
            'slug' => 'seo-blog-post',
            'meta_title' => 'SEO Blog Title',
            'is_indexable' => false,
        ]);
    }

    public function test_create_fails_with_invalid_canonical_url(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/blogs', $this->validBlogPayload([
                'canonical_url' => 'not-a-valid-url',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['canonical_url']);
    }

    public function test_admin_can_update_blog_seo_fields_with_patch(): void
    {
        $blog = Blog::where('slug', 'story-behind-sunbird-vacations')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/blogs/{$blog->id}", [
                'meta_title' => 'Updated SEO Title',
                'is_indexable' => false,
            ])
            ->assertOk()
            ->assertJsonPath('data.meta_title', 'Updated SEO Title')
            ->assertJsonPath('data.is_indexable', false);
    }

    public function test_create_fails_with_missing_required_fields(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/blogs', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'slug',
                'title',
                'excerpt',
                'content',
                'author',
                'category',
                'image',
                'published_at',
                'read_time_label',
            ]);
    }

    public function test_create_fails_with_duplicate_slug(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->postJson('/api/admin/blogs', $this->validBlogPayload([
                'slug' => 'story-behind-sunbird-vacations',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_admin_can_partially_update_blog_with_patch(): void
    {
        $blog = Blog::where('slug', 'story-behind-sunbird-vacations')->first();

        $this->withHeaders($this->adminHeaders())
            ->patchJson("/api/admin/blogs/{$blog->id}", [
                'title' => 'Updated Blog Title',
            ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated Blog Title')
            ->assertJsonPath('data.slug', 'story-behind-sunbird-vacations');
    }

    public function test_admin_can_delete_blog(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/blogs', $this->validBlogPayload([
                'slug' => 'deletable-blog',
            ]))
            ->assertCreated();

        $blog = Blog::where('slug', 'deletable-blog')->first();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/blogs/{$blog->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('blogs', ['slug' => 'deletable-blog']);
    }

    public function test_newly_created_active_blog_appears_in_public_api(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/blogs', $this->validBlogPayload([
                'slug' => 'public-visible-blog',
            ]))
            ->assertCreated();

        $slugs = collect($this->getJson('/api/blogs')->json('data'))
            ->pluck('slug')
            ->all();

        $this->assertContains('public-visible-blog', $slugs);
        $this->getJson('/api/blogs/public-visible-blog')->assertOk();
    }

    public function test_deactivated_blog_is_excluded_from_public_api(): void
    {
        $blog = Blog::where('slug', 'story-behind-sunbird-vacations')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/blogs/{$blog->id}", ['is_active' => false])
            ->assertOk();

        $publicSlugs = collect($this->getJson('/api/blogs')->json('data'))
            ->pluck('slug')
            ->all();

        $this->assertNotContains('story-behind-sunbird-vacations', $publicSlugs);
        $this->getJson('/api/blogs/story-behind-sunbird-vacations')->assertNotFound();
    }

    public function test_non_indexable_blog_is_excluded_from_sitemap_but_still_public(): void
    {
        $blog = Blog::where('slug', 'story-behind-sunbird-vacations')->first();
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson("/api/admin/blogs/{$blog->id}", ['is_indexable' => false])
            ->assertOk();

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/blogs/story-behind-sunbird-vacations</loc>', $content);
        $this->getJson('/api/blogs/story-behind-sunbird-vacations')->assertOk();
    }

    public function test_deleted_blog_returns_404_on_public_show(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->postJson('/api/admin/blogs', $this->validBlogPayload([
                'slug' => 'temp-public-blog',
            ]))
            ->assertCreated();

        $blog = Blog::where('slug', 'temp-public-blog')->first();
        $this->getJson('/api/blogs/temp-public-blog')->assertOk();

        $this->withHeaders($headers)
            ->deleteJson("/api/admin/blogs/{$blog->id}")
            ->assertOk();

        $this->getJson('/api/blogs/temp-public-blog')->assertNotFound();
    }
}
