<?php

use App\Models\Blog;
use App\Support\BlogContentBlocks;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->json('content_blocks')->nullable()->after('content');
        });

        Blog::query()
            ->whereNotNull('content')
            ->where(function ($query) {
                $query->whereNull('content_blocks')
                    ->orWhere('content_blocks', '[]')
                    ->orWhere('content_blocks', 'null');
            })
            ->each(function (Blog $blog) {
                $blocks = BlogContentBlocks::fromLegacyContent($blog->content ?? '');

                if ($blocks !== []) {
                    $blog->forceFill(['content_blocks' => $blocks])->saveQuietly();
                }
            });
    }

    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn('content_blocks');
        });
    }
};
