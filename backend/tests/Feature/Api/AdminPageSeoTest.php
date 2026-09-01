<?php

namespace Tests\Feature\Api;

use App\Models\PageSeo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminPageSeoTest extends TestCase
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
            'email' => 'admin-page-seo@test.local',
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
            'email' => 'user-page-seo@test.local',
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

    private function validSeoPayload(array $overrides = []): array
    {
        return array_merge([
            'meta_title' => 'Updated Blogs Listing | Sunbird Vacations',
            'meta_description' => 'Updated blog listing description.',
            'canonical_url' => 'https://frontend.test/custom/blogs',
            'og_image' => '/images/custom-blogs-og.jpg',
            'is_indexable' => true,
        ], $overrides);
    }

    public function test_unauthenticated_user_cannot_show_page_seo(): void
    {
        $this->getJson('/api/admin/page-seo/blogs')->assertUnauthorized();
    }

    public function test_unauthenticated_user_cannot_update_page_seo(): void
    {
        $this->patchJson('/api/admin/page-seo/blogs', $this->validSeoPayload())
            ->assertUnauthorized();
    }

    public function test_non_admin_cannot_manage_page_seo(): void
    {
        $user = $this->createNonAdmin();
        $token = $user->createToken('admin-api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/admin/page-seo/blogs')
            ->assertForbidden();
    }

    public function test_admin_can_show_page_seo(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/page-seo/blogs')
            ->assertOk()
            ->assertJsonPath('data.page_key', 'blogs')
            ->assertJsonPath('data.seo.meta_title', 'Travel Blogs | Sunbird Vacations');
    }

    public function test_admin_can_update_page_seo_with_patch(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/page-seo/blogs', $this->validSeoPayload())
            ->assertOk()
            ->assertJsonPath('data.seo.meta_title', 'Updated Blogs Listing | Sunbird Vacations')
            ->assertJsonPath('data.seo.canonical_url', 'https://frontend.test/custom/blogs');

        $this->assertDatabaseHas('page_seo', [
            'page_key' => 'blogs',
            'meta_title' => 'Updated Blogs Listing | Sunbird Vacations',
        ]);
    }

    public function test_update_validation_rejects_invalid_canonical_url(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->patchJson('/api/admin/page-seo/blogs', $this->validSeoPayload([
                'canonical_url' => 'not-a-valid-url',
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['canonical_url']);
    }

    public function test_unknown_page_key_returns_404_for_admin(): void
    {
        $this->withHeaders($this->adminHeaders())
            ->getJson('/api/admin/page-seo/homepage')
            ->assertNotFound();
    }

    public function test_public_api_reflects_admin_page_seo_update(): void
    {
        $headers = $this->adminHeaders($this->createAdmin());

        $this->withHeaders($headers)
            ->patchJson('/api/admin/page-seo/blogs', $this->validSeoPayload([
                'meta_title' => 'Public Blogs SEO Title',
            ]))
            ->assertOk();

        $this->getJson('/api/page-seo/blogs')
            ->assertOk()
            ->assertJsonPath('data.seo.meta_title', 'Public Blogs SEO Title');
    }

    public function test_non_indexable_blogs_listing_is_excluded_from_sitemap(): void
    {
        config(['frontend.url' => 'https://frontend.test']);
        PageSeo::where('page_key', PageSeo::PAGE_KEY_BLOGS)->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/blogs</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/blogs/story-behind-sunbird-vacations</loc>', $content);
    }

    public function test_sitemap_uses_blogs_listing_canonical_url_when_set(): void
    {
        config(['frontend.url' => 'https://frontend.test']);

        PageSeo::where('page_key', PageSeo::PAGE_KEY_BLOGS)->update([
            'canonical_url' => 'https://frontend.test/custom/blogs-listing',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/blogs-listing</loc>', $content);
        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/blogs<\/loc>/', $content);
    }

    public function test_non_indexable_homepage_is_excluded_from_sitemap(): void
    {
        config(['frontend.url' => 'https://frontend.test']);
        PageSeo::where('page_key', PageSeo::PAGE_KEY_HOME)->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/<\/loc>/', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/packages</loc>', $content);
    }

    public function test_sitemap_uses_home_canonical_url_when_set(): void
    {
        config(['frontend.url' => 'https://frontend.test']);

        PageSeo::where('page_key', PageSeo::PAGE_KEY_HOME)->update([
            'canonical_url' => 'https://frontend.test/custom/home',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/home</loc>', $content);
        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/<\/loc>/', $content);
    }

    public function test_non_indexable_packages_listing_is_excluded_from_sitemap(): void
    {
        config(['frontend.url' => 'https://frontend.test']);
        PageSeo::where('page_key', PageSeo::PAGE_KEY_PACKAGES)->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/packages</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/packages/kashmir-paradise</loc>', $content);
    }

    public function test_sitemap_uses_packages_listing_canonical_url_when_set(): void
    {
        config(['frontend.url' => 'https://frontend.test']);

        PageSeo::where('page_key', PageSeo::PAGE_KEY_PACKAGES)->update([
            'canonical_url' => 'https://frontend.test/custom/packages-listing',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/packages-listing</loc>', $content);
        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/packages<\/loc>/', $content);
    }

    public function test_non_indexable_gallery_listing_is_excluded_from_sitemap(): void
    {
        config(['frontend.url' => 'https://frontend.test']);
        PageSeo::where('page_key', PageSeo::PAGE_KEY_GALLERY)->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/gallery</loc>', $content);
    }

    public function test_sitemap_uses_gallery_listing_canonical_url_when_set(): void
    {
        config(['frontend.url' => 'https://frontend.test']);

        PageSeo::where('page_key', PageSeo::PAGE_KEY_GALLERY)->update([
            'canonical_url' => 'https://frontend.test/custom/gallery-listing',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/gallery-listing</loc>', $content);
        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/gallery<\/loc>/', $content);
    }

    public function test_sitemap_does_not_include_search_url(): void
    {
        config(['frontend.url' => 'https://frontend.test']);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/search</loc>', $content);
    }

    public function test_non_indexable_contact_is_excluded_from_sitemap(): void
    {
        config(['frontend.url' => 'https://frontend.test']);
        PageSeo::where('page_key', PageSeo::PAGE_KEY_CONTACT)->update(['is_indexable' => false]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringNotContainsString('<loc>https://frontend.test/contact</loc>', $content);
        $this->assertStringContainsString('<loc>https://frontend.test/about</loc>', $content);
    }

    public function test_sitemap_uses_payment_policy_canonical_url_when_set(): void
    {
        config(['frontend.url' => 'https://frontend.test']);

        PageSeo::where('page_key', PageSeo::PAGE_KEY_PAYMENT_POLICY)->update([
            'canonical_url' => 'https://frontend.test/custom/payment-policy',
        ]);

        $content = $this->get('/api/sitemap.xml')->getContent();

        $this->assertStringContainsString('<loc>https://frontend.test/custom/payment-policy</loc>', $content);
        $this->assertDoesNotMatchRegularExpression('/<loc>https:\/\/frontend\.test\/payment-policy<\/loc>/', $content);
    }
}
