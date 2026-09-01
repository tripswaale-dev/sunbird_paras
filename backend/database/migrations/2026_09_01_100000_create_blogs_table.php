<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 150)->unique();
            $table->string('title');
            $table->text('excerpt');
            $table->longText('content');
            $table->string('author', 100);
            $table->string('category', 100);
            $table->string('image', 500);
            $table->timestamp('published_at')->nullable();
            $table->string('read_time_label', 50);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
