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
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('title');
            $table->string('subtitle', 500)->nullable();
            $table->string('view_all_path');
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->string('hero_image', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('sort_order');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
