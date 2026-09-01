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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle', 500)->nullable();
            $table->string('location')->nullable();
            $table->unsignedInteger('price');
            $table->unsignedSmallInteger('duration_nights');
            $table->unsignedSmallInteger('duration_days');
            $table->string('category', 100)->nullable();
            $table->string('tag', 100)->nullable();
            $table->string('image', 500);
            $table->unsignedTinyInteger('pax')->nullable()->default(2);
            $table->boolean('is_active')->default(true);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url', 500)->nullable();
            $table->string('og_image', 500)->nullable();
            $table->boolean('is_indexable')->default(true);
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
