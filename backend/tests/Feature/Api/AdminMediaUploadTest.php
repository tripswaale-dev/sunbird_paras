<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminMediaUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        File::deleteDirectory(public_path('uploads/testing'));
        Auth::forgetGuards();
        parent::tearDown();
    }

    private function createAdmin(): User
    {
        $user = User::create([
            'name' => 'Test Admin',
            'email' => 'admin-media@test.local',
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
            'email' => 'user-media@test.local',
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

    public function test_guest_cannot_upload_media(): void
    {
        $this->postJson('/api/admin/media', [
            'file' => UploadedFile::fake()->image('photo.jpg'),
        ])->assertUnauthorized();
    }

    public function test_non_admin_cannot_upload_media(): void
    {
        $token = $this->createNonAdmin()->createToken('admin-api')->plainTextToken;

        $this->post('/api/admin/media', [
            'file' => UploadedFile::fake()->image('photo.jpg'),
        ], ['Authorization' => 'Bearer '.$token])->assertForbidden();
    }

    public function test_admin_can_upload_an_image(): void
    {
        $file = UploadedFile::fake()->image('hero.jpg', 640, 480);

        $response = $this->post('/api/admin/media', [
            'file' => $file,
        ], $this->adminHeaders());

        $response
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.original_name', 'hero.jpg')
            ->assertJsonStructure([
                'success',
                'data' => ['path', 'url', 'original_name', 'mime_type'],
            ]);

        $path = $response->json('data.path');

        $this->assertIsString($path);
        $this->assertStringStartsWith('/uploads/testing/', $path);
        $this->assertFileExists(public_path(ltrim($path, '/')));
    }

    public function test_upload_rejects_non_image_files(): void
    {
        $this->post('/api/admin/media', [
            'file' => UploadedFile::fake()->create('notes.pdf', 120, 'application/pdf'),
        ], $this->adminHeaders())
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_upload_requires_a_file(): void
    {
        $this->postJson('/api/admin/media', [], $this->adminHeaders())
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }
}
